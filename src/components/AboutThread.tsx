import { useCallback, useEffect, useRef, useState } from "react";
import {
  ABOUT_PROFILES,
  THREAD_BAD_EMAIL,
  THREAD_FAILED,
  THREAD_INBOX,
  THREAD_OPENING,
  THREAD_SCRIPT,
  THREAD_SENT,
  THREAD_WHO,
} from "../content/aboutPage";

type Line = { from: "her" | "you"; text: string };
type Answers = Partial<Record<"name" | "about" | "email", string>>;

/**
 * Web3Forms relays the thread to THREAD_INBOX. The access key is public by
 * design — it only authorises posting to one fixed address, so there is nothing
 * to leak and no server of our own to run.
 *
 * When it is unset the thread still works and simply falls back to a prefilled
 * mailto, which is what a fork of this repo gets. Set it in `.env.local` as
 * VITE_WEB3FORMS_KEY, and in Vercel's environment variables to ship it.
 */
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

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
 * Deliberately permissive. This guards against a typo like a missing @, not
 * against a determined liar, and the strict patterns reject addresses that are
 * perfectly valid — the cost of a false rejection here is someone giving up.
 */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(value);

/**
 * The body of the mail, written here rather than left to the relay.
 *
 * Web3Forms renders whatever fields it is handed as a table of labels and
 * values, and a field it considers empty simply does not appear — which is how
 * mail arrived carrying a name and an address but nothing about why anyone had
 * written. Composing the body ourselves makes the message one piece of text
 * that cannot be reordered, relabelled or dropped, and every answer has a
 * fallback, so no line can go missing even if a step somehow arrives blank.
 *
 * Both delivery paths use it, so the mail reads the same whether it came
 * through the relay or the visitor's own client.
 */
const compose = (final: Answers) =>
  [
    final.about?.trim() || "(they didn't say what about)",
    "",
    `— ${final.name?.trim() || "someone"}`,
    `reply to: ${final.email?.trim() || "(no address given)"}`,
  ].join("\n");

/**
 * Contact as a message thread.
 *
 * Her replies arrive the way a real one does: your message posts immediately,
 * then a pause, then a typing indicator for about as long as the reply would
 * take to write, then the message. Replies used to appear in the same frame as
 * the send, which read as a form submitting rather than a conversation.
 *
 * The last answer posts the exchange to Spurti's inbox and her final message is
 * the send's own result, so "sent" is something that happened rather than
 * something the script claims. If the post fails — or if no access key is
 * configured — she says so and the composer offers the same exchange as a
 * prefilled mailto, so the conversation is never a dead end.
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
  const [answers, setAnswers] = useState<Answers>({});
  const [failed, setFailed] = useState(false);
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

  const mailto = (final: Answers) => {
    const subject = final.name ? `hello from ${final.name}` : "hello";
    return `mailto:${THREAD_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(final))}`;
  };

  /**
   * Posts the finished exchange, then says what actually happened. The typing
   * indicator covers the request, so a slow network reads as her writing back
   * rather than as the card having stalled.
   */
  const send = useCallback(
    async (final: Answers) => {
      setBusy(true);
      if (!reduced()) setTyping(true);

      let ok = false;
      if (ACCESS_KEY) {
        try {
          const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: ACCESS_KEY,
              subject: `spurtinimbali.com — ${final.name?.trim() || "someone"} said hi`,
              /*
               * The site, not the visitor. This only sets the display name on
               * the From line, and putting the visitor's there made the mail
               * look as though it came from their account — which is also why
               * a thread with a visitor called Spurti listed its participants
               * as "you, spurti". Who wrote in is in the subject and signed at
               * the foot of the message.
               */
              from_name: "spurtinimbali.com",
              /* The relay makes this the Reply-To, so replying just works. */
              email: final.email,
              message: compose(final),
              /*
               * Web3Forms treats a filled botcheck as spam. Sent empty to hold
               * up our end of that contract — it is not doing much work here,
               * since there is no rendered field for a form-scraping bot to
               * find and anything posting to the API directly would omit it
               * too.
               */
              botcheck: "",
            }),
          });
          ok = res.ok && (await res.json().catch(() => ({ success: false }))).success === true;
        } catch {
          ok = false;
        }
      }

      setTyping(false);
      setFailed(!ok);
      setLines((prev) => [...prev, { from: "her", text: ok ? THREAD_SENT : THREAD_FAILED }]);
      setBusy(false);
    },
    [],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy || step >= THREAD_SCRIPT.length) return;

    const active = THREAD_SCRIPT[step];

    // Your message posts straight away — only her side waits.
    setLines((prev) => [...prev, { from: "you", text }]);
    setDraft("");

    // A bad address is re-asked in place: the step does not advance, so the
    // same question comes round again rather than the thread moving on without
    // anywhere to send the reply.
    if (active.field === "email" && !looksLikeEmail(text)) {
      setBusy(true);
      say([THREAD_BAD_EMAIL, active.ask]);
      return;
    }

    const final = { ...answers, [active.field]: text };
    setAnswers(final);
    setStep(step + 1);

    const replies = [active.reply, THREAD_SCRIPT[step + 1]?.ask].filter(Boolean) as string[];

    if (replies.length) {
      setBusy(true);
      say(replies);
    } else {
      void send(final);
    }
  };

  const current = THREAD_SCRIPT[Math.min(step, THREAD_SCRIPT.length - 1)];

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
        {/* GitHub and LinkedIn only. The thread itself is the way to reach her
            by mail now that it delivers, so an email icon beside it was two
            controls for one job. */}
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
        {/* Appears the moment ABOUT_PROFILES.linkedin holds a URL, and not one
            moment before — see the note there. */}
        {ABOUT_PROFILES.linkedin ? (
          <a
            className="ab-composer__icon"
            href={ABOUT_PROFILES.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M14.6 0H1.4A1.4 1.4 0 000 1.4v13.2A1.4 1.4 0 001.4 16h13.2a1.4 1.4 0 001.4-1.4V1.4A1.4 1.4 0 0014.6 0zM4.9 13.6H2.6V6h2.3v7.6zM3.7 5a1.34 1.34 0 110-2.7 1.34 1.34 0 010 2.7zm9.9 8.6h-2.3V9.5c0-1-.35-1.66-1.23-1.66-.67 0-1.07.45-1.25.89-.06.16-.08.37-.08.59v4.29H6.44s.03-6.96 0-7.6h2.3v1.08c.3-.47.85-1.14 2.07-1.14 1.51 0 2.64.99 2.64 3.11v4.55z" />
            </svg>
          </a>
        ) : null}

        {/* Only offered when the send failed. On success there is nothing left
            to do, and a mail button under a delivered message would suggest
            otherwise. */}
        {done && failed ? (
          <a className="ab-composer__done" href={mailto(answers)}>
            Open this in your mail app
            <span aria-hidden="true">↗</span>
          </a>
        ) : done ? (
          /* Holds the row's height once the input goes, so the card doesn't end
             on a lone icon in a collapsed strip. Her message above is the real
             confirmation; this is just the composer at rest. */
          <p className="ab-composer__sent">
            <span aria-hidden="true">✓</span>
            sent
          </p>
        ) : (
          <>
            <label className="sr-only" htmlFor="ab-msg">
              {current.ask}
            </label>
            <input
              id="ab-msg"
              className="ab-composer__input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={busy ? "…" : current.placeholder}
              disabled={busy}
              autoComplete="off"
              /*
               * Deliberately not type="email". That hands validation to the
               * browser, which blocks the submit and answers with a native
               * tooltip — and a validation bubble is exactly the "form
               * submitting" feel this card exists to avoid. The address is
               * checked in submit instead, so a typo comes back as her asking
               * again. inputMode still gets the @ keyboard on a phone.
               */
              inputMode={current.field === "email" ? "email" : undefined}
              autoCapitalize={current.field === "email" ? "off" : undefined}
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
    </>
  );
}
