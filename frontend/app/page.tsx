import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Users,
  Sparkles,
  ClipboardList,
} from "lucide-react";

const workflow = [
  {
    number: "01",
    title: "Create an event",
    description:
      "Define the event, schedule, location, and operational context.",
    href: "/events",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "Define requirements",
    description:
      "Specify the roles, skills, and crew capacity the event needs.",
    href: "/events",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Find the right crew",
    description:
      "Compare available crew against the requirements of the event.",
    href: "/crew",
    icon: Users,
  },
  {
    number: "04",
    title: "Generate recommendations",
    description:
      "Use the recommendation engine to identify suitable crew matches.",
    href: "/recommendations",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#17212b]">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-[#d8d4ca] px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          CrewPilot
        </Link>

        <Link
          href="/dashboard"
          className="text-sm font-medium text-[#59636b] transition-colors hover:text-[#17212b]"
        >
          Enter workspace →
        </Link>
      </header>

      {/* Hero */}
      <section className="border-b border-[#d8d4ca]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8a6420]">
              Event staffing operations
            </p>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Plan the event.
              <br />
              Build the crew.
              <br />
              Make the match.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#65635d]">
              CrewPilot connects events, staffing requirements,
              crew capabilities, availability, bookings, and
              recommendations in one operational workflow.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-[#17212b] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#293b49]"
              >
                Open events
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/crew"
                className="inline-flex items-center gap-2 border border-[#bcb8ae] px-5 py-3 text-sm font-medium transition-colors hover:border-[#17212b]"
              >
                Browse crew
              </Link>
            </div>
          </div>

          {/* Workflow panel */}
          <div className="border border-[#cfcac0] bg-[#eeece5]">
            <div className="flex items-center justify-between border-b border-[#cfcac0] px-6 py-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#77736a]">
                  Core workflow
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  From event to crew
                </h2>
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8a6420]">
                04 steps
              </span>
            </div>

            <div>
              {workflow.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.number}
                    href={item.href}
                    className="group grid grid-cols-[42px_1fr_auto] gap-4 border-b border-[#cfcac0] px-6 py-6 last:border-b-0 hover:bg-[#e7e4dc]"
                  >
                    <span className="font-mono text-[11px] text-[#8a6420]">
                      {item.number}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <Icon
                          size={16}
                          strokeWidth={1.7}
                          className="text-[#59636b]"
                        />

                        <h3 className="text-sm font-semibold">
                          {item.title}
                        </h3>
                      </div>

                      <p className="mt-2 max-w-md text-xs leading-5 text-[#706e68]">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className="mt-1 text-[#9a978e] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Backend-aligned capabilities */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a6420]">
              What CrewPilot manages
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight">
              One system for the operational side of staffing.
            </h2>
          </div>

          <div className="grid grid-cols-1 border-t border-[#cfcac0] sm:grid-cols-2">
            <Capability
              title="Events"
              description="Create and manage the events that drive staffing decisions."
            />

            <Capability
              title="Requirements"
              description="Attach staffing requirements directly to an event."
            />

            <Capability
              title="Crew"
              description="Maintain the people, capabilities, and crew data used for matching."
            />

            <Capability
              title="Bookings"
              description="Track crew assignments and booking status for events."
            />

            <Capability
              title="Recommendations"
              description="Generate candidate recommendations for an event."
            />

            <Capability
              title="AI layer"
              description="The recommendation workflow can later be extended with Gemini and agentic orchestration."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#d8d4ca]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center lg:px-10">
          <div>
            <p className="text-lg font-semibold">
              Start with an event.
            </p>

            <p className="mt-1 text-sm text-[#6b6962]">
              The rest of the staffing workflow follows from it.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex w-fit items-center gap-2 bg-[#17212b] px-5 py-3 text-sm font-medium text-white hover:bg-[#293b49]"
          >
            Go to events
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Capability({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[#cfcac0] py-6 sm:px-6 first:sm:pl-0">
      <div className="flex items-center gap-2">
        <CheckCircle2
          size={15}
          strokeWidth={1.7}
          className="text-[#8a6420]"
        />

        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <p className="mt-2 max-w-sm text-xs leading-5 text-[#706e68]">
        {description}
      </p>
    </div>
  );
}