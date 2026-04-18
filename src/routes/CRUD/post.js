const express = require('express');
const path = require("path");
const routes = express.Router();
const postController = require(path.resolve("src","controllers","post"));
const upload = require(path.resolve("config","multer"));
const { processImage } = require(path.resolve("config","multer"));
const auth = require(path.resolve("src","middlewares","auth"));
const { validatePostCreate, validatePostUpdate, validateId } = require(path.resolve("src","middlewares","validators"));

routes.post("/post", auth, upload.single('imagem'), processImage, validatePostCreate, postController.postStore);
routes.get("/blog", postController.getPost);
routes.get("/post/:id", validateId, postController.getPostPerID);
routes.delete("/post/:id", auth, validateId, postController.deletePost);
routes.get("/postAdmin", auth, postController.getAdmin);
routes.get("/postEditar/:id", auth, validateId, postController.getPostPerIDadmin);
routes.put("/postEditar/:id", auth, upload.single("imagem"), processImage, validatePostUpdate, postController.putPost);

module.exports = routes;