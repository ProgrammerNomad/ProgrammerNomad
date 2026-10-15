import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { HeroArt } from "@/components/hero/HeroArt";
import { getPosterPaths } from "@/components/hero/poster-paths";
import type { TravelDestination } from "@/lib/travel/destinations";
import styles from "./HomeOpening.module.css";

export function HomeOpening({
  destinations,
}: {
  destinations: TravelDestination[];
}) {
  return (
    <section className={styles.opening} aria-labelledby="home-heading">
      <div className={styles.masthead}>
        <span>
          <span className={styles.marker} aria-hidden="true" /> THE NOMAD
          PROGRAMMER
        </span>
        <span className={styles.edition}>SOFTWARE / STORIES / OPEN ROADS</span>
      </div>
      <div className={styles.composition}>
        <div className={styles.introduction}>
          <p className={styles.eyebrow}>A DEVELOPER WITH A DIFFERENT VIEW</p>
          <h1 id="home-heading" className={styles.headline}>
            Tech by
            <br />
            profession.
            <br />
            <span>
              Traveler
              <br />
              by soul.
            </span>
          </h1>
          <p className={styles.description}>
            Building software. Exploring new places.
            <br className={styles.desktopBreak} /> Sharing what I learn along
            the way.
          </p>
          <nav className={styles.actions} aria-label="Explore Nomad Programmer">
            <Link href="/work" className={styles.primaryAction}>
              Explore projects <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link href="/field-notes" className={styles.secondaryAction}>
              Explore journeys <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </nav>
          <Link
            href="/about"
            className={styles.signature}
            aria-label="About Shiv Singh"
          >
            <Image
              src="/images/shiv-singh.jpg"
              alt="Shiv Singh"
              width={56}
              height={56}
              className={styles.portrait}
              sizes="56px"
            />
            <div>
              <p className={styles.author}>
                Shiv Singh <span>/ Nomad Programmer</span>
              </p>
              <p className={styles.authorDetail}>
                CTO at Mobrilz · 15+ years in software
              </p>
            </div>
            <ArrowUpRight
              className={styles.signatureArrow}
              size={17}
              aria-hidden="true"
            />
          </Link>
        </div>
        <HeroArt destinations={destinations} initialPaths={destinations[0] ? getPosterPaths(destinations[0]) : []} />
      </div>
      <div className={styles.openingFoot}>
        <span>BUILD SOMETHING. GO SOMEWHERE.</span>
        <a href="#home-highlights">
          Continue exploring <ArrowDownRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
