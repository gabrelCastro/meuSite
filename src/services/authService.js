const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require(path.resolve('src', 'repositories', 'userRepository'));

class AuthService {
    static async login(username, password) {
        const user = await UserRepository.findByUsername(username);
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return jwt.sign({ id: user.user }, process.env.TOKEN, { algorithm: 'HS256', expiresIn: '365d' });
    }
}

module.exports = AuthService;
