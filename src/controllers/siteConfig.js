const path = require('path');
const SiteConfigService = require(path.resolve('src', 'services', 'siteConfigService'));

class SiteConfigController {
    // Script servido ao cliente (permitido pelo CSP por ser 'self').
    static async clientScript(req, res) {
        let config;
        try {
            config = await SiteConfigService.get();
        } catch (e) {
            config = SiteConfigService.DEFAULTS;
        }
        res.type('application/javascript');
        res.set('Cache-Control', 'no-store');
        res.send('window.__TWEAKS__=' + JSON.stringify(config) + ';');
    }

    static async save(req, res) {
        try {
            const config = await SiteConfigService.save(req.body || {});
            res.status(200).json({ message: 'Aparência do site atualizada!', config });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = SiteConfigController;
