const path = require("path");
const Video = require(path.resolve("src","database","Models","video"));
const dotenv = require('dotenv');
const cloudinary = require(path.resolve("config", "cloudinary"));
const sanitizeHtml = require('sanitize-html');
dotenv.config();

const sanitizeOpts = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
    allowedAttributes: { '*': ['style', 'class'], 'a': ['href', 'target'], 'img': ['src', 'alt'] },
};

class VideoController{
    
    static async videoStore(req, res) {
        try {
          if (!req.body.titulo || !req.body.conteudo || !req.file) {
            return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
          }
          const imagem = await cloudinary.uploader.upload(req.file.path, {
            folder: "uploads",
          });
          const newVideo = await Video.create({
            titulo: req.body.titulo.trim(),
            conteudo: sanitizeHtml(req.body.conteudo, sanitizeOpts),
            img: {
              url: imagem.url,
              public_id: imagem.public_id,
            },
          });
          res.status(201).json({ message: "Criado com sucesso!", Video: newVideo });
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao cadastrar Video` });
        }
      }

      static async getVideo(req, res) {
        try {
            Video.findAll().then((resultado) => {
              let achados = [];
              resultado.forEach((element) => {
                achados.push({
                  id: element.id,
                  titulo: element.titulo,
                  conteudo: element.conteudo,
                  img: element.img.url,
                  createdAt : element.createdAt,
                  updatedAt : element.updatedAt
      
                });
              });
              res.render('explicando', {videos:achados}); 
            });
          } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha ao ver Posts` });
          }
            


      }

      static async getVideoPerID(req, res) {
        try {
          const id = await Number(req.params.id);
          const findVideo = await Video.findByPk(id);
          res.render('video', {post:findVideo});
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao mostrar Post` });
        }
      }

      static async getVideoPerIDadmin(req, res) {
        try {
          const id = await Number(req.params.id);
          const findVideo = await Video.findByPk(id);
          res.render('editarVideo', {post:findVideo});
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao mostrar Post` });
        }
      }



      static async deleteVideo(req, res) {
        try {
          const id = await Number(req.params.id);
          const videoDelete = await Video.findByPk(id);
          videoDelete.destroy().then((message) => {
            res.status(200).json({ message: "Video deletado com sucesso." });
          });
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao deletar Video` });
        }
      }

      static async getAdmin(req, res) {
        try {
            Video.findAll().then((resultado) => {
              let achados = [];
              resultado.forEach((element) => {
                achados.push({
                  id: element.id,
                  titulo: element.titulo,
                  conteudo: element.conteudo,
                  img: element.img.url,
                  createdAt : element.createdAt,
                  updatedAt : element.updatedAt
      
                });
              });
              res.render('video_admin', {videos:achados}); 
            });
          } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha ao ver Videos` });
          }
            
      }

      static async putVideo(req, res) {
        try {
          const editVideo = await Video.findByPk(req.params.id);
          let imagem, imagem2, titulo, conteudo;
          if (req.file) {
            await cloudinary.uploader.destroy(editVideo.img.public_id, {
              folder: "uploads",
            });
            imagem = await cloudinary.uploader.upload(req.file.path, {
              folder: "uploads",
            });
            imagem2 = await { url: imagem.url, public_id: imagem.public_id };
          } else {
            imagem2 = editVideo.img;
          }
    
          if (req.body.titulo) {
            titulo = req.body.titulo.trim();
          }
          if (req.body.conteudo) {
            conteudo = sanitizeHtml(req.body.conteudo, sanitizeOpts);
          }

          const object = {
            titulo: titulo,
            conteudo: conteudo,
            img: imagem2,
          };
          await editVideo.update(object);
          res.status(201).json({ message: "editado com sucesso!", Video: editVideo });
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao editar Video` });
        }
      
      }
  
}

module.exports = VideoController