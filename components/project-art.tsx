const graphics: Record<
  string,
  { label: string; nodes: string[]; note: string }
> = {
  campusdesk: {
    label: "CampusDesk · request lifecycle",
    nodes: ["Student", "Staff", "Audit trail"],
    note: "Four roles. One traceable request.",
  },
  goldstrat: {
    label: "GoldStrat · engineering study",
    nodes: ["Assumption", "Backtest", "Challenge"],
    note: "Testing the explanation, not just the result.",
  },
  netinsight: {
    label: "NetInsight · collection architecture",
    nodes: ["Collect", "Store locally", "Sync later"],
    note: "A network tool designed for disconnection.",
  },
  cmip: {
    label: "CIMFEST 2025 · foundational MVP",
    nodes: ["Artists", "Identity", "Promoters"],
    note: "A 72-hour build. An honest stopping point.",
  },
  educlynk: {
    label: "EducLynk · contribution study",
    nodes: ["Find", "Filter", "Connect"],
    note: "30% improvement in onboarding speed.",
  },
};
export function ProjectArt({ slug }: { slug: string }) {
  const art = graphics[slug] || graphics.cmip;
  return (
    <div
      className="project-art"
      aria-label={`Explanatory diagram: ${art.nodes.join(" to ")}`}
      role="img"
    >
      <span className="eyebrow">{art.label}</span>
      <div className="art-flow" aria-hidden="true">
        {art.nodes.map((node, i) => (
          <div className="art-node" key={node}>
            <span className="eyebrow">0{i + 1}</span>
            {node}
          </div>
        ))}
      </div>
      <span className="art-note" aria-hidden="true">
        {art.note}
      </span>
    </div>
  );
}
