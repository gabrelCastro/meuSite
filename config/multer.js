const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const UPLOAD_DIR = path.resolve("public", "uploads");

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Tipo de arquivo não permitido. Envie apenas imagens (JPEG, PNG, GIF, WebP) ou PDF."), false);
    }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

async function saveFile(file) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);

    if (file.mimetype === "application/pdf") {
        const filename = unique + ".pdf";
        fs.writeFileSync(path.join(UPLOAD_DIR, filename), file.buffer);
        file.filename = filename;
        return;
    }

    const filename = unique + ".webp";
    await sharp(file.buffer)
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(UPLOAD_DIR, filename));
    file.filename = filename;
}

async function processImage(req, res, next) {
    if (!req.file) return next();
    try {
        await saveFile(req.file);
        next();
    } catch (err) {
        next(err);
    }
}

async function processFields(req, res, next) {
    if (!req.files) return next();
    try {
        const all = Object.values(req.files).flat();
        await Promise.all(all.map(saveFile));
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = upload;
module.exports.processImage = processImage;
module.exports.processFields = processFields;
