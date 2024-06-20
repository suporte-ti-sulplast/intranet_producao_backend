const SenhasAntigasModel = require('../../models/SenhasAntigas');
const SenhasCategoriasModel = require('../../models/SenhasCategorias');
const SenhasCofresModel = require('../../models/SenhasCofres');
const UserModel = require('../../models/Usuarios');
const crypto = require('crypto');
const puppeteer = require('puppeteer');
const { sendSenhasPDF } = require('../functions/sendEmail');
const { where } = require('sequelize');
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

    const {idUser} =  req.body;

    //busca o nivel do user na tabela usuários
    const userLvl = await UserModel.findOne({
        where: [{
            idUser: idUser
        }],
        attributes: ['level'],
    })

    let where = {};

    //de acordo com o nivel determina quais senhas vai trazer na lista
    if (userLvl.level === 1) {
        where = { level: 1 };
    } else if (userLvl.level === 2) {
        where = { level: [1, 2] };
    } else if (userLvl.level === 3){
        where = { level: [1, 2, 3] };
    }

    try {
        const respostas = await SenhasCofresModel.findAll({
            where: where,
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

    var {nome, login, descricao, password, mfa, category, level, email1, email2, createdBy, idPassword, link} = req.body.dados
    var senhaCrypto = (password !== null && password !== undefined && password !== '') ? encryptData(password) : '';

    console.log(level)

    if(idPassword === 0 ) {

        const novoValor = {
            name: nome,
            userName: login,
            password: senhaCrypto,
            mfa: mfa,
            descriptionPass: descricao,
            idPasswordCategory: category,
            level: level,
            email_1: email1,
            email_2: email2,
            link: link,
            createdBy: createdBy,
            updatedBy: createdBy
        };

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
            mfa: mfa,
            descriptionPass: descricao,
            idPasswordCategory: category,
            level: level,
            email_1: email1,
            email_2: email2,
            link: link,
            updatedBy: createdBy
        };

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



const generatePDF = async (tableData) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'] // Adicione a flag --no-sandbox
    });

    const page = await browser.newPage();
  
    // Construa a tabela HTML com os dados fornecidos
    const tableHtml = `
        <style>
            /* Estilos CSS para a tabela */
            table {
                width: calc(100% - 20px); /* Width da tabela menos a margem de 10px em cada lado */
                margin: 0 auto; /* Centralizar a tabela */
                font-size: 12px;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 2px 6px;
                text-align: left;
            }
            /* Estilos CSS para o título e o rodapé */
            .titulo {
                text-align: center;
                font-size: 20px;
                margin-top: 20px;
            }
            .rodape {
                position: absolute;
                bottom: 20px;
                left: 20px;
                font-size: 10px;
            }
        </style>
        <div class="titulo">LISTA DE SENHAS DO COFRE TI</div>

      <table style="width: 100%; margin: 0px; font-size: 10px; border-collapse: collapse;">
        <thead>
          <tr>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Nome</th>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Login</th>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Senha</th>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Descrição</th>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Categoria</th>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Email 1</th>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Email 2</th>
            <th border: 1px solid #ddd; padding: 2px 6px; text-align: left;">Link</th>
          </tr>
        </thead>
        <tbody>
          ${tableData.map(row => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.name}</td>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.userName}</td>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.password}</td>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.descriptionPass}</td>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.category.category}</td>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.email_1 || ''}</td>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.email_2 || ''}</td>
              <td style="border: 1px solid #ddd; padding: 2px 6px; text-align: left;">${row.link || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="rodape">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</div>
    `;
  
    // Configure o conteúdo da página com a tabela HTML
    await page.setContent(tableHtml);
  
    // Gere o PDF e retorne o buffer
    const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });
    await browser.close();

    return pdfBuffer;
  };

// Rota para o envio do PDF por email
exports.senhaEnviarPDFEmail = async (req, res) => {
    try {
        const { passwordsFiltrados, idUser } = req.body; // Obtenha os dados do corpo da requisição

        const user = await UserModel.findOne({
            attributes: ['nameComplete', 'email'],
            where: {
                idUser: idUser
            }
        });

        generatePDF(passwordsFiltrados)
        .then(pdfBuffer => {
            const envioEmail = sendSenhasPDF(user, pdfBuffer);
            console.log(envioEmail);
        })
        .catch(error => {
            console.error('Ocorreu um erro ao gerar o PDF:', error);
            res.status(500).send('Erro ao gerar o PDF');
        });

    } catch (error) {
        console.error('Ocorreu um erro ao buscar o usuário:', error);
        res.status(500).send('Erro ao buscar o usuário');
    }
};

