/**
 * npm Stats Fetcher
 * Fetches download statistics for npm packages
 */

const axios = require('axios');

/**
 * npm Stats Fetcher Class
 */
class NpmStatsFetcher {
  constructor(packageName) {
    if (!packageName) {
      throw new Error('Package name is required');
    }
    this.packageName = packageName;
    this.baseUrl = 'https://api.npmjs.org';
  }

  /**
   * Get package information
   */
  async getPackageInfo() {
    console.log(`📦 Fetching package info for ${this.packageName}...`);
    
    try {
      const response = await axios.get(`${this.baseUrl}/downloads/point/last-month/${this.packageName}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`   ⚠️ Package "${this.packageName}" not found on npm`);
        return null;
      }
      throw error;
    }
  }

  /**
   * Get download stats for a specific period
   * @param {string} period - 'last-day', 'last-week', 'last-month', 'last-year', or date range
   */
  async getDownloads(period = 'last-month') {
    console.log(`📊 Fetching download stats for ${this.packageName} (${period})...`);
    
    try {
      const url = `${this.baseUrl}/downloads/point/${period}/${this.packageName}`;
      const response = await axios.get(url);
      
      const downloads = response.data.downloads || 0;
      console.log(`   ✅ Downloads (${period}): ${downloads.toLocaleString()}`);
      
      return downloads;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`   ⚠️ No download data available for "${this.packageName}"`);
        return 0;
      }
      throw error;
    }
  }

  /**
   * Get total downloads (all time)
   * Note: npm API doesn't directly provide this, so we estimate from available ranges
   */
  async getTotalDownloads() {
    console.log(`📈 Fetching total downloads for ${this.packageName}...`);
    
    try {
      // Get package creation date
      const registryUrl = `https://registry.npmjs.org/${this.packageName}`;
      const response = await axios.get(registryUrl);
      const createdAt = response.data.time.created;
      const today = new Date();
      const created = new Date(createdAt);
      
      // Calculate date range
      const startDate = created.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      // Get downloads for entire range
      const downloadUrl = `${this.baseUrl}/downloads/range/${startDate}:${endDate}/${this.packageName}`;
      const downloadResponse = await axios.get(downloadUrl);
      
      const totalDownloads = downloadResponse.data.downloads
        .reduce((sum, day) => sum + day.downloads, 0);
      
      console.log(`   ✅ Total downloads (all time): ${totalDownloads.toLocaleString()}`);
      
      return totalDownloads;
    } catch (error) {
      console.warn(`   ⚠️ Could not fetch total downloads: ${error.message}`);
      // Fallback to last year
      return await this.getDownloads('last-year');
    }
  }

  /**
   * Get package version info
   */
  async getVersionInfo() {
    console.log(`📌 Fetching version info for ${this.packageName}...`);
    
    try {
      const url = `https://registry.npmjs.org/${this.packageName}/latest`;
      const response = await axios.get(url);
      
      const info = {
        version: response.data.version,
        description: response.data.description,
        license: response.data.license,
        homepage: response.data.homepage,
        repository: response.data.repository?.url
      };
      
      console.log(`   ✅ Latest version: ${info.version}`);
      
      return info;
    } catch (error) {
      console.warn(`   ⚠️ Could not fetch version info: ${error.message}`);
      return null;
    }
  }

  /**
   * Get comprehensive npm stats
   */
  async getAllStats() {
    console.log(`\n🚀 Fetching all npm stats for ${this.packageName}...\n`);
    
    const startTime = Date.now();

    try {
      const [lastDay, lastWeek, lastMonth, lastYear, versionInfo] = await Promise.all([
        this.getDownloads('last-day'),
        this.getDownloads('last-week'),
        this.getDownloads('last-month'),
        this.getDownloads('last-year'),
        this.getVersionInfo()
      ]);

      const stats = {
        packageName: this.packageName,
        downloads: {
          lastDay,
          lastWeek,
          lastMonth,
          lastYear
        },
        version: versionInfo,
        fetchedAt: new Date().toISOString(),
        fetchDuration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      };

      console.log(`\n✅ npm stats fetched successfully in ${stats.fetchDuration}\n`);
      console.log(`📊 Summary:`);
      console.log(`   📦 Package: ${this.packageName}`);
      console.log(`   📌 Version: ${versionInfo?.version || 'N/A'}`);
      console.log(`   📥 Last Day: ${lastDay.toLocaleString()}`);
      console.log(`   📥 Last Week: ${lastWeek.toLocaleString()}`);
      console.log(`   📥 Last Month: ${lastMonth.toLocaleString()}`);
      console.log(`   📥 Last Year: ${lastYear.toLocaleString()}`);

      return stats;
    } catch (error) {
      console.error(`\n❌ Error fetching npm stats: ${error.message}\n`);
      throw error;
    }
  }
}

/**
 * Check if package exists on npm
 */
async function packageExists(packageName) {
  try {
    const url = `https://registry.npmjs.org/${packageName}`;
    await axios.head(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * CLI execution
 */
async function main() {
  require('dotenv').config();

  const packageName = process.env.NPM_PACKAGE_NAME || process.argv[2];

  if (!packageName) {
    console.error('❌ Error: Package name is required');
    console.error('   Set NPM_PACKAGE_NAME in .env or pass as argument');
    process.exit(1);
  }

  try {
    // Check if package exists first
    const exists = await packageExists(packageName);
    if (!exists) {
      console.error(`❌ Package "${packageName}" not found on npm`);
      console.error('   Make sure the package name is correct');
      process.exit(1);
    }

    const fetcher = new NpmStatsFetcher(packageName);
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

module.exports = { NpmStatsFetcher, packageExists };
