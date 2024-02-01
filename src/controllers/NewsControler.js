const NewsModel = require('../../models/News');
const { Op, where } = require('sequelize');
const UsersModel = require('../../models/Users');
const moment = require('moment');
const DepartmentsModel = require('../../models/Departments');
const { listarProximosDias }  = require('../functions/manipuladorDatas');
var msg, msg_type;

//CRIAR NOTICIA NA TABELA DE NOTICIAS  ************************************************************************************************************
exports.createNews = async (req, res) => {

    const { textTiulo, data, textTexto, fileName, newFileName, status, dataInit, dataEnd, link } = req.body;

        const novaNoticia  = {
            title: textTiulo.toUpperCase(),
            date: data.toUpperCase(),
            text: textTexto,
            image: newFileName,
            imageName: fileName,
            status: status,
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

 //RECUPERAR NOTICIA NA TABELA DE NOTICIAS  ************************************************************************************************************
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
                'idNews', 'title', 'text', 'date', 'status', 'link', 'dateInit',  'dateEnd', 'image',  'imageName'],
            where: {
                dateInit: {
                    [Op.lte]: dataRequisicao, // Menor ou igual a data da requisição
                },
                dateEnd: {
                    [Op.gte]: dataRequisicao, // Maior ou igual a data da requisição
                },
                status: 1, // Verificar se o status é igual a 1 (ativo)
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
    const newStatus = !status;

    //COLOCA O NOVO VALOR NUMA VARIAVEL
    const updateStatus  = {
        status: newStatus
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

        const { idNews, textTiulo, data, textTexto, status, dataInit, dataEnd, link, imageName } = req.body.data;
        const image = req.body.newFileName;
        var msg, msg_type;
        var updateNews;

        if(req.body.newFileName === 'naoTem'){ //caso NÃO TENHA sido alterada a imagem

            //COLOCA O NOVO VALOR NUMA VARIAVEL
            updateNews  = {
                title: textTiulo.toUpperCase(),
                date: data.toUpperCase(),
                text: textTexto,
                status: status,
                dateInit: dataInit,
                dateEnd: dataEnd,
                link: link
            };

        } else { //caso TENHA sido alterada a imagem

            //COLOCA O NOVO VALOR NUMA VARIAVEL
            updateNews  = {
                title: textTiulo.toUpperCase(),
                date: data.toUpperCase(),
                text: textTexto,
                status: status,
                imageName: imageName,
                image: image,
                dateInit: dataInit,
                dateEnd: dataEnd,
                link: link
            };
        }

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