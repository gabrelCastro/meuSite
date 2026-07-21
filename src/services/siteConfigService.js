const path = require('path');
const SiteConfigRepository = require(path.resolve('src', 'repositories', 'siteConfigRepository'));

const DEFAULTS = { theme: 'dark', accent: 'lime', density: 'airy', heroMode: 'terminal', bg: 'grid' };

const ALLOWED = {
    theme: ['dark', 'light'],
    accent: ['lime', 'amber', 'cyan', 'magenta', 'red'],
    density: ['compact', 'cozy', 'airy'],
    heroMode: ['terminal', 'static'],
    bg: ['off', 'grid', 'matrix', 'constellation', 'ascii'],
};

// Cache em memória para não bater no banco a cada request.
let cache = null;

function pick(record) {
    return {
        theme: record.theme,
        accent: record.accent,
        density: record.density,
        heroMode: record.heroMode,
        bg: record.bg,
    };
}

class SiteConfigService {
    static get DEFAULTS() {
        return Object.assign({}, DEFAULTS);
    }

    static async get() {
        if (cache) return Object.assign({}, cache);
        try {
            const record = await SiteConfigRepository.findFirst();
            cache = record ? pick(record) : Object.assign({}, DEFAULTS);
        } catch (e) {
            // Banco indisponível: usa o padrão sem quebrar a renderização.
            return Object.assign({}, DEFAULTS);
        }
        return Object.assign({}, cache);
    }

    static async save(input) {
        const data = {};
        Object.keys(ALLOWED).forEach((key) => {
            const val = input[key];
            if (val != null && ALLOWED[key].includes(val)) {
                data[key] = val;
            }
        });

        if (Object.keys(data).length === 0) {
            throw new Error('Nenhuma configuração válida foi enviada.');
        }

        const record = await SiteConfigRepository.upsert(data);
        cache = pick(record);
        return Object.assign({}, cache);
    }
}

module.exports = SiteConfigService;
