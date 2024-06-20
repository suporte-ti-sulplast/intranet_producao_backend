const SenhasAntigasModel = require('../../models/SenhasAntigas');
const SenhasCategoriasModel = require('../../models/SenhasCategorias');
const SenhasCofresModel = require('../../models/SenhasCofres');
const UserModel = require('../../models/Usuarios');
const crypto = require('crypto');
var msg, msg_type;

// Chave secreta para criptografia (mantenha isso seguro)
const secretKey = process.env.SECRET_KEY;

const decryptIdBadge = (encryptedIdBadge) => {
    if (!encryptedIdBadge) {
      return null; // ou trate conforme necessário para sua aplicação
    }
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decryptedIdBadge = decipher.update(encryptedIdBadge, 'hex', 'utf-8');
    decryptedIdBadge += decipher.final('utf-8');
    return decryptedIdBadge;
  };

  const encryptData = (data) => {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(data, 'utf-8', 'hex') || '';
    encryptedData += cipher.final('hex');
    return encryptedData;
  };

  const SalvaSenhaAntiga = async (dadosAntigos) => {

    await SenhasAntigasModel.create(dadosAntigos)
    .then(() => {
        console.log("Senha antiga salva com sucesso");
    })
    .catch((err) => {
        console.log("erro", err);
    })
  }

//LISTA AS SENHAS
exports.senhasList = async (req, res) => {

    try {
        const respostas = await SenhasCofresModel.findAll({
            include: [{
                model: UserModel,
                attributes: ['login'],
                as: 'createdByUser'
            },
            {
                model: UserModel,
                attributes: ['login'],
                as: 'updatedByUser'
            },
            {
                model: SenhasCategoriasModel,
                attributes: ['category'],
                as: 'category'
            }],
            raw: true,
            nest: true,
        }); //BUSCAR O USUÁRIO NA TABELA USER 

        // Descriptografa o idBadge para cada usuário no resultado da consulta
        const senhas = respostas.map(resposta => {
            // Verifica se o campo idBadge não é nulo
            if (resposta.password !== null && resposta.password !== undefined && resposta.password !== "") {
            try {
                // Descriptografa o idBadge
                resposta.password = decryptIdBadge(resposta.password);
            } catch (error) {
                console.error('Erro ao descriptografar password:', error);
                console.log(resposta.password)
                // Tratar o erro conforme necessário (por exemplo, atribuir um valor padrão)
            }
        }

        return resposta;
        });

        return res.json({senhas});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }   
};

//BUSCA DE CATEGORIAS
exports.senhaFind = async (req, res) => {

    const {senha} = req.body

    try {
        const dados = await SenhasCofresModel.findOne({
            where: {
                idPassword: senha
            },
            include: [{
                model: UserModel,
                attributes: ['login'],
                as: 'createdByUser'
            },
            {
                model: UserModel,
                attributes: ['login'],
                as: 'updatedByUser'
            },
            {
                model: SenhasCategoriasModel,
                attributes: ['category'],
                as: 'category'
            }],
            raw: true,
            nest: true,
        }); //BUSCAR O USUÁRIO NA TABELA USER 

        // Verifica se o campo idBadge não é nulo
        if (dados.password !== null && dados.password !== undefined) {
            try {
                // Descriptografa o idBadge
                dados.password = decryptIdBadge(dados.password);
            } catch (error) {
                console.error('Erro ao descriptografar password:', error);
                // Tratar o erro conforme necessário (por exemplo, atribuir um valor padrão)
            }
        }
        return res.json({dados});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }   
};

//EDITA OU CRIA SENHAS
exports.senhaEditAdd = async (req, res) => {

    var {nome, login, descricao, password, category, email1, email2, createdBy, idPassword} = req.body.dados
    var senhaCrypto = (password !== null && password !== undefined && password !== '') ? encryptData(password) : '';

    try {   
        const res = await SenhasCofresModel.findOne({
                where: {
                    idPassword: idPassword
                },
                attributes: ['password']
            }
        );

        const senhaAtual = (decryptIdBadge(res.password))
        if (senhaAtual !== password) {

            const dados = {
                idPassword,
                password: senhaAtual,
                idUser: createdBy
            }

            SalvaSenhaAntiga(dados);
        }
    } catch (error) {
        console.log("erro", error);
    }


    if(idPassword === 0 ) {

        const novoValor = {
            name: nome,
            userName: login,
            password: senhaCrypto,
            descriptionPass: descricao,
            idPasswordCategory: category,
            email_1: email1,
            email_2: email2,
            createdBy: createdBy,
            updatedBy: createdBy
        }

        // ATUALIZA A TABELA COM O NOVO VALOR
        await SenhasCofresModel.create(novoValor)
        .then(() => {
            console.log("Senha adicionada com sucesso");
            msg = "Senha adicionada com sucesso";
            msg_type = "success";
            return res.json({ msg, msg_type });
        })
        .catch((err) => {
            console.log("erro", err);
            msg = "Houve um erro interno.";
            msg_type = "error";
            return res.json({ msg, msg_type });
        }
        );
        
    } else {

        const novoValor = {
            name: nome,
            userName: login,
            password: senhaCrypto,
            descriptionPass: descricao,
            idPasswordCategory: category,
            email_1: email1,
            email_2: email2,
            updatedBy: createdBy
        }

        await SenhasCofresModel.update(novoValor, {
                where: {
                    idPassword: idPassword
                }
            }).then(async () => {
            console.log("Senha alterada com sucesso");
            msg = "Senha alterado com sucesso";
            msg_type = "success";
            return res.json({ msg, msg_type });
            }).catch((err) => {
            console.log("erro", err);
            msg = "Houve um erro interno.";
            msg_type = "error";
            return res.json({ msg, msg_type });
            });

    };
};

//EXCLUSÃO DE SENHAS
exports.senhaDelete = async (req, res) => {

    var id = parseInt(req.body.id)
  
    await SenhasCofresModel.destroy({
        where: {
            idPassword: id
        }
    }).then(() => {
        msg = "Senha excluída com sucesso";
        msg_type = "success";
    }).catch((err) => {
        console.log("erro", err);
        msg = "Houve um erro interno.";
        msg_type = "error";
    });
  
    return res.json({ msg, msg_type });
};


//LISTA AS CATEGORIAS
exports.senhaCategory = async (req, res) => {

    try {
        const categorias = await SenhasCategoriasModel.findAll();

        return res.json({categorias});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }   
};


//EXCLUSÃO DE CATEGORIAS
exports.senhaCategoriaDelete = async (req, res) => {

    var id = parseInt(req.body.id)

    const isUsing = await SenhasCofresModel.findOne({
        where: {
            idPasswordCategory: id
        }
    });

    if(isUsing) {
        msg = "Categoria sendo usada. Impossível excluir.";
        msg_type = "show";
        return res.json({ msg, msg_type });
    } else {
        await SenhasCategoriasModel.destroy({
            where: {
                idPasswordCategory: id
            }
        }).then(() => {
            msg = "Categoria excluída com sucesso";
            msg_type = "show";
            return res.json({ msg, msg_type });
        }).catch((err) => {
            console.log("erro", err);
            msg = "Houve um erro interno.";
            msg_type = "error";
            return res.json({ msg, msg_type });
        });
    }
};


//BUSCA DE CATEGORIAS
exports.senhaCategoriaFind = async (req, res) => {

    var categoria = req.body.novaCategoria

    const isUsing = await SenhasCategoriasModel.findOne({
        where: {
            category: categoria
        }
    });

    if(isUsing) {
        msg = "Categoria já existe.";
        msg_type = "existe";
        return res.json({ msg, msg_type });
    } else {
        msg_type = "hidden";
        return res.json({ msg, msg_type });
    }
};

//EDITA OU CRIA CATEGORIAS
exports.senhaCategoriaEditAdd = async (req, res) => {

    var {id, categoria} = req.body

    const novoValor = {
        category: categoria,
        idStatus: 1
    }

    if(id === undefined || id === '' || id === null) {
            // ATUALIZA A TABELA COM O NOVO VALOR
            await SenhasCategoriasModel.create(novoValor)
                .then(() => {
                    console.log("Categoria criada com sucesso");
                    msg = "Categoria criada com sucesso";
                    msg_type = "show";
                    return res.json({ msg, msg_type });
                })
                .catch((err) => {
                    console.log("erro", err);
                    msg = "Houve um erro interno.";
                    msg_type = "error";
                    return res.json({ msg, msg_type });
                });


    } else {
    // ATUALIZA A TABELA COM O NOVO VALOR
        await SenhasCategoriasModel.update(novoValor, {
            where: {
                idPasswordCategory: id
            }
            }).then(() => {
            console.log("Categoria alterada com sucesso");
            msg = "Categoria alterado com sucesso";
            msg_type = "show";
            }).catch((err) => {
            console.log("erro", err);
            msg = "Houve um erro interno.";
            msg_type = "error";
            });
            return res.json({ msg, msg_type });
    }
};


