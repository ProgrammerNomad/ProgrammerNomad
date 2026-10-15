"use client";
import { useState } from "react";
import { BatteryCharging, HardDrive, ShieldCheck, Wifi } from "lucide-react";
const checks = [
  {
    icon: HardDrive,
    title: "Take the work offline",
    detail:
      "Clone repositories, install dependencies and save the documentation you need.",
  },
  {
    icon: BatteryCharging,
    title: "Plan for power",
    detail:
      "Check charging options and keep the cables for your own devices together.",
  },
  {
    icon: Wifi,
    title: "Check the connection",
    detail:
      "Test accommodation Wi-Fi and prepare a backup before a work session.",
  },
  {
    icon: ShieldCheck,
    title: "Protect the essentials",
    detail:
      "Back up files and make sure you can recover access to your accounts.",
  },
];
export function PackingChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  return (
    <section className="packing-section" aria-labelledby="packing-heading">
      <div>
        <p className="atlas-meta">Before you go / Planning checklist</p>
        <h2 id="packing-heading">Ready for the road.</h2>
        <p className="atlas-description mt-5">
          A simple preparation check for a working trip. Adapt it to your own
          devices and plans.
        </p>
        <p className="atlas-meta mt-6" role="status">
          {checked.length} of {checks.length} checked
        </p>
      </div>
      <div>
        {checks.map(({ icon: Icon, title, detail }) => (
          <label className="packing-check" key={title}>
            <input
              type="checkbox"
              checked={checked.includes(title)}
              onChange={(e) =>
                setChecked((list) =>
                  e.target.checked
                    ? [...list, title]
                    : list.filter((t) => t !== title),
                )
              }
            />
            <Icon aria-hidden="true" size={24} />
            <span>
              <strong>{title}</strong>
              <span>{detail}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
