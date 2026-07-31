import type { Asset } from "@/types";

// ============================================================
// Fallback data — used when backend is offline so the UI never
// shows an empty state. Feels real, not placeholder-y.
// ============================================================

export const MOCK_ASSETS: Asset[] = [
  {
    _id: "vg-001",
    title: "Neuralink Cortex Labs",
    sector: "Neural",
    stage: "Series B",
    valuation: 480_000_000,
    shortDescription:
      "High-throughput brain-computer interface targeting motor restoration in ALS patients.",
    longDescription:
      "Cortex Labs has pioneered a wireless 4,096-channel BCI now in Phase II trials at Johns Hopkins and Karolinska. IP moat is 14 granted USPTO filings covering biocompatible electrode arrays and low-power neural decoders.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    riskScore: 28,
    verified: true,
    patents: 14, employees: 87, founded: 2020, hq: "San Francisco, CA",
    website: "cortex-labs.io",
  },
  {
    _id: "vg-002",
    title: "AtomFusion Reactors",
    sector: "Fusion",
    stage: "Series A",
    valuation: 220_000_000,
    shortDescription:
      "Modular high-temperature superconducting tokamak for grid-scale clean baseload power.",
    longDescription:
      "AtomFusion holds the current record for Q > 1 sustained plasma in a compact HTS design. Backed by DOE ARPA-E and a strategic offtake with EDF for 500MW pilot deployment.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    riskScore: 52,
    verified: true,
    patents: 9, employees: 62, founded: 2021, hq: "Cambridge, MA",
    website: "atomfusion.energy",
  },
  {
    _id: "vg-003",
    title: "Quantum Bio Systems",
    sector: "BioTech",
    stage: "Series B",
    valuation: 340_000_000,
    shortDescription:
      "Quantum-enhanced protein folding for de-novo drug candidate discovery at 10x speed.",
    longDescription:
      "QBS operates a 128-qubit trapped-ion cluster paired with a proprietary AlphaFold-successor model. Three IND filings in oncology and rare disease pipelines with Roche and Genentech.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    riskScore: 41,
    verified: true,
    patents: 22, employees: 134, founded: 2019, hq: "Zürich, CH",
    website: "quantumbio.ch",
  },
  {
    _id: "vg-004",
    title: "Helion Compute",
    sector: "Quantum",
    stage: "Series C+",
    valuation: 1_200_000_000,
    shortDescription:
      "Full-stack neutral-atom quantum computer with 1,024 logical qubits.",
    longDescription:
      "Helion delivers cloud-accessible quantum compute achieving quantum advantage on portfolio optimization workloads for major hedge funds. Revenue $42M ARR growing 240% YoY.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    riskScore: 22,
    verified: true,
    patents: 31, employees: 210, founded: 2018, hq: "Boston, MA",
    website: "helion-compute.io",
  },
  {
    _id: "vg-005",
    title: "Boreal Robotics Inc",
    sector: "Robotics",
    stage: "Seed",
    valuation: 45_000_000,
    shortDescription:
      "Cold-climate autonomous mobile robots for Arctic logistics and mining operations.",
    longDescription:
      "Boreal's fleet operates at -55°C sustained, currently deployed at Rio Tinto and Vale sites. Proprietary lubrication chemistry + edge compute stack.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    riskScore: 61,
    verified: true,
    patents: 4, employees: 28, founded: 2022, hq: "Reykjavík, IS",
    website: "boreal-robotics.is",
  },
  {
    _id: "vg-006",
    title: "Stratosphere Dynamics",
    sector: "SpaceTech",
    stage: "Series A",
    valuation: 180_000_000,
    shortDescription:
      "Reusable hypersonic vehicles for sub-orbital cargo and defense logistics.",
    longDescription:
      "Stratosphere's Mach 12 vehicle completed 7 successful test flights in 2025. DoD SDA contract for $85M plus commercial cargo partnership with FedEx.",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80",
    riskScore: 48,
    verified: true,
    patents: 11, employees: 76, founded: 2021, hq: "Mojave, CA",
    website: "stratodyn.space",
  },
  {
    _id: "vg-007",
    title: "Terra Carbon Vault",
    sector: "Climate",
    stage: "Series B",
    valuation: 290_000_000,
    shortDescription:
      "Enhanced weathering of ultramafic rock for gigaton-scale CO₂ removal.",
    longDescription:
      "Terra operates the largest ex-situ enhanced weathering site globally (Oman, 2M tons/year). Signed 15-year offtake with Microsoft, Stripe, and Shopify for $840M cumulative.",
   image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    riskScore: 34,
    verified: true,
    patents: 6, employees: 94, founded: 2020, hq: "Muscat, OM",
    website: "terracarbon.vault",
  },
  {
    _id: "vg-008",
    title: "Sentinel Defense AI",
    sector: "Defense",
    stage: "Pre-Seed",
    valuation: 18_000_000,
    shortDescription:
      "Autonomous swarm coordination for counter-drone and perimeter defense.",
    longDescription:
      "Sentinel's edge-compute swarm software coordinates up to 400 vehicles per operator. DIU contract, active pilots with US Army and NATO.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    riskScore: 72,
    verified: false,
    patents: 2, employees: 12, founded: 2024, hq: "Austin, TX",
    website: "sentinel-defense.ai",
  },
];

export const MOCK_USER = {
  id: "demo-001",
  name: "Ada Lovelace",
  email: "demo.investor@vanguard-ai.io",
  firm: "Meridian Ventures",
  role: "investor" as const,
};