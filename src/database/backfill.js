const path = require('path');
const { Op } = require('sequelize');

function generateSlug(titulo) {
    return titulo
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function generateUniqueSlug(Model, titulo, excludeId) {
    const base = generateSlug(titulo);
    let slug = base;
    let counter = 2;
    while (true) {
        const existing = await Model.findOne({ where: { slug } });
        if (!existing || existing.id === excludeId) break;
        slug = `${base}-${counter++}`;
    }
    return slug;
}

async function backfillSlugs() {
    const Video = require(path.resolve('src', 'database', 'Models', 'video'));
    const Post = require(path.resolve('src', 'database', 'Models', 'Post'));

    for (const Model of [Video, Post]) {
        const records = await Model.findAll({ where: { slug: { [Op.is]: null } } });
        for (const record of records) {
            const slug = await generateUniqueSlug(Model, record.titulo, record.id);
            await record.update({ slug });
        }
        if (records.length > 0) {
            console.log(`Backfill: ${records.length} slug(s) gerado(s) para ${Model.name}`);
        }
    }
}

module.exports = backfillSlugs;
