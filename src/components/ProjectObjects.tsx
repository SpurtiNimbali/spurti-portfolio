import type { ReactElement } from "react";

/**
 * Project objects, built the way the Read Me artifacts are: a solid face on a
 * hard extruded back, every shape carrying a dark outline, one saturated body
 * colour. Each one is the specific thing the project does rather than a stock
 * symbol, so a band carries one or two of these instead of a row of chips.
 */

export type ObjectKind = "monitor" | "trophy" | "flame" | "stopwatch" | "heart" | "journal";

/** A bedside vitals monitor: the trace a family watches from outside the room. */
function MonitorObject() {
  return (
    <svg className="pj-obj pj-obj--monitor" viewBox="0 0 98 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pjm-case" x1="14" y1="8" x2="82" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9AD5FF" />
          <stop offset="1" stopColor="#2E77D0" />
        </linearGradient>
      </defs>

      <rect x="26" y="88" width="46" height="10" rx="5" fill="#57A3EE" stroke="#0E3A66" strokeWidth="1.8" />
      <rect x="40" y="68" width="18" height="24" rx="5" fill="#3D86DC" stroke="#0E3A66" strokeWidth="1.8" />

      <rect x="10" y="10" width="82" height="66" rx="14" fill="#1D5CA8" stroke="#0E3A66" strokeWidth="1.8" />
      <rect x="6" y="6" width="82" height="66" rx="14" fill="url(#pjm-case)" stroke="#0E3A66" strokeWidth="1.8" />

      <rect x="12" y="12" width="55" height="54" rx="8" fill="#08182E" stroke="#0E3A66" strokeWidth="1.6" />
      <path
        d="M16 38h8l4.5-15 6.5 29 5.5-18 4.5 11h8"
        fill="none"
        stroke="#6BE8B0"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#2F6EA8">
        <rect x="16" y="53" width="20" height="3.6" rx="1.8" />
        <rect x="39" y="53" width="12" height="3.6" rx="1.8" />
      </g>

      <rect x="71" y="14" width="13" height="10" rx="3.5" fill="#FFF3D6" stroke="#0E3A66" strokeWidth="1.5" />
      <rect x="71" y="28" width="13" height="10" rx="3.5" fill="#FFD166" stroke="#0E3A66" strokeWidth="1.5" />
      <circle cx="77.5" cy="52" r="6.5" fill="#FF7FA8" stroke="#0E3A66" strokeWidth="1.6" />
    </svg>
  );
}

/** The Adobe hackathon cup SaySo won. */
function TrophyObject() {
  return (
    <svg className="pj-obj pj-obj--trophy" viewBox="0 0 90 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pjt-cup" x1="20" y1="8" x2="64" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE79A" />
          <stop offset="1" stopColor="#EDA80C" />
        </linearGradient>
      </defs>

      <path d="M22 14h48v16c0 13.3-10.7 24-24 24s-24-10.7-24-24z" fill="#BE7F00" stroke="#7E5600" strokeWidth="1.8" />
      <rect x="41" y="48" width="14" height="34" rx="5" fill="#D69B08" stroke="#7E5600" strokeWidth="1.8" />
      <rect x="22" y="82" width="48" height="12" rx="6" fill="#C98A00" stroke="#7E5600" strokeWidth="1.8" />

      <g fill="none" stroke="#7E5600" strokeWidth="3.4" strokeLinecap="round">
        <path d="M18 21c-9 0-13 4-13 9.5S10.5 40 17 40" />
        <path d="M66 21c9 0 13 4 13 9.5S73.5 40 67 40" />
      </g>

      <rect x="18" y="78" width="48" height="12" rx="6" fill="#F2B417" stroke="#7E5600" strokeWidth="1.8" />
      <path
        d="M18 10h48v16c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
        fill="url(#pjt-cup)"
        stroke="#7E5600"
        strokeWidth="1.8"
      />
      <path d="M18 17h48" stroke="#7E5600" strokeWidth="1.6" opacity=".45" />
      <path
        d="M42 21.5 45 28l7.1.8-5.3 4.8 1.5 7-6.3-3.6-6.3 3.6 1.5-7-5.3-4.8 7.1-.8z"
        fill="#FFF6DC"
        stroke="#7E5600"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Cook or get cooked. */
function FlameObject() {
  return (
    <svg className="pj-obj pj-obj--flame" viewBox="0 0 84 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pjf-body" x1="20" y1="10" x2="62" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC489" />
          <stop offset="1" stopColor="#F04E22" />
        </linearGradient>
      </defs>

      <path
        d="M46 12c2 14 8 18 14 26 5 6.6 7 12.6 7 19 0 15-9.4 25-21 25s-21-10-21-25c0-5.4 1.6-10 5-15 .6 3.6 2.4 6.2 5 7.6-3-11 1-22 11-37.6Z"
        fill="#C13413"
        stroke="#78200A"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M42 8c2 14 8 18 14 26 5 6.6 7 12.6 7 19 0 15-9.4 25-21 25s-21-10-21-25c0-5.4 1.6-10 5-15 .6 3.6 2.4 6.2 5 7.6-3-11 1-22 11-37.6Z"
        fill="url(#pjf-body)"
        stroke="#78200A"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M42 44c6 8 12 13 12 21 0 7-5.4 12-12 12s-12-5-12-12c0-8 6-13 12-21Z"
        fill="#FFE3B0"
        stroke="#78200A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The 24-hour clock a dare runs against. */
function StopwatchObject() {
  return (
    <svg className="pj-obj pj-obj--stopwatch" viewBox="0 0 92 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pjs-case" x1="16" y1="24" x2="72" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E9F1FA" />
          <stop offset="1" stopColor="#7891B4" />
        </linearGradient>
      </defs>

      <rect x="38" y="6" width="16" height="18" rx="5" fill="#546E8E" stroke="#2E4258" strokeWidth="1.8" />
      <rect x="30" y="2" width="32" height="10" rx="5" fill="#DCE7F5" stroke="#2E4258" strokeWidth="1.8" />
      <rect
        x="66"
        y="16"
        width="12"
        height="9"
        rx="3.5"
        fill="#8FA7C4"
        stroke="#2E4258"
        strokeWidth="1.6"
        transform="rotate(38 72 20.5)"
      />

      <circle cx="50" cy="60" r="32" fill="#546E8E" stroke="#2E4258" strokeWidth="1.8" />
      <circle cx="46" cy="56" r="32" fill="url(#pjs-case)" stroke="#2E4258" strokeWidth="1.8" />
      <circle cx="46" cy="56" r="24.5" fill="#FFF6E2" stroke="#2E4258" strokeWidth="1.6" />

      <g stroke="#2E4258" strokeWidth="2" strokeLinecap="round" opacity=".55">
        <path d="M46 35v4M46 73v4M25 56h4M63 56h4" />
      </g>
      <path
        d="M46 56V40M46 56l11 8"
        stroke="#2E4258"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="56" r="3" fill="#F04E22" stroke="#2E4258" strokeWidth="1.3" />
    </svg>
  );
}

/** A child's heart, and the trace the family learns to read. */
function HeartObject() {
  return (
    <svg className="pj-obj pj-obj--heart" viewBox="0 0 96 92" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pjh-body" x1="24" y1="22" x2="68" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC7D8" />
          <stop offset="1" stopColor="#EE5480" />
        </linearGradient>
      </defs>

      <path
        d="M50 72C34 61 26 52 26 42a13 13 0 0 1 24-7 13 13 0 0 1 24 7c0 10-8 19-24 30Z"
        fill="#C13058"
        stroke="#7C1B34"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M46 68C30 57 22 48 22 38a13 13 0 0 1 24-7 13 13 0 0 1 24 7c0 10-8 19-24 30Z"
        fill="url(#pjh-body)"
        stroke="#7C1B34"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M27 45h6.5l3.4-8.4 5 15.4 3.6-9.4 2.6 5h17"
        fill="none"
        stroke="#FFF1F5"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The running list of questions you bring to the next appointment. */
function JournalObject() {
  return (
    <svg className="pj-obj pj-obj--journal" viewBox="0 0 88 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pjj-cover" x1="14" y1="10" x2="70" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#86E3AE" />
          <stop offset="1" stopColor="#2F9E67" />
        </linearGradient>
      </defs>

      <rect x="20" y="16" width="58" height="76" rx="10" fill="#1E8A55" stroke="#135F3B" strokeWidth="1.8" />
      <rect x="14" y="10" width="58" height="76" rx="10" fill="url(#pjj-cover)" stroke="#135F3B" strokeWidth="1.8" />
      <rect x="21" y="17" width="44" height="62" rx="6" fill="#FFFDF4" stroke="#135F3B" strokeWidth="1.6" />

      <g stroke="#2F9E67" strokeWidth="2.6" strokeLinecap="round">
        <path d="M35 31h22M35 45h22M35 59h14" />
      </g>
      <g stroke="#EE5480" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M26 30.5l2.6 2.6L33 28M26 44.5l2.6 2.6L33 42M26 58.5l2.6 2.6L33 56" />
      </g>

      <rect x="10" y="10" width="9" height="76" rx="4.5" fill="#25865A" stroke="#135F3B" strokeWidth="1.8" />
      <path d="M56 10h11v26l-5.5-6-5.5 6z" fill="#FFD166" stroke="#135F3B" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

const OBJECTS: Record<ObjectKind, () => ReactElement> = {
  monitor: MonitorObject,
  trophy: TrophyObject,
  flame: FlameObject,
  stopwatch: StopwatchObject,
  heart: HeartObject,
  journal: JournalObject,
};

export function ProjectObject({ kind }: { kind: ObjectKind }) {
  const Shape = OBJECTS[kind];
  return <Shape />;
}
