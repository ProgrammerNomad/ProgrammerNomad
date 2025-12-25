/**
 * GitHub Stats Fetcher
 * Fetches statistics from GitHub API using Octokit
 */

const { Octokit } = require('@octokit/rest');

/**
 * Rate limiter to handle GitHub API rate limits
 */
class RateLimiter {
  constructor(octokit) {
    this.octokit = octokit;
  }

  async checkAndWait() {
    try {
      const { data } = await this.octokit.rateLimit.get();
      const remaining = data.rate.remaining;
      const resetTime = new Date(data.rate.reset * 1000);

      console.log(`📊 API Rate Limit: ${remaining}/${data.rate.limit} remaining`);

      if (remaining < 10) {
        const waitTime = resetTime - Date.now();
        console.log(`⚠️ Rate limit low. Waiting until ${resetTime.toISOString()}`);
        await new Promise(resolve => setTimeout(resolve, waitTime + 1000));
      }
    } catch (error) {
      console.warn('Could not check rate limit:', error.message);
    }
  }

  async execute(fn) {
    await this.checkAndWait();
    return await fn();
  }
}

/**
 * GitHub Stats Fetcher Class
 */
class GitHubStatsFetcher {
  constructor(username, token) {
    if (!username) {
      throw new Error('GitHub username is required');
    }
    if (!token) {
      throw new Error('GitHub token is required');
    }

    this.username = username;
    this.octokit = new Octokit({ auth: token });
    this.rateLimiter = new RateLimiter(this.octokit);
  }

  /**
   * Get user profile information
   */
  async getUserProfile() {
    console.log(`👤 Fetching profile for ${this.username}...`);
    
    const { data: user } = await this.rateLimiter.execute(() =>
      this.octokit.users.getByUsername({ username: this.username })
    );

    return {
      name: user.name,
      bio: user.bio,
      company: user.company,
      location: user.location,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  /**
   * Get all user repositories
   */
  async getRepositories() {
    console.log(`📦 Fetching repositories for ${this.username}...`);
    
    const repos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data } = await this.rateLimiter.execute(() =>
        this.octokit.repos.listForUser({
          username: this.username,
          per_page: 100,
          page,
          type: 'owner',
          sort: 'updated'
        })
      );

      repos.push(...data);
      hasMore = data.length === 100;
      page++;
      
      if (data.length > 0) {
        console.log(`   📄 Fetched ${repos.length} repositories (page ${page - 1})...`);
      }
    }

    return repos;
  }

  /**
   * Calculate repository statistics
   */
  async getRepositoryStats() {
    const repos = await this.getRepositories();

    const stats = {
      totalRepos: repos.length,
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
      totalWatchers: repos.reduce((sum, repo) => sum + repo.watchers_count, 0),
      totalSize: repos.reduce((sum, repo) => sum + repo.size, 0),
      languages: {}
    };

    // Count languages
    repos.forEach(repo => {
      if (repo.language) {
        stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
      }
    });

    // Sort languages by frequency
    stats.topLanguages = Object.entries(stats.languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ language: lang, count }));

    return stats;
  }

  /**
   * Get commit count for the last 12 months
   */
  async getCommitStats(months = 12) {
    console.log(`💻 Fetching commit stats for last ${months} months...`);
    
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    try {
      // Use search API for commit count
      const { data } = await this.rateLimiter.execute(() =>
        this.octokit.search.commits({
          q: `author:${this.username} committer-date:>=${since.toISOString().split('T')[0]}`,
          per_page: 1
        })
      );

      console.log(`   ✅ Found ${data.total_count} commits in last ${months} months`);
      return data.total_count;
    } catch (error) {
      console.warn(`   ⚠️ Could not fetch commit count: ${error.message}`);
      
      // Fallback: count commits from recent repos
      return await this.getCommitCountFallback(since);
    }
  }

  /**
   * Fallback method to count commits from repositories
   */
  async getCommitCountFallback(since) {
    console.log('   Using fallback method to count commits...');
    
    const repos = await this.getRepositories();
    let totalCommits = 0;
    const recentRepos = repos.slice(0, 20); // Check last 20 repos only

    for (const repo of recentRepos) {
      try {
        const { data: commits } = await this.rateLimiter.execute(() =>
          this.octokit.repos.listCommits({
            owner: this.username,
            repo: repo.name,
            author: this.username,
            since: since.toISOString(),
            per_page: 100
          })
        );
        totalCommits += commits.length;
      } catch (error) {
        // Skip repos with issues
        console.warn(`   Skipping ${repo.name}: ${error.message}`);
      }
    }

    console.log(`   ✅ Counted ${totalCommits} commits (from ${recentRepos.length} repos)`);
    return totalCommits;
  }

  /**
   * Get contribution statistics
   */
  async getContributionStats() {
    console.log(`📈 Fetching contribution stats...`);
    
    const profile = await this.getUserProfile();
    const repoStats = await this.getRepositoryStats();
    const commitCount = await getCommitStats(12);

    return {
      ...profile,
      ...repoStats,
      commitCount12mo: commitCount
    };
  }

  /**
   * Get all stats at once
   */
  async getAllStats() {
    console.log(`\n🚀 Fetching all GitHub stats for ${this.username}...\n`);
    
    const startTime = Date.now();

    try {
      const [profile, repoStats, commitCount] = await Promise.all([
        this.getUserProfile(),
        this.getRepositoryStats(),
        this.getCommitStats(12)
      ]);

      const stats = {
        username: this.username,
        profile,
        repositories: repoStats,
        commits12mo: commitCount,
        fetchedAt: new Date().toISOString(),
        fetchDuration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      };

      console.log(`\n✅ Stats fetched successfully in ${stats.fetchDuration}\n`);
      console.log(`📊 Summary:`);
      console.log(`   👥 Followers: ${profile.followers}`);
      console.log(`   📦 Repositories: ${repoStats.totalRepos}`);
      console.log(`   ⭐ Total Stars: ${repoStats.totalStars}`);
      console.log(`   🔱 Total Forks: ${repoStats.totalForks}`);
      console.log(`   💻 Commits (12mo): ${commitCount}`);

      return stats;
    } catch (error) {
      console.error(`\n❌ Error fetching stats: ${error.message}\n`);
      throw error;
    }
  }
}

/**
 * CLI execution
 */
async function main() {
  require('dotenv').config();

  const username = process.env.GITHUB_USERNAME || process.argv[2];
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    console.error('❌ Error: GITHUB_USERNAME and GITHUB_TOKEN are required');
    console.error('   Set them in .env file or pass as arguments');
    process.exit(1);
  }

  try {
    const fetcher = new GitHubStatsFetcher(username, token);
    const stats = await fetcher.getAllStats();
    
    // Output as JSON for piping
    if (process.argv.includes('--json')) {
      console.log(JSON.stringify(stats, null, 2));
    }
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { GitHubStatsFetcher };
