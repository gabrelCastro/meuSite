const path = require('path');
const fs = require('fs');
const SobreMimRepository = require(path.resolve('src', 'repositories', 'sobreMimRepository'));

function deleteFile(url) {
    if (!url) return;
    const filePath = path.resolve('public', url.replace(/^\//, ''));
    fs.unlink(filePath, () => {});
}

class SobreMimService {
    static async get() {
        const record = await SobreMimRepository.findFirst();
        if (!record) return null;
        return {
            id: record.id,
            resumo: record.resumo,
            cargo: record.cargo,
            empresa: record.empresa,
            formacao: record.formacao,
            universidade: record.universidade,
            previsaoFormatura: record.previsaoFormatura,
            tecnologias: record.tecnologias || [],
            experiencias: record.experiencias || [],
            foto: record.foto ? record.foto.url : null,
        };
    }

    static async upsert({ resumo, cargo, empresa, formacao, universidade, previsaoFormatura, tecnologias, experiencias, filename }) {
        const existing = await SobreMimRepository.findFirst();

        let foto = existing ? existing.foto : null;
        if (filename) {
            if (existing && existing.foto) {
                deleteFile(existing.foto.url);
            }
            foto = { url: '/uploads/' + filename };
        }

        let techs = tecnologias;
        if (typeof tecnologias === 'string') {
            techs = tecnologias.split(',').map(t => t.trim()).filter(Boolean);
        }

        let exps = experiencias;
        if (typeof experiencias === 'string') {
            try {
                exps = JSON.parse(experiencias);
            } catch (e) {
                throw new Error('Formato de experiências inválido. Envie um JSON válido.');
            }
        }

        return SobreMimRepository.upsert({
            resumo,
            cargo,
            empresa,
            formacao,
            universidade,
            previsaoFormatura,
            tecnologias: techs || [],
            experiencias: exps || [],
            foto,
        });
    }
}

module.exports = SobreMimService;
