const path = require('path');
const User = require(path.resolve('src', 'database', 'Models', 'user'));

class UserRepository {
    static findByUsername(username) {
        return User.findOne({ where: { user: username } });
    }
}

module.exports = UserRepository;
