const NewsModel = require('../../models/Noticias');
const { Op, where } = require('sequelize');
const UsersModel = require('../../models/Usuarios');
const moment = require('moment');
const DepartmentsModel = require('../../models/Departamentos');
const { listarProximosDias }  = require('../functions/manipuladorDatas');
var msg, msg_type;

//CRIAR NOTICIA NA TABELA DE NOTICIAS  ************************************************************************************************************
exports.createNews = async (req, res) => {

    const { textTiulo, data, textTexto, dataInit, dataEnd, link } = req.body;
    console.log(textTiulo, data, textTexto, dataInit, dataEnd, link )

        const novaNoticia  = {
            title: textTiulo.toUpperCase(),
            date: data.toUpperCase(),
            text: textTexto,
            idStatus: 1,
            dateInit: dataInit,
            dateEnd: dataEnd,
            link: link,
        };

        await NewsModel.create(novaNoticia).then(() => {
            console.log("Notícia criada com sucesso");
            msg = "Notícia criada com sucesso"
            msg_type = "success"
        }).catch((err) => {
            console.log("erro", err);
            msg = "Houve um erro interno."
            msg_type = "error"
        }) ;

        // Envie uma resposta de sucesso com a notícia criada
        return res.json({ msg, msg_type }); 

 };

  //RECUPERAR NOTICIA NA TABELA DE NOTICIAS  POR ID************************************************************************************************************
exports.getNews = async (req, res) => {

    const id = req.body.id; // Substitua '2023-09-27' pela data fornecida na requisição

    try {
        const news = await NewsModel.findOne({
            raw: true,
            nest: true,
            attributes: [
                'idNews', 'title', 'text', 'date', 'idStatus', 'link', 'dateInit',  'dateEnd'],
                where: {
                    idNews: id
                  }
        });
  
        return res.json({ news });
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }

 };

 //RECUPERAR NOTICIA NA TABELA DE NOTICIAS  POR DATA ************************************************************************************************************
exports.listNews = async (req, res) => {

    const dataRequisicao = req.body.data; // Substitua '2023-09-27' pela data fornecida na requisição

    if (dataRequisicao === null) {
        try {
            const news = await NewsModel.findAll({
                raw: true,
                nest: true,
            });

            return res.json({ news });
        } catch (error) {
            console.log("Houve um erro interno", error);
            return res.status(500).json({ error: "Internal server error." });
        }
    } else {
        
    }

    try {
        const news = await NewsModel.findAll({
            raw: true,
            nest: true,
            attributes: [
                'idNews', 'title', 'text', 'date', 'idStatus', 'link', 'dateInit',  'dateEnd'],
            where: {
                dateInit: {
                    [Op.lte]: dataRequisicao, // Menor ou igual a data da requisição
                },
                dateEnd: {
                    [Op.gte]: dataRequisicao, // Maior ou igual a data da requisição
                },
                idStatus: 1, // Verificar se o status é igual a 1 (ativo)
            },
        });
  
        return res.json({ news });
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }

 };

//EXCLUSÃO DE NOTICIA
exports.newsDelete = async (req, res) => {

    var id = parseInt(req.body.id)

    // ATUALIZA A TABELA COM O NOVO VALOR
    await NewsModel.destroy({
      where: {
        idNews: id
      }
    }).then(() => {
      msg = "Notícia excluída com sucesso";
      msg_type = "success";
    }).catch((err) => {
      console.log("erro", err);
      msg = "Houve um erro interno.";
      msg_type = "error";
    });
  
    return res.json({ msg, msg_type });
  };


//ALTERAÇÃO DO STATUS DE NOTICIA
exports.newsAlterStatus = async (req, res) => {

    const { idNews, status }  = req.body;
    let newStatus;

    if (status === 1) {
        newStatus = 2;
      } else if (status === 2) {
        newStatus = 1;
      } else {
        // Trate outros casos, se necessário
        newStatus = status;
      }

    //COLOCA O NOVO VALOR NUMA VARIAVEL
    const updateStatus  = {
        idStatus: newStatus
    };

    // ATUALIZA A TABELA COM O NOVO VALOR
    await NewsModel.update(updateStatus, {
    where: {
        idNews: idNews
    }
    }).then(() => {
    console.log("Status da noticia alterado com sucesso");
    msg = "Status da noticia alterado com sucesso";
    msg_type = "success";
    }).catch((err) => {
    console.log("erro", err);
    msg = "Houve um erro interno.";
    msg_type = "error";
    });
    return res.json({ msg, msg_type });
};

//ALTERAÇÃO DO STATUS DE NOTICIA
exports.newsUpdateBD = async (req, res) => {

        const { idNews, textTiulo, data, textTexto, dataInit, dataEnd, link } = req.body.data;
        var msg, msg_type;
        var updateNews;

        //COLOCA O NOVO VALOR NUMA VARIAVEL
        updateNews  = {
            title: textTiulo.toUpperCase(),
            date: data.toUpperCase(),
            text: textTexto,
            dateInit: dataInit,
            dateEnd: dataEnd,
            link: link
        };

        // ATUALIZA A TABELA COM O NOVO VALOR
        await NewsModel.update(updateNews, {
            where: {
                idNews: idNews
            }
            }).then(() => {
            console.log("Noticia alterada com sucesso");
            msg = "Noticia alterada com sucesso";
            msg_type = "success";
            }).catch((err) => {
            console.log("erro", err);
            msg = "Houve um erro interno.";
            msg_type = "error";
        });

    return res.json({ msg, msg_type }); 
};


//RECUPERAR NOTICIA NA TABELA DE NOTICIAS  ************************************************************************************************************
exports.findBirthdayPeople = async (req, res) => {

    const { primeiroDia } = req.body;
    const proximasDatas = listarProximosDias(primeiroDia);

    try {     
        const aniversarios = await UsersModel.findAll({
            attributes: ['idUser', 'nameComplete', 'birthdate'],
            where: {
                Birthdate: proximasDatas, // Verifica se a data de aniversário está entre as próximas datas
            },
            include: [
                { 
                    model: DepartmentsModel,
                    attributes: ['department', 'idDept', 'idlevel'],
                },
            ],
            order: [['Birthdate', 'ASC']],
            raw: true,
            nest: true
        });
    
        return res.json({aniversarios});
        
    } catch (error) {
        console.error(error);
    }
 };