export type ProjectSection =
  | "selected"
  | "also built"
  | "research"
  | "bases"
  | "before stanford";

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectEntry = {
  id: string;
  year: number | string;
  name: string;
  section: ProjectSection;
  line: string;
  detail?: string;
  full?: string;
  stack?: string;
  note?: string;
  links?: ProjectLink[];
  awards?: string[];
};

export type ResearchBlock = {
  id: string;
  title: string;
  period: string;
  advisors?: string;
  line: string;
};

export const PROJECT_SECTION_ORDER: ProjectSection[] = [
  "selected",
  "also built",
  "research",
  "bases",
  "before stanford",
];

export const PROJECTS: ProjectEntry[] = [
  {
    id: "atria-ai",
    year: 2026,
    name: "Atria AI",
    section: "selected",
    line: "Keeps families updated during a medical emergency.",
    detail:
      "A real-time conversational assistant that generates contextual updates for families from electronic health records, so nobody is left refreshing a waiting room screen.",
    full: "LangGraph orchestrates a 10-agent reasoning pipeline with separate modules for hypothesis, evidence grounding, and safety validation. Retrieval runs on Jina embeddings. Every output is citation-grounded to keep hallucination down, which matters more here than latency.",
    stack: "Python · React · Elasticsearch · ElevenLabs · LangGraph",
    links: [
      { label: "TODO: repo URL", href: "#" },
      { label: "TODO: demo video URL", href: "#" },
    ],
  },
  {
    id: "mindbridge",
    year: 2026,
    name: "MindBridge",
    section: "selected",
    line: "Reconstructs imagined images from brain scans.",
    detail:
      "Most fMRI decoders work on perception — what you are looking at. MindBridge targets imagery: what you are picturing with your eyes closed, where the signal is weaker, noisier, and state-of-the-art perception models fail outright.",
    full: "A contrastive brain encoder maps fMRI voxels into CLIP space, a residual beta adapter realigns imagery activity to the perception distribution, and a DDPM diffusion prior lands the embeddings back on the manifold the generator expects. 65.7% two-way classification on reconstructed imagery against a 50% chance baseline — 59.0% on abstract cues, 72.3% on natural scenes. The adapter alone was worth 20.5 points, the single largest contributor. It is a semantic decoder, not a full reconstruction system: it recovers the right category, not the specific image.",
    stack: "PyTorch · CLIP · Versatile Diffusion · Modal / A100",
    note: "CS 231N final project, with Ahan Devgun and Anya Pinto.",
  },
  {
    id: "sayso",
    year: 2025,
    name: "SaySo",
    section: "selected",
    line: "Turns recorded voice notes into linked design tasks.",
    detail:
      "An Adobe Express add-on for asynchronous design review. Spoken feedback becomes structured tasks linked to the specific elements they refer to, instead of a comment thread someone has to translate.",
    full: "Built with the Adobe Express Extensibility team and shipped to the add-on marketplace. Won the 2025 Adobe Express Add-On Hackathon.",
    stack: "React · FastAPI · OpenAI Whisper",
    links: [{ label: "TODO: marketplace URL", href: "#" }],
    awards: ["Winner, Adobe Express Add-On Hackathon 2025"],
  },
  {
    id: "ollie-hinkle",
    year: 2026,
    name: "Ollie Hinkle Heart Foundation",
    section: "selected",
    line: "TODO: one line — what does the product actually do?",
    detail:
      "Led a cross-functional team of Stanford engineers to design and ship a healthcare product in partnership with the foundation, owning product vision, technical architecture, and stakeholder alignment. Came out of CS 51/52, CS for Social Good, where she TAs.",
    full: "TODO: the outcome — is it live, who uses it, how many.",
    stack: "TODO",
    links: [{ label: "TODO", href: "#" }],
  },
  {
    id: "orchestrate-support-agent",
    year: 2026,
    name: "Orchestrate Support Agent",
    section: "also built",
    line: "Terminal agent that triages support tickets.",
    detail:
      "Built in 24 hours for the HackerRank Orchestrate hackathon. Routes real support tickets across the HackerRank, Claude, and Visa support corpora, and has to escalate anything sensitive or unsupported rather than guess at an answer.",
    full: "TODO: how it placed, and what it got wrong.",
    stack: "Python",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/SpurtiNimbali/orchestrate-support-agent",
      },
    ],
  },
  {
    id: "quantum-ai-institute",
    year: 2025,
    name: "Quantum AI Institute",
    section: "also built",
    line: "First intern hire at a pre-seed startup.",
    detail:
      "Product and growth at Second Time Founders, building the Quantum AI Institute — an invitation-only fellowship for executives. Ran competitive landscape analysis, partnered on product strategy and positioning, and supported early-stage fundraising alongside leadership.",
    full: "Supported a $500K raise as the first intern on the team. ⚠️ confirm she is comfortable with this line — it is the company's raise, not hers.",
    stack: "TODO",
    links: [{ label: "joinquantum.ai", href: "https://joinquantum.ai" }],
  },
  {
    id: "airys-tech",
    year: 2025,
    name: "Airys Tech — climate document intelligence",
    section: "also built",
    line: "Reads 800+ county climate plans so people don't have to.",
    detail:
      "A document intelligence pipeline at the TomKat Center processing over 800 County Hazard and Climate Mitigation Plans with embedding-based retrieval and structured extraction, cutting end-to-end processing latency by 80%.",
    full: "Also deployed a dashboard using agentic deep-web extraction and LLM querying over infrastructure and socio-economic datasets, built for Texas Drinking Water Watch to identify and prioritize climate mitigation grant allocation.",
    stack: "Python · LLMs · embedding retrieval · web scraping",
    links: [{ label: "TODO", href: "#" }],
  },
  {
    id: "nyc-taxi-trips",
    year: "TODO: year",
    name: "NYC taxi trips",
    section: "also built",
    line: "TODO",
    detail: "TODO",
    full: "TODO: Which class, and what question was she answering?",
  },
  {
    id: "tag-team-reader",
    year: "TODO: year",
    name: "Tag Team Reader",
    section: "also built",
    line: "TODO",
    detail: "TODO",
    full: "TODO: No source material available for this one.",
  },
  {
    id: "cs-278",
    year: "TODO: year",
    name: "CS 278",
    section: "also built",
    line: "TODO",
    detail: "TODO",
    full: "TODO: If this is separate from the CS 231N paper, it needs its own entry. If it went badly, say so plainly at the full tier — that is an asset on this page, not a liability.",
  },
  {
    id: "dysdiag",
    year: 2023,
    name: "DysDiag",
    section: "before stanford",
    line: "Screening tool for dyslexia, dysgraphia, and dyscalculia in children aged 5–8.",
    detail:
      "Handwriting sample analysis for stroke consistency and letter reversals, facial emotion modeling for confusion and frustration signals, and caregiver-reported behavioural surveys.",
    full: "F1 of 0.785 and 0.964 across classifiers; in a case-control study of 40, 90% sensitivity, 90% specificity, 94.73% positive predictive value. ISEF 2023 special award, published in IJAARIT, and the youngest researcher to present at the All India Conclave on Research, Innovation and Entrepreneurship.",
    awards: [
      "Special Award, Regeneron ISEF 2023",
      "Rise Global Fellow, Rhodes Trust and Schmidt Futures — 1 of 100 worldwide from over 14,000 applications across 170+ countries.",
      "Winner, Smart India Hackathon 2023, Ministry of Science and Technology — first of over 10,000 applications.",
      "CS109 Best Project Award finalist, top 1%.",
    ],
  },
  {
    id: "oral-cancer-detection",
    year: 2023,
    name: "Oral cancer detection",
    section: "before stanford",
    line: "Diagnostic pipeline for early detection of oral squamous cell carcinoma from histopathological slides.",
    detail:
      "Morphological and textural feature extraction with OpenCV — nuclear shape, boundary irregularity, pixel intensity — classified via Google Cloud Vision.",
    full: "96.43% precision and recall against expert-annotated labels.",
  },
  {
    id: "epicare",
    year: "TODO: year",
    name: "EpiCare",
    section: "before stanford",
    line: "Android app for people with epilepsy and their caregivers.",
    detail:
      "Seizure detection triggering an SOS workflow with live geolocation and visual first-aid instructions for bystanders, plus seizure and medication logging and sleep pattern tracking.",
  },
  {
    id: "navigo",
    year: "TODO: year",
    name: "Navigo",
    section: "before stanford",
    line: "Arduino navigation device for the visually impaired.",
    detail:
      "Ultrasonic, flame, and water sensors driving real-time audio and haptic feedback for obstacle detection and hazard alerts.",
  },
];

export const RESEARCH_BLOCKS: ResearchBlock[] = [
  {
    id: "sail",
    title: "Stanford Artificial Intelligence Laboratory (SAIL) — Translational AI Lab",
    period: "Apr 2026–present",
    advisors: "Advised by Prof. Ehsan Adeli and Fangrui Huang.",
    line: "TODO: one line on the work.",
  },
  {
    id: "snyder-lab",
    title: "Stanford Snyder Lab",
    period: "Jun 2026–present",
    line: "TODO: one line on the work.",
  },
  {
    id: "language-cognition-lab",
    title: "Stanford Language and Cognition Lab",
    period: "Dec 2024–Dec 2025",
    advisors: "Advised by Prof. Michael Frank and Veronica Boyce.",
    line: "Built SQL/Redivis pipelines standardizing cross-study datasets for NLP analysis of child language, plus an SBERT embedding pipeline to model communicative structure across interactions.",
  },
  {
    id: "csir-india",
    title: "CSIR India — independent researcher",
    period: "2023–24",
    line: "Multimodal ML screening for early detection of learning disorders in children, combining handwriting classification, facial modeling, and behavioural vectorization. F1 of 0.96. First-authored paper published in IJAARIT.",
  },
];

export const BASES_BLOCK = {
  title: "Director, Hackspace — BASES",
  period: "Jan 2025–present",
  body: "Runs Stanford's largest hackathon and builder ecosystem: weekly HackerHours with Microsoft Founder's Hub, quarterly demo days with VCs and industry. Previously Frosh Battalion Fellow, selected as 1 of 30 in her incoming class.",
};

export function projectsForSection(section: ProjectSection): ProjectEntry[] {
  return PROJECTS.filter((entry) => entry.section === section);
}
