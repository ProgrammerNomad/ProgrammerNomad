import styles from "./FooterWordmark.module.css";

function Trees() {
  return (
    <g>
      <path d="M0 0L-15 28H-8L-23 51H-10L-30 77H30L10 51H23L8 28H15Z M0 77V92" />
      <path d="M51 31L40 51H46L32 72H45L28 92H74L57 72H69L55 51H62Z M51 92V104" />
    </g>
  );
}
function Camp() {
  return (
    <g>
      <path d="M0 78L46 10L94 78Z M46 10L63 78 M46 36L24 78 M46 36L63 78 M-12 78H108 M40 12L34 2 M52 12L58 2" />
      <path d="M110 75L128 86 M128 75L110 86 M114 68C102 52 129 52 119 39C143 61 127 66 124 70" />
    </g>
  );
}
function Bike() {
  return (
    <g>
      {/* Original side-profile drawing informed by the author's Yezdi reference. */}
      <circle cx="31" cy="83" r="22" strokeWidth="1.8" />
      <circle cx="127" cy="80" r="26" strokeWidth="1.8" />
      <circle cx="31" cy="83" r="16" />
      <circle cx="127" cy="80" r="20" />
      <path
        d="M15 83H47 M31 67V99 M20 72L42 94 M20 94L42 72 M107 80H147 M127 60V100 M113 66L141 94 M113 94L141 66"
        opacity=".5"
      />
      <path d="M31 83L64 75L82 82H31 M31 83L49 51 M43 55L56 68 M46 56L51 52 M48 62L53 58 M50 68L55 64" />
      <path d="M13 56Q28 49 47 56 M114 55Q131 48 146 59 M103 39L123 80 M108 39L129 80" />
      <path
        d="M97 9L109 3L115 28L104 32Z M106 32L116 32L120 42L107 45Z M112 45L145 48L137 53H115"
        fill="#080a08"
      />
      <path d="M93 30L88 19L80 17 M86 20L78 21 M94 30L104 31 M89 19L92 9L99 7 M92 9L86 6L80 9L82 13L91 12" />
      <path d="M13 33H38L48 36H62 M14 33L17 39H39L50 43H64 M10 28H30L36 32 M12 28L9 34" />
      <path
        d="M60 35Q66 24 79 25L92 29L103 44L91 55L66 53L57 44Z"
        fill="#080a08"
      />
      <path
        d="M67 32L81 30L92 36 M92 36L96 45L87 51 M43 44L57 44L65 55L53 61L42 56Z"
        fill="#080a08"
      />
      <path d="M72 53L88 54L94 65L87 77H69L64 66Z" fill="#080a08" />
      <path d="M72 59H86 M71 64H88 M72 69H85 M67 77L69 84H94L100 76 M96 48Q108 54 105 70L98 75 M96 48L87 50 M65 54Q57 58 60 72L67 77 M72 76L54 81 M48 62L29 58L25 64L46 70L59 70" />
      <path d="M16 40L11 47L6 48 M40 40L48 47 M93 75L101 81 M96 80L95 86" />
    </g>
  );
}

/** Symbolic landscape, not a map or a record of an actual route. */
export function FooterLandscape() {
  return (
    <div className={styles.landscape} aria-hidden="true">
      <svg
        className={styles.desktopLandscape}
        data-testid="footer-landscape-desktop"
        viewBox="0 0 1200 230"
        fill="none"
      >
        <g className={`${styles.scenery} ${styles.technical}`}>
          <path d="M38 136L17 154L38 172 M79 136L100 154L79 172 M65 126L51 181 M114 178H146" />
          <path d="M165 153H209L239 117H292L319 155H353 M239 117L258 159L292 117 M209 153L258 159L319 155 M239 117L261 89L292 117" />
          {[
            [209, 153],
            [239, 117],
            [292, 117],
            [319, 155],
            [258, 159],
            [261, 89],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
          ))}
          <text x="228" y="204">
            CODE / AI / ML
          </text>
        </g>
        <g className={`${styles.scenery} ${styles.mountains}`}>
          <path d="M352 180L433 88L463 116L516 33L627 180 M433 88L447 122L463 116 M516 33L501 88L519 75L538 99 M564 106L600 75L694 180 M366 196H640" />
          <circle cx="616" cy="49" r="16" />
        </g>
        <g
          className={`${styles.scenery} ${styles.forest}`}
          transform="translate(672 75)"
        >
          <Trees />
        </g>
        <g
          className={`${styles.scenery} ${styles.camp}`}
          transform="translate(768 102)"
        >
          <Camp />
        </g>
        <g className={`${styles.scenery} ${styles.water}`}>
          <path d="M916 185C933 178 950 191 967 185S1000 178 1017 185 M925 199C941 193 954 204 970 199S995 193 1008 199 M943 214H992" />
          <path d="M918 166Q966 127 1013 166 M927 159V173 M945 148V172 M964 143V172 M984 148V173 M1003 159V173" />
        </g>
        <path
          className={styles.routeBase}
          d="M2 180H330C365 180 391 135 433 88L463 116L516 33L627 180H914Q966 143 1018 180H1198"
        />
        <path
          className={styles.routeDraw}
          pathLength="1"
          d="M2 180H330C365 180 391 135 433 88L463 116L516 33L627 180H914Q966 143 1018 180H1198"
        />
        <g className={styles.bike} transform="translate(1023 74)">
          <g className={styles.bikeMotion}>
            <Bike />
          </g>
        </g>
        <circle className={styles.destination} cx="1198" cy="180" r="2" />
      </svg>
      <svg
        className={styles.mobileLandscape}
        data-testid="footer-landscape-mobile"
        viewBox="0 0 360 190"
        fill="none"
      >
        <g className={`${styles.scenery} ${styles.mountains}`}>
          <path d="M3 135L57 65L81 87L121 26L199 135 M57 65L67 91L81 87 M121 26L110 62L125 54L138 72" />
          <circle cx="179" cy="35" r="10" />
        </g>
        <g
          className={`${styles.scenery} ${styles.forest}`}
          transform="translate(204 64) scale(.55)"
        >
          <Trees />
        </g>
        <g
          className={`${styles.scenery} ${styles.camp}`}
          transform="translate(247 84) scale(.6)"
        >
          <Camp />
        </g>
        <g className={`${styles.scenery} ${styles.water}`}>
          <path d="M90 151Q104 144 118 151T147 151 M100 165Q114 158 128 165T153 165 M98 131Q127 108 155 131 M106 123V135 M126 117V135 M145 123V135" />
        </g>
        <path className={styles.routeBase} d="M2 135H94Q126 110 157 135H358" />
        <path
          className={styles.routeDraw}
          pathLength="1"
          d="M2 135H94Q126 110 157 135H358"
        />
        <g className={styles.bike} transform="translate(290 95) scale(.38)">
          <g className={styles.bikeMotion}>
            <Bike />
          </g>
        </g>
        <circle className={styles.destination} cx="358" cy="135" r="1.5" />
      </svg>
    </div>
  );
}
