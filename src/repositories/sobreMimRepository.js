const path = require('path');
const SobreMim = require(path.resolve('src', 'database', 'Models', 'sobreMim'));

class SobreMimRepository {
    static findFirst() {
        return SobreMim.findOne();
    }

    static create(data) {
        return SobreMim.create(data);
    }

    static async upsert(data) {
        const existing = await SobreMim.findOne();
        if (existing) {
            return existing.update(data);
        }
        return SobreMim.create(data);
    }
}

module.exports = SobreMimRepository;
