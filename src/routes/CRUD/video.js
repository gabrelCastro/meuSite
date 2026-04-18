const express = require('express');
const path = require("path");
const routes = express.Router();
const videoController = require(path.resolve("src","controllers","video"));
const upload = require(path.resolve("config","multer"));
const { processImage } = require(path.resolve("config","multer"));
const auth = require(path.resolve("src","middlewares","auth"));
const { validateVideoCreate, validateVideoUpdate, validateId } = require(path.resolve("src","middlewares","validators"));

routes.post("/video", auth, upload.single('imagem'), processImage, validateVideoCreate, videoController.videoStore);
routes.get("/videos", videoController.getVideo);
routes.get("/video/:id", validateId, videoController.getVideoPerID);
routes.delete("/video/:id", auth, validateId, videoController.deleteVideo);
routes.get("/videoAdmin", auth, videoController.getAdmin);
routes.get("/videoEditar/:id", auth, validateId, videoController.getVideoPerIDadmin);
routes.put("/videoEditar/:id", auth, upload.single("imagem"), processImage, validateVideoUpdate, videoController.putVideo);

module.exports = routes;