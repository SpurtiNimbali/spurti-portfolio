export type ResearchSection = "papers" | "writing";

export type ResearchPageSection = ResearchSection | "experience";

export type ResearchLink = {
  label: string;
  href: string;
};

/**
 * A paper is a one-line question closed, so that question is all the row shows
 * until it is opened. Opening it adds a short summary and the links, and
 * nothing else: the paper itself is the place for the method and the figures.
 */
export type ResearchEntry = {
  id: string;
  year: number;
  name: string;
  section: ResearchSection;
  /** One line. It is the whole row when collapsed, so it cannot wrap twice. */
  question: string;
  /** Three or four lines: what it does, what came of it, what it does not do. */
  summary: string;
  meta?: string;
  links?: ResearchLink[];
};

export type LabEntry = {
  id: string;
  affiliation: string;
  /** The lab's own site — the affiliation is the link, so every lab needs one. */
  href: string;
  role: string;
  period: string;
  /** Named without the "Advised by" — the entry supplies that. */
  advisors?: string;
  work: string;
};

/* Where the work happens leads; what came out of it follows. */
export const RESEARCH_PAGE_SECTION_ORDER: ResearchPageSection[] = ["experience", "papers"];

export const RESEARCH_ENTRIES: ResearchEntry[] = [
  {
    id: "anchorchain",
    year: 2026,
    name: "AnchorChain",
    section: "papers",
    question: "Can a simulated patient change every session and stay the same person?",
    summary:
      "Simulators either freeze a patient or evolve one with no standard for whether the change looks like a real course. AnchorChain holds core beliefs in a frozen anchor and lets only a separate symptom state move, then scores that movement against the session-by-session course of 85 real depression and anxiety patients rather than against human judgments of realism.",
    meta: "Stanford Translational AI Lab, with Prof. Ehsan Adeli and Fangrui Huang. Under review.",
  },
  {
    id: "mindbridge",
    year: 2026,
    name: "MindBridge",
    section: "papers",
    question: "Can you reconstruct an image somebody is only imagining?",
    summary:
      "Perception-trained fMRI decoders fail on mental imagery outright, because the signal is weaker and lives in a different distribution. MindBridge maps the two neural spaces onto each other with a residual adapter, reaching 65.7% two-way retrieval against a 50% chance baseline. It recovers the category, not the specific image.",
    meta: "CS 231N final project, with Ahan Devgun and Anya Pinto.",
    links: [
      { label: "github", href: "http://github.com/ahdevgun/mindbridge" },
      { label: "poster", href: "/research/mindbridge/poster.webp" },
    ],
  },
  {
    id: "calm-before-the-storm",
    year: 2025,
    name: "Calm Before the Storm",
    section: "papers",
    question: "Do seizures stay random right before one happens?",
    summary:
      "Simulating 5,000 inter-event intervals under three regimes showed that only reduced variability produces stable deviations from exponential timing. A faster rate does not, which matters because rate increases are the obvious thing to mistake for a precursor. Loss of temporal randomness is a cheaper marker than feature-heavy EEG, on simulated dynamics rather than real recordings.",
    meta: "CS109 challenge project. Best Project Award finalist, top 1%.",
    links: [
      { label: "read the paper", href: "/research/papers/calm-before-the-storm.pdf" },
      { label: "video", href: "https://youtu.be/aDS8u_-tmy0" },
    ],
  },
  {
    id: "dysdiag",
    year: 2023,
    name: "DysDiag",
    section: "papers",
    question: "Can learning disabilities be screened for without a clinic?",
    summary:
      "A multimodal screener for dyslexia, dysgraphia, and dyscalculia in five-to-eight-year-olds, reading handwriting, facial emotion during the task, and caregiver surveys together. F1 of 0.785 and 0.964 across classifiers, with 90% sensitivity and 90% specificity in a case-control study of 40 children. A first-level screening tool, not a diagnosis.",
    meta: "First-authored and published in IJARIIT. Award Winner at International Science and Engineering Fair (ISEF) 2023.",
    links: [
      {
        label: "read the paper",
        href: "https://www.ijariit.com/manuscript/a-novel-risk-assessment-and-screening-tool-for-learning-disorders-in-children/",
      },
      {
        label: "project board",
        href: "https://isef.net/project/beha021-risk-assessment-tool-for-learning-disorders",
      },
    ],
  },
  /* Kept for the About page; "writing" is absent from the section order, so it does not render here. */
  {
    id: "right-amount-of-wrong",
    year: 2025,
    name: "The Right Amount of Wrong",
    section: "writing",
    question: "How much wrong does an AI need to be intelligent?",
    summary:
      "Kasparov called a 1997 Deep Blue move too intelligent to be computational; it was a bug that made the machine play a random legal move. Drawing on developmental psychology, the error-related negativity, and automation-bias research, the essay argues fallibility is the mechanism of intelligence rather than a defect in it, and that the danger in current systems is that they err silently.",
    meta: "Writing and Rhetoric 2: Rhetoric of Imperfection.",
    links: [{ label: "read the draft", href: "/research/papers/right-amount-of-wrong.pdf" }],
  },
];

export const LAB_ENTRIES: LabEntry[] = [
  {
    id: "translational-ai-lab",
    affiliation: "Stanford Translational AI Lab",
    href: "https://stai.stanford.edu/projects",
    role: "Undergraduate Researcher",
    period: "Mar 2026 – Present",
    advisors: "Prof. Ehsan Adeli and Fangrui Huang, PhD candidate",
    work: "Working on multi-session therapy patient simulation and benchmarking commercial LLM therapy apps.",
  },
  {
    id: "snyder-lab",
    affiliation: "Stanford Snyder Lab",
    href: "https://med.stanford.edu/content/sm/snyderlab.html/",
    role: "Head of App Development",
    period: "Jun 2026 – Present",
    work: "Developing a clinical app for 400+ patients with hardware wearable integration, LLM-guided flow, and multimodal biosignal capture.",
  },
  {
    id: "language-cognition-lab",
    affiliation: "Stanford Language and Cognition Lab",
    href: "https://langcog.stanford.edu/",
    role: "Research Assistant",
    period: "Dec 2024 – Dec 2025",
    advisors: "Prof. Mike Frank and Veronica Boyce, PhD candidate",
    work: "Built scalable data pipelines to standardize cross-study datasets for NLP analysis of child language use. Developed sentence embedding pipelines to model and visualize communicative structure across interactions.",
  },
];

export function researchForSection(section: ResearchSection): ResearchEntry[] {
  return RESEARCH_ENTRIES.filter((entry) => entry.section === section);
}
