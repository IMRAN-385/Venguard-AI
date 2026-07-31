import { Asset } from "../models";

// ============================================================
// Seed 8 verified deeptech startups
// Matches the client's mockAssets.ts so the app looks identical
// whether the backend is running or not.
// ============================================================

interface SeedAsset {
  title:            string;
  sector:           string;
  stage:            string;
  valuation:        number;
  shortDescription: string;
  longDescription:  string;
  image:            string;
  riskScore:        number;
  verified:         boolean;
  patents:          number;
  employees:        number;
  founded:          number;
  hq:               string;
  website:          string;
  founders:         { name: string; role: string; background: string }[];
  tags:             string[];
}

const STARTUPS: SeedAsset[] = [
  {
    title: "Neuralink Cortex Labs",
    sector: "Neural", stage: "Series B", valuation: 480_000_000,
    shortDescription: "High-throughput brain-computer interface targeting motor restoration in ALS patients.",
    longDescription:  "Cortex Labs has pioneered a wireless 4,096-channel BCI now in Phase II trials at Johns Hopkins and Karolinska. IP moat is 14 granted USPTO filings covering biocompatible electrode arrays and low-power neural decoders.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    riskScore: 28, verified: true, patents: 14, employees: 87, founded: 2020,
    hq: "San Francisco, CA", website: "cortex-labs.io",
    founders: [
      { name: "Dr. Elena Voss",   role: "CEO", background: "ex-DeepMind, PhD MIT" },
      { name: "Marcus Chen",       role: "CTO", background: "ex-DARPA, Stanford" },
    ],
    tags: ["#neural", "#bci", "#medtech", "#patent-protected"],
  },
  {
    title: "AtomFusion Reactors",
    sector: "Fusion", stage: "Series A", valuation: 220_000_000,
    shortDescription: "Modular high-temperature superconducting tokamak for grid-scale clean baseload power.",
    longDescription:  "AtomFusion holds the current record for Q > 1 sustained plasma in a compact HTS design. Backed by DOE ARPA-E and a strategic offtake with EDF for 500MW pilot deployment.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    riskScore: 52, verified: true, patents: 9, employees: 62, founded: 2021,
    hq: "Cambridge, MA", website: "atomfusion.energy",
    founders: [
      { name: "Dr. Robert Kim",    role: "CEO", background: "ex-MIT PSFC, PhD Plasma Physics" },
      { name: "Priya Kapoor",       role: "CSO", background: "ex-ITER, Oxford" },
    ],
    tags: ["#fusion", "#energy", "#climate", "#doe-backed"],
  },
  {
    title: "Quantum Bio Systems",
    sector: "BioTech", stage: "Series B", valuation: 340_000_000,
    shortDescription: "Quantum-enhanced protein folding for de-novo drug candidate discovery at 10x speed.",
    longDescription:  "QBS operates a 128-qubit trapped-ion cluster paired with a proprietary AlphaFold-successor model. Three IND filings in oncology and rare disease pipelines with Roche and Genentech.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
    riskScore: 41, verified: true, patents: 22, employees: 134, founded: 2019,
    hq: "Zürich, CH", website: "quantumbio.ch",
    founders: [
      { name: "Dr. Anna Lindqvist", role: "CEO", background: "ex-Roche, PhD ETH Zürich" },
      { name: "Marcus Yoshida",      role: "CTO", background: "ex-Google Quantum" },
    ],
    tags: ["#quantum", "#biotech", "#drug-discovery", "#patent-protected"],
  },
  {
    title: "Helion Compute",
    sector: "Quantum", stage: "Series C+", valuation: 1_200_000_000,
    shortDescription: "Full-stack neutral-atom quantum computer with 1,024 logical qubits.",
    longDescription:  "Helion delivers cloud-accessible quantum compute achieving quantum advantage on portfolio optimization workloads for major hedge funds. Revenue $42M ARR growing 240% YoY.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80",
    riskScore: 22, verified: true, patents: 31, employees: 210, founded: 2018,
    hq: "Boston, MA", website: "helion-compute.io",
    founders: [
      { name: "Dr. Sarah Chen",     role: "CEO", background: "ex-IBM Quantum, PhD Harvard" },
      { name: "James O'Brien",       role: "CTO", background: "ex-Google, PhD MIT" },
    ],
    tags: ["#quantum", "#computing", "#unicorn", "#enterprise"],
  },
  {
    title: "Boreal Robotics Inc",
    sector: "Robotics", stage: "Seed", valuation: 45_000_000,
    shortDescription: "Cold-climate autonomous mobile robots for Arctic logistics and mining operations.",
    longDescription:  "Boreal's fleet operates at -55°C sustained, currently deployed at Rio Tinto and Vale sites. Proprietary lubrication chemistry + edge compute stack.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    riskScore: 61, verified: true, patents: 4, employees: 28, founded: 2022,
    hq: "Reykjavík, IS", website: "boreal-robotics.is",
    founders: [
      { name: "Björn Eriksson",     role: "CEO", background: "ex-Boston Dynamics" },
      { name: "Kira Larsson",        role: "COO", background: "ex-Rio Tinto Ops" },
    ],
    tags: ["#robotics", "#autonomy", "#mining", "#arctic"],
  },
  {
    title: "Stratosphere Dynamics",
    sector: "SpaceTech", stage: "Series A", valuation: 180_000_000,
    shortDescription: "Reusable hypersonic vehicles for sub-orbital cargo and defense logistics.",
    longDescription:  "Stratosphere's Mach 12 vehicle completed 7 successful test flights in 2025. DoD SDA contract for $85M plus commercial cargo partnership with FedEx.",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&q=80",
    riskScore: 48, verified: true, patents: 11, employees: 76, founded: 2021,
    hq: "Mojave, CA", website: "stratodyn.space",
    founders: [
      { name: "Colonel J. Reyes",   role: "CEO", background: "ex-USAF, ex-SpaceX" },
      { name: "Dr. Mei Tanaka",      role: "CTO", background: "ex-NASA JPL" },
    ],
    tags: ["#space", "#hypersonics", "#defense", "#dod-contract"],
  },
  {
    title: "Terra Carbon Vault",
    sector: "Climate", stage: "Series B", valuation: 290_000_000,
    shortDescription: "Enhanced weathering of ultramafic rock for gigaton-scale CO₂ removal.",
    longDescription:  "Terra operates the largest ex-situ enhanced weathering site globally (Oman, 2M tons/year). Signed 15-year offtake with Microsoft, Stripe, and Shopify for $840M cumulative.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    riskScore: 34, verified: true, patents: 6, employees: 94, founded: 2020,
    hq: "Muscat, OM", website: "terracarbon.vault",
    founders: [
      { name: "Dr. Amal Al-Rashid",  role: "CEO", background: "ex-Aramco R&D, PhD Cambridge" },
      { name: "Isabella Rossi",       role: "CSO", background: "ex-Lawrence Livermore" },
    ],
    tags: ["#climate", "#carbon-removal", "#geoscience", "#microsoft-offtake"],
  },
  {
    title: "Sentinel Defense AI",
    sector: "Defense", stage: "Pre-Seed", valuation: 18_000_000,
    shortDescription: "Autonomous swarm coordination for counter-drone and perimeter defense.",
    longDescription:  "Sentinel's edge-compute swarm software coordinates up to 400 vehicles per operator. DIU contract, active pilots with US Army and NATO.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
    riskScore: 72, verified: false, patents: 2, employees: 12, founded: 2024,
    hq: "Austin, TX", website: "sentinel-defense.ai",
    founders: [
      { name: "Major R. Vasquez",   role: "CEO", background: "ex-US Army, ex-Anduril" },
      { name: "Dr. Kai Zhang",       role: "CTO", background: "ex-Google DeepMind" },
    ],
    tags: ["#defense", "#autonomy", "#swarm", "#diu-backed"],
  },
];

export async function seedAssets(createdBy: string): Promise<number> {
  let created = 0;

  for (const startup of STARTUPS) {
    const slug = startup.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await Asset.findOne({ slug });
    if (existing) {
      // eslint-disable-next-line no-console
      console.log(`   • Skip (exists): ${startup.title}`);
      continue;
    }

    await Asset.create({ ...startup, slug, createdBy });
    created++;
    // eslint-disable-next-line no-console
    console.log(`   ✓ Seeded: ${startup.title}`);
  }

  return created;
}