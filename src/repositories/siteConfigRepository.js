const path = require('path');
const SiteConfig = require(path.resolve('src', 'database', 'Models', 'siteConfig'));

class SiteConfigRepository {
    static findFirst() {
        return SiteConfig.findOne({ order: [['id', 'ASC']] });
    }

    static async upsert(data) {
        const existing = await SiteConfig.findOne({ order: [['id', 'ASC']] });
        if (existing) {
            return existing.update(data);
        }
        return SiteConfig.create(data);
    }
}

module.exports = SiteConfigRepository;
