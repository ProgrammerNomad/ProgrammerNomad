"use client";

import { useState } from "react";

export function CapabilityDiagram({
  nodes,
}: {
  nodes: { label: string; detail: string }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <section className="capability-diagram" aria-label="Project capability map">
      <p className="atlas-meta">Under the hood / Select a capability</p>
      <div className="capability-nodes">
        {nodes.map((node, index) => (
          <button
            type="button"
            key={node.label}
            className="capability-node"
            aria-pressed={active === index}
            aria-controls="capability-detail"
            onClick={() => setActive(index)}
          >
            <span className="atlas-meta">0{index + 1}</span>
            <strong>{node.label}</strong>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <p id="capability-detail" role="status" className="capability-detail">
        {nodes[active]?.detail}
      </p>
      <p className="atlas-meta mt-6">
        Conceptual capability map · based on the project notes below
      </p>
    </section>
  );
}
