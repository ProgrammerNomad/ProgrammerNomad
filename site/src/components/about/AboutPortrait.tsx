import Image from "next/image";
import styles from "./AboutPortrait.module.css";

export function AboutPortrait() {
  return (
    <figure className={styles.frame}>
      <div className={styles.photoFrame}>
        <div className={styles.window}>
          <Image
            src="/images/shiv-singh.jpg"
            alt="Shiv Singh, Nomad Programmer"
            width={2316}
            height={3088}
            sizes="(max-width:700px) calc(100vw - 32px), (max-width:1152px) 44vw, 480px"
            priority
            className={`about-portrait ${styles.portrait}`}
          />
          <svg
            className={styles.route}
            viewBox="0 0 100 125"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              className={styles.routePath}
              d="M2 125V32C2 15 23 2 50 2S98 15 98 32v81"
            />
            <circle className={styles.waypointRing} cx="98" cy="113" r="3.6" />
            <circle className={styles.waypoint} cx="98" cy="113" r="1.35" />
            <g className={styles.spark}>
              <path d="M98 105v4m0 8v4m-8-8h4m8 0h4m-13-5 3 3m8 8 3 3m0-14-3 3m-8 8-3 3" />
            </g>
          </svg>
        </div>
      </div>
      <figcaption className="atlas-meta mt-4">
        Shiv Singh / Nomad Programmer
      </figcaption>
    </figure>
  );
}
