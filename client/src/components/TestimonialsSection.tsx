import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Vanguard cut our deeptech diligence from 3 weeks to 4 minutes. The generated memos are indistinguishable from our senior associates' work.",
    name: "Dr. Amara Okonkwo",
    role: "Managing Partner",
    firm: "Kairos Deep Capital",
    initials: "AO",
  },
  {
    quote:
      "The Copilot flagged a patent-encumbrance risk on a Series B we were about to lead. Saved us $18M. This is what agentic AI was supposed to be.",
    name: "Henrik Vasquez",
    role: "Head of Frontier Tech",
    firm: "Meridian Ventures",
    initials: "HV",
  },
  {
    quote:
      "We connect our own Groq keys, run 200 diligence workflows in parallel, and pay a fraction of what Bloomberg terminals cost. Table stakes now.",
    name: "Priya Ramanathan",
    role: "CIO",
    firm: "Nordwind Family Office",
    initials: "PR",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">[ Signal from the field ]</p>
            <h2 className="display-serif text-display-lg max-w-2xl">
              Trusted by allocators<br />
              <span className="italic text-bone-200">who move billions.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="panel p-8 flex flex-col justify-between min-h-[340px] hover:bg-ink-800 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
                <blockquote className="text-bone-100 leading-relaxed text-[15px]">
                  "{t.quote}"
                </blockquote>
              </div>

              <figcaption className="mt-8 pt-6 border-t border-ink-600/40 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-ink-800 border border-ink-600/60 flex items-center justify-center text-sm font-medium text-bone-100">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm text-bone-50 font-medium">{t.name}</div>
                  <div className="text-xs text-bone-300">
                    {t.role} · <span className="text-bone-200">{t.firm}</span>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}