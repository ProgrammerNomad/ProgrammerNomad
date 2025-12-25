/**
 * Badge Generator - Main Script
 * Generates all badges and saves them to the badges/ folder
 */

const fs = require('fs').promises;
const path = require('path');
const { GitHubStatsFetcher } = require('./fetch-github-stats');
const { NpmStatsFetcher, packageExists } = require('./fetch-npm-stats');
const { BadgeTemplates } = require('./badge-template');

// Configuration
const BADGES_DIR = path.join(__dirname, '..', 'badges');
const STATS_FILE = path.join(BADGES_DIR, 'stats.json');

/**
 * Main Badge Generator Class
 */
class BadgeGenerator {
  constructor(config) {
    this.config = {
      username: config.username,
      token: config.token,
      npmPackage: config.npmPackage,
      dryRun: config.dryRun || false
    };

    if (!this.config.username) {
      throw new Error('GitHub username is required');
    }
    if (!this.config.token) {
      throw new Error('GitHub token is required');
    }
  }

  /**
   * Ensure badges directory exists
   */
  async ensureBadgesDir() {
    try {
      await fs.mkdir(BADGES_DIR, { recursive: true });
      console.log(`📁 Badges directory ready: ${BADGES_DIR}`);
    } catch (error) {
      console.error(`❌ Could not create badges directory: ${error.message}`);
      throw error;
    }
  }

  /**
   * Save badge to file
   */
  async saveBadge(filename, svg) {
    if (this.config.dryRun) {
      console.log(`   🔍 [DRY RUN] Would save: ${filename}`);
      return;
    }

    const filePath = path.join(BADGES_DIR, filename);
    await fs.writeFile(filePath, svg, 'utf8');
    console.log(`   ✅ Saved: ${filename}`);
  }

  /**
   * Generate static badges (credentials)
   */
  async generateStaticBadges() {
    console.log(`\n🎨 Generating static badges...\n`);

    const staticBadges = {
      'experience-15years.svg': BadgeTemplates.experience(15),
      'education-mtech.svg': BadgeTemplates.education('M.TECH', 'Computer Science'),
      'business-owner.svg': BadgeTemplates.businessOwner('srapsware.com'),
      'tech-architect.svg': BadgeTemplates.architect('SENIOR')
    };

    for (const [filename, svg] of Object.entries(staticBadges)) {
      await this.saveBadge(filename, svg);
    }

    console.log(`\n✅ Static badges generated: ${Object.keys(staticBadges).length}\n`);
  }

  /**
   * Generate GitHub stats badges
   */
  async generateGitHubBadges() {
    console.log(`\n🐙 Generating GitHub badges...\n`);

    try {
      const fetcher = new GitHubStatsFetcher(this.config.username, this.config.token);
      const stats = await fetcher.getAllStats();

      const githubBadges = {
        'commits-12mo.svg': BadgeTemplates.commits(stats.commits12mo, '12mo'),
        'repositories.svg': BadgeTemplates.repositories(stats.repositories.totalRepos),
        'stars-total.svg': BadgeTemplates.stars(stats.repositories.totalStars),
        'followers.svg': BadgeTemplates.followers(stats.profile.followers),
        'forks-total.svg': BadgeTemplates.forks(stats.repositories.totalForks)
      };

      for (const [filename, svg] of Object.entries(githubBadges)) {
        await this.saveBadge(filename, svg);
      }

      console.log(`\n✅ GitHub badges generated: ${Object.keys(githubBadges).length}\n`);

      return stats;
    } catch (error) {
      console.error(`\n❌ Error generating GitHub badges: ${error.message}\n`);
      throw error;
    }
  }

  /**
   * Generate npm badges
   */
  async generateNpmBadges() {
    if (!this.config.npmPackage) {
      console.log(`\n⏭️  Skipping npm badges (no package configured)\n`);
      return null;
    }

    console.log(`\n📦 Generating npm badges...\n`);

    try {
      // Check if package exists
      const exists = await packageExists(this.config.npmPackage);
      if (!exists) {
        console.warn(`⚠️ Package "${this.config.npmPackage}" not found on npm`);
        console.warn(`   Skipping npm badges\n`);
        return null;
      }

      const fetcher = new NpmStatsFetcher(this.config.npmPackage);
      const stats = await fetcher.getAllStats();

      const npmBadges = {
        'npm-package.svg': BadgeTemplates.npmPackage(this.config.npmPackage),
        'npm-downloads.svg': BadgeTemplates.npmDownloads(
          this.config.npmPackage,
          stats.downloads.lastMonth
        )
      };

      for (const [filename, svg] of Object.entries(npmBadges)) {
        await this.saveBadge(filename, svg);
      }

      console.log(`\n✅ npm badges generated: ${Object.keys(npmBadges).length}\n`);

      return stats;
    } catch (error) {
      console.error(`\n❌ Error generating npm badges: ${error.message}\n`);
      console.warn(`   Continuing without npm badges...\n`);
      return null;
    }
  }

  /**
   * Save stats to JSON file for reference
   */
  async saveStats(githubStats, npmStats) {
    if (this.config.dryRun) {
      console.log(`\n🔍 [DRY RUN] Would save stats.json\n`);
      return;
    }

    const stats = {
      generatedAt: new Date().toISOString(),
      github: githubStats,
      npm: npmStats
    };

    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), 'utf8');
    console.log(`📄 Stats saved to: ${path.basename(STATS_FILE)}\n`);
  }

  /**
   * Generate all badges
   */
  async generateAll() {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🚀 BADGE GENERATOR - Starting...`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(`Configuration:`);
    console.log(`   👤 GitHub User: ${this.config.username}`);
    console.log(`   📦 npm Package: ${this.config.npmPackage || 'None'}`);
    console.log(`   🔍 Dry Run: ${this.config.dryRun ? 'YES' : 'NO'}`);
    console.log(``);

    const startTime = Date.now();

    try {
      // Create badges directory
      await this.ensureBadgesDir();

      // Generate all badge types
      await this.generateStaticBadges();
      const githubStats = await this.generateGitHubBadges();
      const npmStats = await this.generateNpmBadges();

      // Save stats for reference
      await this.saveStats(githubStats, npmStats);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log(`\n${'='.repeat(80)}`);
      console.log(`✅ BADGE GENERATION COMPLETE!`);
      console.log(`${'='.repeat(80)}\n`);
      console.log(`⏱️  Total time: ${duration}s`);
      console.log(`📁 Output directory: ${BADGES_DIR}`);
      console.log(``);
      console.log(`Next steps:`);
      console.log(`   1. Check the badges/ folder for generated SVGs`);
      console.log(`   2. Open badges in browser to verify`);
      console.log(`   3. Update README.md with badge URLs`);
      console.log(`   4. Commit and push to GitHub`);
      console.log(``);

      return { githubStats, npmStats, duration };
    } catch (error) {
      console.error(`\n${'='.repeat(80)}`);
      console.error(`❌ BADGE GENERATION FAILED`);
      console.error(`${'='.repeat(80)}\n`);
      console.error(`Error: ${error.message}`);
      console.error(``);
      throw error;
    }
  }
}

/**
 * CLI execution
 */
async function main() {
  require('dotenv').config();

  const config = {
    username: process.env.GITHUB_USERNAME || process.argv[2],
    token: process.env.GITHUB_TOKEN,
    npmPackage: process.env.NPM_PACKAGE_NAME,
    dryRun: process.argv.includes('--dry-run')
  };

  // Validation
  if (!config.username) {
    console.error('❌ Error: GITHUB_USERNAME is required');
    console.error('   Set in .env file or pass as argument: node generate-badges.js <username>');
    process.exit(1);
  }

  if (!config.token) {
    console.error('❌ Error: GITHUB_TOKEN is required');
    console.error('   Set in .env file');
    console.error('   Get token at: https://github.com/settings/tokens/new');
    process.exit(1);
  }

  try {
    const generator = new BadgeGenerator(config);
    await generator.generateAll();
    process.exit(0);
  } catch (error) {
    console.error('\nFatal error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { BadgeGenerator };
