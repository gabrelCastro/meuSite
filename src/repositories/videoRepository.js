const path = require('path');
const Video = require(path.resolve('src', 'database', 'Models', 'video'));

class VideoRepository {
    static findAll() {
        return Video.findAll({ order: [['createdAt', 'DESC']] });
    }

    static findById(id) {
        return Video.findByPk(id);
    }

    static findBySlug(slug) {
        return Video.findOne({ where: { slug } });
    }

    static create(data) {
        return Video.create(data);
    }

    static update(video, data) {
        return video.update(data);
    }

    static delete(video) {
        return video.destroy();
    }
}

module.exports = VideoRepository;
