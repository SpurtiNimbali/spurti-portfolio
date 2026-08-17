export type ResearchSection = "papers" | "writing";

export type ResearchPageSection = ResearchSection | "labs";

export type ResearchLink = {
  label: string;
  href: string;
};

export type ResearchImageStage = {
  label: string;
  src: string;
  alt: string;
};

export type ResearchImageRow = {
  caption: string;
  stages: ResearchImageStage[];
};

export type ResearchEntry = {
  id: string;
  year: number;
  name: string;
  section: ResearchSection;
  question: string;
  approach: string;
  finding: string;
  limitation: string;
  meta?: string;
  links?: ResearchLink[];
  imageRow?: ResearchImageRow;
};

export type LabEntry = {
  id: string;
  affiliation: string;
  period: string;
  advisors?: string;
  area: string;
  inProgress?: boolean;
  seeAlso?: { id: string; label: string };
};

export const RESEARCH_PAGE_SECTION_ORDER: ResearchPageSection[] = [
  "papers",
  "writing",
  "labs",
];

export const RESEARCH_ENTRIES: ResearchEntry[] = [
  {
    id: "mindbridge",
    year: 2026,
    name: "MindBridge",
    section: "papers",
    question: "Can you reconstruct an image somebody is only imagining?",
    approach:
      "Most fMRI decoders work on perception — what a person is looking at while being scanned. Imagery is different: the signal is weaker, noisier, and lives in a different distribution, so perception-trained decoders fail on it outright. MindBridge adds a contrastive brain encoder mapping voxels into CLIP space, a residual adapter that realigns imagery activity to the perception distribution, and a diffusion prior that puts the result back on the manifold the image generator expects.",
    finding:
      "65.7% two-way classification on reconstructed imagery against a 50% chance baseline — 59.0% on abstract cues, 72.3% on natural scenes. The adapter alone accounted for 20.5 points, more than any other component, and the same gain held on a plain ridge-regression baseline, which suggests the alignment matters more than the architecture.",
    limitation:
      "It recovers the category, not the image. CLIP pixel similarity sits at 0.56, so the system knows roughly what was imagined and not which specific thing. All primary results come from a single subject, so cross-subject generalization is untested. It is a semantic decoder, not a reconstruction system.",
    meta: "CS 231N final project, with Ahan Devgun and Anya Pinto.",
    imageRow: {
      caption:
        "TODO: figure files needed as standalone images; they are currently only inside the PDF. Caption must credit all three authors.",
      stages: [
        {
          label: "Ground truth",
          src: "TODO: /research/mindbridge/ground-truth.png",
          alt: "TODO: MindBridge ground truth reconstruction row",
        },
        {
          label: "Coarse first stage",
          src: "TODO: /research/mindbridge/coarse-stage.png",
          alt: "TODO: MindBridge coarse first stage row",
        },
        {
          label: "Diffusion output",
          src: "TODO: /research/mindbridge/diffusion-output.png",
          alt: "TODO: MindBridge diffusion output row",
        },
      ],
    },
  },
  {
    id: "calm-before-the-storm",
    year: 2025,
    name: "Calm Before the Storm",
    section: "papers",
    question:
      "Seizures are usually modelled as random events. Do they stay random right before one happens?",
    approach:
      "If the brain tightens into a more constrained state before a seizure, that should show up in the timing of neural events alone, without any EEG amplitude features. Simulated 5,000 inter-event intervals under three regimes — plain Poisson, bursting, and pre-seizure narrowing — then measured each with an entropy gap, KL divergence against a fitted exponential, and a Gamma-versus-exponential likelihood ratio.",
    finding:
      "Only the reduced-variability regime produced stable deviations from exponential timing. Bursting did not — a faster rate alone looks nothing like a precursor, which matters because rate increases are the obvious thing to mistake for one. Loss of temporal randomness works as a clean, interpretable marker, and it is far lighter than feature-heavy EEG approaches.",
    limitation:
      "This is simulated data, not real neural recordings, and it is not a seizure-prediction system. It shows that a marker would be detectable if the underlying dynamics behave this way — not that they do.",
    meta: "CS109 challenge project. Best Project Award finalist, top 1%.",
    links: [{ label: "TODO: PDF URL", href: "#" }],
  },
  {
    id: "dysdiag",
    year: 2023,
    name: "DysDiag",
    section: "papers",
    question:
      "Can dyslexia, dysgraphia, and dyscalculia be screened for in 5-to-8-year-olds without a clinic?",
    approach:
      "A multimodal pipeline combining three signals: handwriting sample analysis for stroke consistency and letter reversals, facial emotion modelling during the task to pick up confusion and frustration, and caregiver-reported behavioural surveys.",
    finding:
      "F1 of 0.785 and 0.964 across classifiers. In a case-control study of 40 children: 90% sensitivity, 90% specificity, 94.73% positive predictive value. First-authored and published in IJAARIT — the only peer-reviewed publication here. Special award at Regeneron ISEF 2023, and the youngest researcher to present at the All India Conclave on Research, Innovation and Entrepreneurship.",
    limitation: "A first-level screening tool for classroom or home use, not a diagnosis. n = 40.",
    links: [{ label: "TODO: IJAARIT paper URL", href: "#" }],
  },
  {
    id: "right-amount-of-wrong",
    year: 2025,
    name: "The Right Amount of Wrong: Rethinking Intelligence in the Age of AI",
    section: "writing",
    question: "How much wrong do you have to build into an AI for it to be intelligent?",
    approach:
      "Starts with the 1997 Deep Blue move Kasparov called too intelligent to be computational, which turned out to be a bug that made the machine play a random legal move — and argues we read machine imperfection as machine intelligence. Then draws on developmental psychology, the error-related negativity in neuroscience, automation-bias research, and critiques of the Turing Test to argue that fallibility is the mechanism of intelligence rather than a defect in it.",
    finding:
      "A system that cannot be wrong cannot, by human standards, be intelligent — and the danger in current systems is not that they err but that they err silently, with a fluency that discourages questioning. Systems that visibly flag uncertainty produce better human decisions; systems that present themselves as flawless produce cognitive offloading.",
    limitation: "An argument, not a study. She may want to phrase this one herself.",
    meta:
      "Writing and Rhetoric 2: Rhetoric of Imperfection. Proofread before publishing. The draft contains stray editing marks — several sentences end in an unresolved ? mid-argument, and at least two citations should be verified before the essay is linked publicly.",
    links: [{ label: "TODO: PDF URL", href: "#" }],
  },
];

export const LAB_ENTRIES: LabEntry[] = [
  {
    id: "sail",
    affiliation: "Stanford Artificial Intelligence Laboratory (SAIL) — Translational AI Lab",
    period: "Apr 2026–present",
    advisors: "Advised by Prof. Ehsan Adeli and Fangrui Huang.",
    area: 'TODO — a single cleared phrase, e.g. "evaluating LLM-simulated patients for therapy training."',
    inProgress: true,
  },
  {
    id: "snyder-lab",
    affiliation: "Stanford Snyder Lab",
    period: "Jun 2026–present",
    area: 'TODO — a single cleared phrase, e.g. "wearable and audio-based physiological sensing."',
    inProgress: true,
  },
  {
    id: "language-cognition-lab",
    affiliation: "Stanford Language and Cognition Lab",
    period: "Dec 2024–Dec 2025",
    advisors: "Advised by Prof. Michael Frank and Veronica Boyce.",
    area:
      "Built pipelines standardizing cross-study datasets for NLP analysis of child language, and an SBERT embedding pipeline modelling communicative structure across interactions.",
  },
  {
    id: "embodily",
    affiliation: "Embodily — research analyst",
    period: "Sep 2025–Jan 2026",
    area: "TODO: one line.",
  },
  {
    id: "csir-india",
    affiliation: "CSIR India — independent researcher",
    period: "2023–24",
    area: "See DysDiag above.",
    seeAlso: { id: "dysdiag", label: "DysDiag" },
  },
];

export function researchForSection(section: ResearchSection): ResearchEntry[] {
  return RESEARCH_ENTRIES.filter((entry) => entry.section === section);
}
