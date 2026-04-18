function wantsJson(req) {
    return req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
}

module.exports = { wantsJson };
