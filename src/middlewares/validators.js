const { body, param, validationResult } = require('express-validator');

// -------------------------------------------------------------------
// Middleware genérico que coleta os erros do express-validator e
// responde com 400 + lista de mensagens.  Funciona tanto para
// requisições JSON quanto para navegador (form submit).
// -------------------------------------------------------------------
function isAjax(req) {
    return req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
}

function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const msgs = errors.array().map(e => e.msg);
    if (isAjax(req)) {
        return res.status(400).json({ message: 'Erro de validação', errors: msgs });
    }
    return res.status(400).send('Erro de validação: ' + msgs.join(', '));
}

// -------------------------------------------------------------------
// Validação de :id como inteiro positivo  (usado em GET, PUT, DELETE)
// -------------------------------------------------------------------
const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID inválido — deve ser um número inteiro positivo')
        .toInt(),
    handleValidation,
];

// -------------------------------------------------------------------
//  POST
// -------------------------------------------------------------------
const validatePostCreate = [
    body('titulo')
        .trim()
        .notEmpty().withMessage('Título é obrigatório')
        .isLength({ max: 255 }).withMessage('Título deve ter no máximo 255 caracteres'),
    body('conteudo')
        .trim()
        .notEmpty().withMessage('Conteúdo é obrigatório'),
    handleValidation,
];

const validatePostUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID inválido')
        .toInt(),
    body('titulo')
        .optional()
        .trim()
        .notEmpty().withMessage('Título não pode ser vazio')
        .isLength({ max: 255 }).withMessage('Título deve ter no máximo 255 caracteres'),
    body('conteudo')
        .optional()
        .trim()
        .notEmpty().withMessage('Conteúdo não pode ser vazio'),
    handleValidation,
];

// -------------------------------------------------------------------
//  VIDEO
// -------------------------------------------------------------------
const validateVideoCreate = [
    body('titulo')
        .trim()
        .notEmpty().withMessage('Título é obrigatório')
        .isLength({ max: 255 }).withMessage('Título deve ter no máximo 255 caracteres'),
    body('conteudo')
        .trim()
        .notEmpty().withMessage('URL do vídeo é obrigatória'),
    body('descricao')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
    body('corpo')
        .optional()
        .trim(),
    handleValidation,
];

const validateVideoUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID inválido')
        .toInt(),
    body('titulo')
        .optional()
        .trim()
        .notEmpty().withMessage('Título não pode ser vazio')
        .isLength({ max: 255 }).withMessage('Título deve ter no máximo 255 caracteres'),
    body('conteudo')
        .optional()
        .trim(),
    body('descricao')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
    body('corpo')
        .optional()
        .trim(),
    handleValidation,
];

// -------------------------------------------------------------------
//  PROJETO
// -------------------------------------------------------------------
const validateProjetoCreate = [
    body('titulo')
        .trim()
        .notEmpty().withMessage('Título é obrigatório')
        .isLength({ max: 255 }).withMessage('Título deve ter no máximo 255 caracteres'),
    body('descricao')
        .trim()
        .notEmpty().withMessage('Descrição é obrigatória'),
    body('tecnologias')
        .optional()
        .trim(),
    body('githubUrl')
        .optional({ values: 'falsy' })
        .trim()
        .isURL().withMessage('URL do GitHub inválida'),
    body('demoUrl')
        .optional({ values: 'falsy' })
        .trim()
        .isURL().withMessage('URL da demo inválida'),
    handleValidation,
];

const validateProjetoUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID inválido')
        .toInt(),
    body('titulo')
        .optional()
        .trim()
        .notEmpty().withMessage('Título não pode ser vazio')
        .isLength({ max: 255 }).withMessage('Título deve ter no máximo 255 caracteres'),
    body('descricao')
        .optional()
        .trim()
        .notEmpty().withMessage('Descrição não pode ser vazia'),
    body('tecnologias')
        .optional()
        .trim(),
    body('githubUrl')
        .optional({ values: 'falsy' })
        .trim()
        .isURL().withMessage('URL do GitHub inválida'),
    body('demoUrl')
        .optional({ values: 'falsy' })
        .trim()
        .isURL().withMessage('URL da demo inválida'),
    handleValidation,
];

// -------------------------------------------------------------------
//  SOBRE MIM
// -------------------------------------------------------------------
const validateSobreMimUpsert = [
    body('resumo')
        .trim()
        .notEmpty().withMessage('Resumo é obrigatório'),
    body('cargo')
        .trim()
        .notEmpty().withMessage('Cargo é obrigatório')
        .isLength({ max: 255 }).withMessage('Cargo deve ter no máximo 255 caracteres'),
    body('empresa')
        .trim()
        .notEmpty().withMessage('Empresa é obrigatória')
        .isLength({ max: 255 }).withMessage('Empresa deve ter no máximo 255 caracteres'),
    body('formacao')
        .trim()
        .notEmpty().withMessage('Formação é obrigatória')
        .isLength({ max: 255 }).withMessage('Formação deve ter no máximo 255 caracteres'),
    body('universidade')
        .trim()
        .notEmpty().withMessage('Universidade é obrigatória')
        .isLength({ max: 255 }).withMessage('Universidade deve ter no máximo 255 caracteres'),
    body('previsaoFormatura')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: 255 }).withMessage('Previsão de formatura deve ter no máximo 255 caracteres'),
    body('tecnologias')
        .optional()
        .trim(),
    body('experiencias')
        .optional()
        .trim(),
    handleValidation,
];

// -------------------------------------------------------------------
//  LOGIN
// -------------------------------------------------------------------
const validateLogin = [
    body('usuario')
        .trim()
        .notEmpty().withMessage('Usuário é obrigatório'),
    body('senha')
        .notEmpty().withMessage('Senha é obrigatória'),
    handleValidation,
];

module.exports = {
    handleValidation,
    validateId,
    validatePostCreate,
    validatePostUpdate,
    validateVideoCreate,
    validateVideoUpdate,
    validateProjetoCreate,
    validateProjetoUpdate,
    validateSobreMimUpsert,
    validateLogin,
};
