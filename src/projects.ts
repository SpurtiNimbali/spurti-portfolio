export type ProjectSection = "selected" | "also built" | "before stanford";

export type ProjectLink = {
  label: string;
  href: string;
  /** Shown with the summary at every tier, not held back behind "more". */
  primary?: boolean;
};

export type ProjectCrossRef = {
  href: string;
  label: string;
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
  crossRef?: ProjectCrossRef;
};

export const PROJECT_SECTION_ORDER: ProjectSection[] = ["selected", "also built", "before stanford"];

export const PROJECTS: ProjectEntry[] = [
  {
    id: "atria-ai",
    year: 2026,
    name: "Atria AI",
    section: "selected",
    line: "Keeps families informed when minutes matter.",
    detail:
      "A real-time conversational assistant that turns raw EHR activity into plain-language updates for families, so nobody is left *waiting*.",
    full: "Ten specialized agents orchestrated in LangGraph (drug interaction, lab trend forecasting, treatment risk, personalized dosing, disease progression), separated into hypothesis generation, evidence grounding, and safety validation, so no clinical inference reaches a family without passing a verification stage. Retrieval runs on hybrid BM25 and vector KNN over Jina embeddings in Elasticsearch, and every claim is bound to a source record. The latency budget bends to that constraint, not the reverse.",
    stack: "Python · React · Elasticsearch · ElevenLabs · LangGraph",
    links: [
      { label: "live prototype", href: "https://atria-ai-gilt.vercel.app/", primary: true },
      { label: "demo video", href: "https://www.youtube.com/watch?v=C4xo_87xCiQ" },
      { label: "github", href: "https://github.com/SpurtiNimbali/Atria-AI" },
    ],
  },
  {
    id: "sayso",
    year: 2025,
    name: "SaySo",
    section: "selected",
    line: "Feedback that sticks before it slips.",
    detail:
      "An Adobe Express add-on that streamlines asynchronous design reviews by converting recorded voice feedback into structured, element-linked tasks, cutting the turnaround from review to implementation.",
    full: "Voice is captured in-panel through the Web Audio API, transcribed by Whisper, and extracted by GPT-4 into editable task cards. The interesting constraint: Express add-ons run sandboxed and cannot create native canvas annotations, so there is no way to attach feedback to an element. SaySo reconstructs the link instead, a bridge script logs element selection history during recording and matches transcript segments to elements by timestamp, so \"this part looks off\" resolves to a specific object. Nothing leaves the browser; recording and inference run in memory with no storage. Built through to marketplace release with Adobe's Extensibility team.",
    stack: "React · React Spectrum · FastAPI · Whisper · GPT-4",
    links: [
      { label: "demo video", href: "https://www.youtube.com/watch?v=ka0tRQN76ZM", primary: true },
      { label: "github", href: "https://github.com/SpurtiNimbali/SaySo" },
      { label: "devpost", href: "https://devpost.com/software/sayso" },
      { label: "pitch deck", href: "https://canva.link/b1lod72dti1ltaw" },
    ],
    awards: ["Winner, Collaboration Catalyst at the Adobe Express Add-ons Hackathon 2025"],
  },
  {
    id: "cooked",
    year: "TODO: year",
    name: "COOKED",
    section: "selected",
    line: "Either cook or get cooked.",
    detail:
      "A social computing app where your friend group is the accountability system. Call out a friend to do something bold, funny, or embarrassing, and the whole crew watches a 24-hour timer run down.",
    full: "They accept, counter-dare, or fold, all of it public. The crew bets Sparks on whether they'll pull it off, video proof comes in, and the group votes on whether it counted. Everyone cycles through three roles: the one calling out, the one on the spot, and the crowd judging, so nobody is just scrolling. The bet behind it: friend groups already run on social pressure, and that pressure disappears the moment a commitment moves to a private text thread. COOKED makes the commitment public and gives it stakes. Payouts scale with how many people bet against you, so the dares nobody believed in are worth the most.",
    stack: "TODO",
    links: [
      {
        label: "demo video",
        href: "https://drive.google.com/file/d/1xnbra8pVARG94BDgGdj5xrfOEt029aGH/view?usp=sharing",
        primary: true,
      },
      { label: "github", href: "https://github.com/elnukk/cooked-mobile" },
      {
        label: "project doc",
        href: "https://drive.google.com/file/d/151I51iWsjpQg8dhfPx2pTbCYh3VUC_in/view?usp=sharing",
      },
    ],
  },
  {
    id: "cardea",
    year: 2026,
    name: "Cardea",
    section: "selected",
    line: "Care doesn't stop when you leave the hospital.",
    detail:
      "A companion app for families raising a child with congenital heart disease, built for the Ollie Hinkle Heart Foundation. Mood check-ins, a trauma-informed chat companion, coping tools, and a running list of questions to bring to the next appointment.",
    full: "The idea is that the hardest part of heart care isn't the appointments, it's the months in between, where caregivers are managing a child's condition and their own exhaustion with no one to ask. Cardea's chat answers from a retrieval index built on vetted CHD material rather than open-ended generation, so responses stay grounded in what the foundation actually endorses, and crisis language is caught by its own tested layer instead of trusted to a prompt. Separate content pipelines feed the medical glossary and question library into Supabase, so OHHF can grow the app's knowledge without a developer.",
    stack: "Vite · React · TypeScript · Express · Supabase · OpenAI · Anthropic",
    links: [
      { label: "prototype", href: "https://ohhf-cs-52.vercel.app/home", primary: true },
      { label: "github", href: "https://github.com/SpurtiNimbali/OHHF_CS52" },
    ],
  },
  {
    id: "airys-tech",
    year: 2025,
    name: "Airys Tech, climate document intelligence",
    section: "also built",
    line: "Reads 800+ county climate plans so people don't have to.",
    detail:
      "A document intelligence pipeline at the TomKat Center processing over 800 County Hazard and Climate Mitigation Plans with embedding-based retrieval and structured extraction, cutting end-to-end processing latency by 80%.",
    full: "Also deployed a dashboard using agentic deep-web extraction and LLM querying over infrastructure and socio-economic datasets, built for Texas Drinking Water Watch to identify and prioritize climate mitigation grant allocation.",
    stack: "Python · LLMs · embedding retrieval · web scraping",
  },
  {
    id: "quantum-ai-institute",
    year: 2025,
    name: "Quantum AI Institute",
    section: "also built",
    line: "First intern hire at a pre-seed startup.",
    detail:
      "Product and growth at Second Time Founders, building the Quantum AI Institute, an invitation-only fellowship for executives. Ran competitive landscape analysis, partnered on product strategy and positioning, and supported early-stage fundraising alongside leadership.",
    full: "Supported a $500K raise as the first intern on the team.",
    links: [{ label: "joinquantum.ai", href: "https://joinquantum.ai" }],
  },
  {
    id: "nyc-taxi-trips",
    year: "TODO: year",
    name: "Tricks for Tips",
    section: "also built",
    line: "Supervised ML model on NYC taxi data.",
    detail:
      "Developed a supervised learning model to predict tipping outcomes in NYC taxi data; constructed a dataset of 500K+ observations with engineered temporal, spatial, and transactional features.",
    stack: "Pandas · Scikit-Learn · BeautifulSoup",
    links: [
      { label: "github", href: "https://github.com/SpurtiNimbali/DATASCI112" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/1fK0b9ujwFfFiwNr3vWfMIpN7PskClvyj/view?usp=sharing",
      },
    ],
  },
  {
    id: "tag-team-reader",
    year: "TODO: year",
    name: "Tag Team Reader",
    section: "also built",
    line: "Collaborative AI-powered reading app.",
    detail:
      "Built a full-stack MERN web app that uses Anthropic's API to generate reading content, with custom backend routes and session-based storage using TTL-indexed MongoDB.",
    full: "Rendered a responsive React frontend with dynamic routing and state management to support multi-user reading sessions in real time.",
    stack: "React.js · Node.js · MongoDB",
    links: [
      { label: "github", href: "https://github.com/LuciaLanganey/TagTeam-Reader" },
      { label: "project doc", href: "https://canva.link/ldxt0x7zhsidd08" },
    ],
  },
  {
    id: "epicare",
    year: "TODO: year",
    name: "EpiCare",
    section: "before stanford",
    line: "Android app for people with epilepsy and their caregivers.",
    detail:
      "Seizure detection triggering an SOS workflow with live geolocation and visual first-aid instructions for bystanders, plus seizure and medication logging and sleep pattern tracking.",
    links: [{ label: "demo video", href: "https://www.youtube.com/watch?v=bhEwDd5M6is" }],
  },
  {
    id: "navigo",
    year: "TODO: year",
    name: "Navigo",
    section: "before stanford",
    line: "Arduino navigation device for the visually impaired.",
    detail:
      "Ultrasonic, flame, and water sensors driving real-time audio and haptic feedback for obstacle detection and hazard alerts.",
    links: [
      {
        label: "project doc",
        href: "https://90f0ab20-fb4a-49cf-aa26-db692f4c1b66.filesusr.com/ugd/e24c99_9b3de05f0dfe4dc38b495c0f9217919c.pdf",
      },
    ],
  },
];

export function projectsForSection(section: ProjectSection): ProjectEntry[] {
  return PROJECTS.filter((entry) => entry.section === section);
}
