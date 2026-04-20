const path = require('path');
const Post = require(path.resolve('src', 'database', 'Models', 'Post'));

class PostRepository {
    static findAll() {
        return Post.findAll({ order: [['createdAt', 'DESC']] });
    }

    static findById(id) {
        return Post.findByPk(id);
    }

    static findBySlug(slug) {
        return Post.findOne({ where: { slug } });
    }

    static create(data) {
        return Post.create(data);
    }

    static update(post, data) {
        return post.update(data);
    }

    static delete(post) {
        return post.destroy();
    }
}

module.exports = PostRepository;
