import { FileText, ShieldCheck, Globe2, MousePointer2 } from "lucide-react";
export function ArticleFlow() {
  const steps = [
    { icon: FileText, title: "Author", detail: "Git-managed MDX" },
    {
      icon: ShieldCheck,
      title: "Validate",
      detail: "Frontmatter + allowed components",
    },
    { icon: Globe2, title: "Serve", detail: "Readable HTML" },
    { icon: MousePointer2, title: "Enhance", detail: "Optional interaction" },
  ];
  return (
    <figure className="article-flow">
      <figcaption>
        <span className="atlas-meta">
          Concept / A static-first content path
        </span>
        <p>Useful before JavaScript. Richer when it is available.</p>
      </figcaption>
      <ol>
        {steps.map(({ icon: Icon, title, detail }) => (
          <li key={title}>
            <Icon aria-hidden="true" size={22} />
            <strong>{title}</strong>
            <span>{detail}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
