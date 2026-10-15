import Image from "next/image";
import type { CSSProperties } from "react";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import {
  Package,
  Truck,
  Search,
  MapPin,
  Bold,
  Italic,
  List,
  Code2,
} from "lucide-react";
import styles from "./ProjectPreview.module.css";

export function ProjectVisual({ entry }: { entry: WorkFrontmatter }) {
  if (entry.cover && !entry.cover.endsWith("/default.svg"))
    return (
      <div className="project-visual">
        <Image
          src={entry.cover}
          alt={`${entry.title} preview`}
          fill
          sizes="(max-width:700px) 100vw, 650px"
          className="object-cover"
        />
      </div>
    );
  if (entry.slug === "shiprocket-woo-shipping")
    return (
      <div
        className={styles.preview}
        role="img"
        aria-label="Shiprocket capability schematic: WooCommerce orders, PHP integration, labels and tracking"
      >
        <p className={styles.label}>01 / Capability schematic</p>
        <div className={styles.shipping}>
          <div className={styles.node}>
            <Package size={28} aria-hidden="true" />
            <span>
              WooCommerce
              <br />
              orders
            </span>
          </div>
          <span className={styles.bridge}>
            PHP
            <br />↔
          </span>
          <div className={styles.node}>
            <Truck size={28} aria-hidden="true" />
            <span>
              Labels &amp;
              <br />
              tracking
            </span>
          </div>
        </div>
        <p className={styles.bottom}>THE SHIPPING CONNECTION / PHP</p>
      </div>
    );
  if (entry.slug === "indian-railway-station-search")
    return (
      <div
        className={`${styles.preview} ${styles.rail}`}
        role="img"
        aria-label="Railway search concept: find by name or code, explore station records"
      >
        <p className={styles.label}>02 / Search concept</p>
        <div className={styles.railSearch}>
          <Search size={24} aria-hidden="true" />
          <span>Name or station code</span>
        </div>
        <div className={styles.railRows}>
          <div className={styles.railRow}>
            <span />
            Multilingual names
          </div>
          <div className={styles.railRow}>
            <MapPin size={15} aria-hidden="true" />
            Station details, in one place
          </div>
        </div>
        <p className={styles.bottom}>A WAY INTO THE RAIL NETWORK</p>
      </div>
    );
  if (entry.slug === "likhaeditor")
    return (
      <div
        className={`${styles.preview} ${styles.editor}`}
        role="img"
        aria-label="LikhaEditor concept: an embeddable editor with an API-friendly document model"
      >
        <p className={styles.label}>03 / Editor concept</p>
        <div className={styles.toolbar}>
          <Bold size={16} aria-hidden="true" />
          <Italic size={16} aria-hidden="true" />
          <List size={16} aria-hidden="true" />
          <Code2 size={16} aria-hidden="true" />
        </div>
        <div className={styles.document}>
          <strong>
            Your words.
            <br />
            Your workspace.
          </strong>
          <p>Embed. Edit. Keep control of the document.</p>
        </div>
        <p className={styles.bottom}>SELF-HOSTED / TYPESCRIPT</p>
      </div>
    );
  const palette = entry.categories.includes("IoT")
    ? "#e8b86d"
    : entry.categories.includes("TypeScript")
      ? "#92c8e5"
      : entry.categories.includes("Python")
        ? "#e2cc8f"
        : "#b5ff43";
  return (
    <div
      className="project-visual project-visual--abstract"
      style={{ "--project-accent": palette } as CSSProperties}
      aria-label={`${entry.title}: typographic project identity, not a product screenshot`}
      role="img"
    >
      <div className="project-visual-top">
        <span>NP / OPEN SOURCE</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="project-monogram" aria-hidden="true">
        {entry.title.replace(/[^A-Z]/g, "").slice(0, 3) ||
          entry.title.slice(0, 2)}
      </div>
      <div className="project-visual-bottom">
        <span>{entry.slug}</span>
        <span>{entry.tech[0] ?? "Software"}</span>
      </div>
    </div>
  );
}
