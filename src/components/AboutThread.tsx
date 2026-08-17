import { useCallback, useEffect, useRef, useState } from "react";
import { THREAD_OPENING, THREAD_SCRIPT, THREAD_WHO } from "../content/aboutPage";

type Line = { from: "her" | "you"; text: string };

const EMAIL = "snimbali@stanford.edu";

/** Pause before she starts typing, and how long a reply takes to write. */
const BEAT = 420;
const PER_CHAR = 26;
const MIN_TYPE = 700;
const MAX_TYPE = 1800;

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Longer messages take longer to type, within bounds. */
const typingTime = (text: string) =>
  Math.min(MAX_TYPE, Math.max(MIN_TYPE, text.length * PER_CHAR));

/**
 * Contact as a message thread.
 *
 * Her replies arrive the way a real one does: your message posts immediately,
 * then a pause, then a typing indicator for about as long as the reply would
 * take to write, then the message. Replies used to appear in the same frame as
 * the send, which read as a form submitting rather than a conversation.
 *
 * Still no server and nothing stored: your text lives in component state, and
 * the last step hands the exchange to your own mail client as a prefilled
 * mailto. If you never press that, nothing leaves the tab.
 */
export function AboutThread() {
  const [lines, setLines] = useState<Line[]>([
    ...THREAD_OPENING.map((text) => ({ from: "her", text }) as Line),
    { from: "her", text: THREAD_SCRIPT[0].ask },
  ]);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const timers = useRef<number[]>([]);

  const done = step >= THREAD_SCRIPT.length && !busy;

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Follow the newest message, including while the indicator is showing.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /** Plays her messages one at a time, with a typing beat before each. */
  const say = useCallback(
    (texts: string[]) => {
      let t = 0;
      texts.forEach((text, i) => {
        const think = reduced() ? 0 : BEAT;
        const write = reduced() ? 0 : typingTime(text);

        t += think;
        const showTypingAt = t;
        t += write;
        const showMessageAt = t;

        if (write) after(showTypingAt, () => setTyping(true));
        after(showMessageAt, () => {
          setTyping(false);
          setLines((prev) => [...prev, { from: "her", text }]);
          if (i === texts.length - 1) setBusy(false);
        });
      });
    },
    [after],
  );

  const mailto = () => {
    const [name = "", about = ""] = answers;
    const subject = name ? `hello from ${name}` : "hello";
    const body = [about, "", name ? `— ${name}` : ""].filter(Boolean).join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy || step >= THREAD_SCRIPT.length) return;

    // Your message posts straight away — only her side waits.
    setLines((prev) => [...prev, { from: "you", text }]);
    setAnswers((prev) => [...prev, text]);
    setDraft("");
    setBusy(true);

    const replies = [THREAD_SCRIPT[step].reply, THREAD_SCRIPT[step + 1]?.ask].filter(
      Boolean,
    ) as string[];

    setStep(step + 1);
    if (replies.length) say(replies);
    else setBusy(false);
  };

  const active = THREAD_SCRIPT[Math.min(step, THREAD_SCRIPT.length - 1)];

  return (
    <>
      <ol className="ab-thread" ref={listRef}>
        {lines.map((line, i) => {
          const next = lines[i + 1];
          const showWho = line.from === "her" && lines[i - 1]?.from !== "her";
          // Avatar and tail belong to the last message of a run. While she is
          // typing, the indicator carries the tail instead.
          const endsRun =
            line.from !== next?.from && !(typing && line.from === "her" && !next);
          return (
            <li key={i} className={`ab-row ab-row--${line.from}${endsRun ? " ends-run" : ""}`}>
              {line.from === "her" ? (
                <>
                  <span className="ab-avatar" aria-hidden="true">
                    <img src={THREAD_WHO.avatar} alt="" />
                  </span>
                  <span className="ab-said">
                    {showWho ? <span className="ab-who">{THREAD_WHO.name}</span> : null}
                    <span className="ab-bubble ab-bubble--her">{line.text}</span>
                  </span>
                </>
              ) : (
                <span className="ab-bubble ab-bubble--you">{line.text}</span>
              )}
            </li>
          );
        })}

        {typing ? (
          <li className="ab-row ab-row--her ends-run">
            <span className="ab-avatar" aria-hidden="true">
              <img src={THREAD_WHO.avatar} alt="" />
            </span>
            <span className="ab-said">
              <span
                className="ab-bubble ab-bubble--her ab-typing"
                role="status"
                aria-label={`${THREAD_WHO.name} is typing`}
              >
                <i />
                <i />
                <i />
              </span>
            </span>
          </li>
        ) : null}
      </ol>

      <form className="ab-composer" onSubmit={submit}>
        <a
          className="ab-composer__icon"
          href={`mailto:${EMAIL}`}
          aria-label="Email instead"
          title="Email instead"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M1.5 3h13v10h-13zM2 3.6l6 4.2 6-4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </a>
        <a
          className="ab-composer__icon"
          href="https://github.com/SpurtiNimbali"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 .8a7.2 7.2 0 00-2.3 14c.36.07.5-.15.5-.35v-1.2c-2 .44-2.43-.97-2.43-.97-.33-.83-.8-1.06-.8-1.06-.66-.45.05-.44.05-.44.73.05 1.11.75 1.11.75.65 1.1 1.7.79 2.11.6.07-.47.25-.79.46-.97-1.6-.18-3.28-.8-3.28-3.56 0-.79.28-1.43.74-1.93-.07-.19-.32-.92.07-1.92 0 0 .6-.2 1.98.73a6.9 6.9 0 013.6 0c1.38-.93 1.98-.73 1.98-.73.39 1 .14 1.73.07 1.92.46.5.74 1.14.74 1.93 0 2.77-1.69 3.38-3.29 3.56.26.22.49.66.49 1.33v1.97c0 .2.13.43.5.35A7.2 7.2 0 008 .8z" />
          </svg>
        </a>

        {done ? (
          <a className="ab-composer__done" href={mailto()}>
            Open this in your mail app
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <>
            <label className="sr-only" htmlFor="ab-msg">
              {active.ask}
            </label>
            <input
              id="ab-msg"
              className="ab-composer__input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={busy ? "…" : active.placeholder}
              disabled={busy}
              autoComplete="off"
            />
            <button
              type="submit"
              className="ab-composer__send"
              disabled={!draft.trim() || busy}
              aria-label="Send"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 13V4M8 3.2l4 4M8 3.2l-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </form>

      <p className="ab-composer__note">
        Nothing is sent from here — the last step opens your own mail app.
      </p>
    </>
  );
}
