/**
 * Badge Template Generator
 * Creates beautiful SVG badges using badge-maker library
 */

const { makeBadge } = require('badge-maker');

/**
 * Badge style configuration
 */
const BADGE_STYLE = 'for-the-badge'; // Options: flat, flat-square, plastic, for-the-badge, social

/**
 * Color scheme for different badge types
 */
const COLORS = {
  // Premium badges
  gold: '#FFD700',
  premium: '#FFA500',
  
  // Stats badges
  blue: '#0E75B6',
  green: '#2ECC40',
  yellow: '#FFD700',
  orange: '#FF851B',
  purple: '#B10DC9',
  red: '#DC143C',
  teal: '#39CCCC',
  
  // Special badges
  github: '#181717',
  npm: '#CB3837',
  
  // Label backgrounds
  labelBg: '#555555'
};

/**
 * Generate a standard badge
 * @param {string} label - Badge label text
 * @param {string} message - Badge message/value
 * @param {string} color - Badge color (hex or name)
 * @param {object} options - Additional options
 * @returns {string} SVG badge string
 */
function generateBadge(label, message, color, options = {}) {
  const badgeOptions = {
    label,
    message: String(message),
    color,
    style: options.style || BADGE_STYLE,
    labelColor: options.labelColor || COLORS.labelBg,
    ...options
  };
  
  return makeBadge(badgeOptions);
}

/**
 * Generate premium badge with gradient (custom SVG)
 * Used for special badges like "15+ Years Experience"
 */
function generatePremiumBadge(label, message, options = {}) {
  const width = options.width || 280;
  const height = 35;
  
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${label}: ${message}">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFD700;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <g filter="url(#shadow)">
    <rect width="${width}" height="${height}" fill="url(#goldGradient)" rx="4"/>
  </g>
  
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="12" font-weight="bold">
    <text x="${width/2}" y="22" fill="#000" opacity="0.8">${label}</text>
  </g>
</svg>`.trim();
  
  return svg;
}

/**
 * Generate badge with icon (using simple-icons)
 */
function generateBadgeWithIcon(label, message, color, logo, options = {}) {
  return generateBadge(label, message, color, {
    ...options,
    logo,
    logoColor: 'white'
  });
}

/**
 * Badge Templates - Predefined badges for common use cases
 */
const BadgeTemplates = {
  // Experience Badge (Premium Gold)
  experience: (years) => {
    return generatePremiumBadge(
      '💼 EXPERIENCE',
      `${years}+ Years | Since ${2025 - years}`,
      { width: 320 }
    );
  },
  
  // M.Tech Badge (Academic Blue)
  education: (degree, field) => {
    return generateBadge(
      `🎓 ${degree}`,
      field,
      '#4169E1',
      { labelColor: '#1e3a8a' }
    );
  },
  
  // Business Owner Badge (Black/Gold)
  businessOwner: (company) => {
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="35" role="img">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="35" fill="url(#bgGradient)" rx="4"/>
  <g fill="#FFD700" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" font-weight="bold">
    <text x="150" y="22">🏢 BUSINESS OWNER | ${company}</text>
  </g>
</svg>`.trim();
    return svg;
  },
  
  // Tech Architect Badge (Silver/Blue)
  architect: (level = 'SENIOR') => {
    return generateBadge(
      '🏗️ TECH ARCHITECT',
      level,
      '#0E75B6',
      { labelColor: '#C0C0C0' }
    );
  },
  
  // GitHub Stats Badges
  commits: (count, period = '12mo') => {
    return generateBadge(
      `💻 COMMITS (${period})`,
      count.toLocaleString(),
      COLORS.purple
    );
  },
  
  repositories: (count) => {
    return generateBadge(
      '📦 REPOSITORIES',
      count,
      COLORS.green
    );
  },
  
  stars: (count) => {
    return generateBadge(
      '⭐ TOTAL STARS',
      count.toLocaleString(),
      COLORS.yellow
    );
  },
  
  followers: (count) => {
    return generateBadge(
      '👥 FOLLOWERS',
      count.toLocaleString(),
      COLORS.blue
    );
  },
  
  forks: (count) => {
    return generateBadge(
      '🔱 TOTAL FORKS',
      count.toLocaleString(),
      COLORS.orange
    );
  },
  
  // npm Package Badge
  npmDownloads: (packageName, downloads) => {
    return generateBadgeWithIcon(
      'npm downloads',
      downloads.toLocaleString(),
      COLORS.npm,
      'npm'
    );
  },
  
  npmPackage: (packageName) => {
    return generateBadgeWithIcon(
      'npm package',
      packageName,
      COLORS.npm,
      'npm'
    );
  }
};

module.exports = {
  generateBadge,
  generatePremiumBadge,
  generateBadgeWithIcon,
  BadgeTemplates,
  COLORS,
  BADGE_STYLE
};
