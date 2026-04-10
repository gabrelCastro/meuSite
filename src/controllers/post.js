const path = require("path");
const Post = require(path.resolve("src","database","Models","Post"));
const dotenv = require('dotenv');
const cloudinary = require(path.resolve("config", "cloudinary"));
const sanitizeHtml = require('sanitize-html');
dotenv.config();

const sanitizeOpts = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
    allowedAttributes: { '*': ['style', 'class'], 'a': ['href', 'target'], 'img': ['src', 'alt'] },
};

class PostController{
    
    static async postStore(req, res) {
        try {
          if (!req.body.titulo || !req.body.conteudo || !req.file) {
            return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
          }
          const imagem = await cloudinary.uploader.upload(req.file.path, {
            folder: "uploads",
          });
          const newPost = await Post.create({
            titulo: req.body.titulo.trim(),
            conteudo: sanitizeHtml(req.body.conteudo, sanitizeOpts),
            img: {
              url: imagem.url,
              public_id: imagem.public_id,
            },
          });
          res.status(201).json({ message: "Criado com sucesso!", Post: newPost });
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao cadastrar Post` });
        }
      }

      static async getPost(req, res) {
        try {
            Post.findAll().then((resultado) => {
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
              res.render('meu_blog', {posts:achados}); 
            });
          } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha ao ver Posts` });
          }
            


      }

      static async getPostPerID(req, res) {
        try {
          const id = await Number(req.params.id);
          const findPost = await Post.findByPk(id);
          res.render('post', {post:findPost});
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao mostrar Post` });
        }
      }

      static async deletePost(req, res) {
        try {
          const id = await Number(req.params.id);
          const postDelete = await Post.findByPk(id);
          await cloudinary.uploader.destroy(postDelete.img.public_id, {
            folder: "uploads",
          });
          postDelete.destroy().then((message) => {
            res.status(200).json({ message: "Post deletado com sucesso." });
          });
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao deletar Post` });
        }
      }

      static async getPostPerIDadmin(req, res) {
        try {
          const id = await Number(req.params.id);
          const findPost = await Post.findByPk(id);
          res.render('editarPost', {post:findPost});
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao mostrar Post` });
        }
      }


      static async getAdmin(req, res) {
        try {
            Post.findAll().then((resultado) => {
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
              res.render('post_admin', {posts:achados}); 
            });
          } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha ao ver Posts` });
          }
            
      }

      static async putPost(req, res) {
        try {
          const editPost = await Post.findByPk(req.params.id);
          let imagem, imagem2, titulo, conteudo;
          if (req.file) {
            await cloudinary.uploader.destroy(editPost.img.public_id, {
              folder: "uploads",
            });
            imagem = await cloudinary.uploader.upload(req.file.path, {
              folder: "uploads",
            });
            imagem2 = await { url: imagem.url, public_id: imagem.public_id };
          } else {
            imagem2 = editPost.img;
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
          await editPost.update(object);
          res.status(201).json({ message: "editado com sucesso!", Post: editPost });
        } catch (erro) {
          res
            .status(500)
            .json({ message: `${erro.message} - Falha ao editar Video` });
        }
      
      }
  
}

module.exports = PostController