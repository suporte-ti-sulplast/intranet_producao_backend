const Sequelize = require('sequelize');
const DepartmentsModel = require('../../models/Departamentos');
const PrintersDepartmentsModel = require('../../models/ImpressorasDepartamentos');
const PrintersModel = require('../../models/Impressoras');
const UserModel = require('../../models/Usuarios');
const { where } = require('sequelize');
var msg, msg_type;

//LISTA AS IMPRESSORAS
exports.printerList = async (req, res) => {

    try {
        const resultado = await PrintersModel.findAll({
            attributes: ['idPrinter', 'printerName', 'manufacturer', 'model','ip','idStatus','netUsb', 'location'],
            include: [{
                model: UserModel,
                attributes: ['idUser', 'login'],
                as: 'createdByUser'
            },
            {
                model: UserModel,
                attributes: ['idUser', 'login'],
                as: 'updatedByUser'
            }],
            raw: true,
            nest: true,
        }); //BUSCAR O USUÁRIO NA TABELA USER

        return res.json({resultado});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }   
};


//CRIA A IMPRESSORA NO BANCO DE DADOS
exports.printerCreate = async (req, res) => {

    const {nome, fabricante, modelo, ip, netUsb, status, localizacao, grupoDepto, setUser} = req.body.data

    try {
        //COLOCA OS VALORES QUE VEM DO FRONT EM UMA VARIÁVEL
        const novaPrinter = {
            printerName: nome.toUpperCase(),
            manufacturer: fabricante.toUpperCase(),
            model: modelo.toUpperCase(),
            ip: ip,
            netUsb: netUsb,
            idStatus: parseInt(status),
            location: localizacao,
            createdBy: parseInt(setUser),
            updatedBy: parseInt(setUser),
        };

        //INSERE OS VALORES NO BANCO DE DADOS
        await PrintersModel.create(novaPrinter);

        msg = 'Impressora criada com sucesso';
        msg_type = 'success';
    } catch (error) {
        console.error('Erro:', error);
        msg = 'Houve um erro interno.';
        msg_type = 'error';
    };

    try {

        //BUSCA O ID DA NOVA IMPRESSORA PARA USAR NA TABELA DE RELACIONAMENTO COM OS DEPARTAMENTOS
        const printer = await PrintersModel.findOne({
            where: { printerName: nome },
            attributes: ['idPrinter'],
            raw: true,
            nest: true,
        });

        //BUSCAR OS IDS DOS DEPARTAMENTOS NO BANCO DE DADOS
        const resultadoConsulta = await DepartmentsModel.findAll({
            where: { department: grupoDepto },
            attributes: ['idDept'],
            raw: true,
            nest: true,
        });

        //PRECISA VERIFICAR AQUI SE JÁ EXISTE ESSE RELACIONAMENTO

        //COLOCA OS IDS EM UMA VARIVAEL
        const departmentIds = resultadoConsulta.map((dept) => dept.idDept);

        //PARA CADA ID INSERE UM REGISTRO NO BANCO DE DADOS
        for (const idDept of departmentIds) {
            await PrintersDepartmentsModel.create({
                idPrinter: printer.idPrinter,
                idDept,
            });
        };

    } catch (error) {
        console.error('Erro:', error);
        msg = 'Houve um erro interno.';
    };

    return res.json({ msg, msg_type });
};

//LISTA AS IMPRESSORAS
exports.printerSearch = async (req, res) => {

    const idDept = req.body.data
    
    try {
        const impressoras = await PrintersDepartmentsModel.findAll({
            where: { idDept: idDept },
            attributes: [],
            include: [
                {
                    model: PrintersModel, // Correção aqui
                    where: {
                        idPrinter: Sequelize.col('ImpressorasDepartamentos.idPrinter'),
                        idStatus: 1
                    },
                    attributes: ['idPrinter','printerName', 'netUsb', 'ip','model', 'location'], // Especifique as colunas que você deseja recuperar do modelo Printers
                }
            ],
            raw: true,
            nest: true,
        });

        return res.json({impressoras});
    } catch (error) {
        console.error('Erro:', error);
        msg = 'Houve um erro interno.';
    };
};

//EDITA AS IMPRESSORAS
exports.printerEdit = async (req, res) => {

    const idPrinter = req.body.idPrinter
    
    try {
        const printer = await PrintersModel.findOne({
            attributes: ['idPrinter', 'printerName', 'manufacturer', 'model','ip','idStatus','netUsb', 'location'],
            where: {
                idPrinter: idPrinter
            },
            raw: true,
            nest: true,
        });

        const department = await PrintersDepartmentsModel.findAll({
            attributes: ['idDept'],
            where: {
              idPrinter: idPrinter
            },
            include: [
              {
                model: DepartmentsModel,
                attributes: ['department'],
                where: {
                  idDept: Sequelize.col('ImpressorasDepartamentos.idDept')
                },
                required: false // Use required: false se quiser que funcione como um LEFT JOIN
              }
            ],
            raw: true,
            nest: true,
          });

        return res.json({printer, department});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };   
};

//ALTERAÇÃO DO STATUS DA IMPRESSORA
exports.printerAlterStatus = async (req, res) => {

    const { idPrinter, status }  = req.body;
    
    var msg, msg_type;

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
    await PrintersModel.update(updateStatus, {
    where: {
        idPrinter: idPrinter
    }
    }).then(() => {
    console.log("Status da impressora alterado com sucesso");
    msg = "Status da impressora alterado com sucesso";
    msg_type = "success";
    }).catch((err) => {
    console.log("erro", err);
    msg = "Houve um erro interno.";
    msg_type = "error";
    });
    return res.json({ msg, msg_type });
};


//EXCLUSÃO DE IMPRESSORA
exports.printerDelete = async (req, res) => {

    var id = parseInt(req.body.id)
    var msg, msg_type;
  
    //PRIMEIRO APAGA OS RELACIONAMENTOS DA IMPRESSORA COM A TABELA IMPRESSORA-DEPARTAMENTOS
    await PrintersDepartmentsModel.destroy({
        where: {
            idPrinter: id
          }
        }).then(async () => {
            //APAGA A IMPRESSORA CDA TABELA PRINTERS
            await PrintersModel.destroy({
                where: {
                    idPrinter: id
                }
            }).then(() => {
                msg = "Impressora excluída com sucesso";
                msg_type = "success";
            }).catch((err) => {
                console.log("erro", err);
                msg = "Houve um erro interno.";
                msg_type = "error";
            });
        });
  
    return res.json({ msg, msg_type });
};


// VERIFICA SE JÁ EXISTE NOME OU IP
exports.printerNameIP = async (req, res) => {

    const { nomeOld, nome, ipOld, ip, netUsb, netUsbOld, controle } = req.body;

    try {
        let erro; // declara a variável erro

      // BUSCA O NOME DA IMPRESSORA PARA VER SE É DUPLICADO
      var resNome = await PrintersModel.findOne({
        where: { printerName: nome },
        raw: true,
        nest: true,
      });
  
      // BUSCA O IP DA IMPRESSORA PARA VER SE É DUPLICADO
      var resIp = await PrintersModel.findOne({
        where: { ip: ip },
        raw: true,
        nest: true,
      });

      if (controle === 0) { //verifica se vem da tela de nova impressora (0) ou alteração de impressora (1)
        
        // usa essas regras caso seja o cadastro de uma nova impressora

        //se achou duplicadade de nome e ip
        if (resNome && resIp && (resIp.netUsb === 'ip' || netUsb === 'ip')) {
            erro = 3; //Nome e IP duplicado
        } else if (resNome) {
            erro = 1; //Somente nome duplicado
        } else if (resIp && (resIp.netUsb === 'ip' || netUsb === 'ip')) {
            erro = 2; //Somente IP duplicado
        } else {
            erro = 4; // tudo em ordem
        };

      } else {

        // usa essas regras caso seja a alteração de uma impressora já cadastrada

        // se não mudou nome ip e rede ->  permite alteração dos outros parâmetros
        if (nome === nomeOld && ip === ipOld && netUsb === netUsbOld) {
          erro = 4; // tudo em ordem
        } else {

          // se mudou nome, mas não achou duplicidade -> permite alteração dos outros parâmetros
          if (nome !== nomeOld && !resNome && ip !== ipOld && !resIp) {
            erro = 4; // tudo em ordem

          
          } else {
            //se achou duplicadade de nome e ip
            if( (nome !== nomeOld && resNome) && resIp && (resIp.netUsb === 'ip' || netUsb === 'ip') ){
                erro = 3; //Nome e IP duplicado
            } else if( nome !== nomeOld && resNome ){
                erro = 1; //Somente nome duplicado
            } else if(resIp && (resIp.netUsb === 'ip' || netUsb === 'ip') ){
                erro = 2; //Somente IP duplicado
            } else {
                erro = 4; // tudo em ordem
            };
          };
        };
      };

      return res.json({ erro });

    } catch (error) {
      console.error('Erro:', error);
      msg = 'Houve um erro interno.';
    }
  };
  

//SALVA AS ALTERAÇÕES NO BANCO
exports.printerEditSave = async (req, res) => {

    const idPrinter = req.body.data.id
    const { id, nome, fabricante, modelo, local, status, ip, netUsb, setUser } =  req.body.data

    try {
        //COLOCA OS VALORES QUE VEM DO FRONT EM UMA VARIÁVEL
        const novaPrinter = {
            printerName: nome.toUpperCase(),
            manufacturer: fabricante.toUpperCase(),
            model: modelo.toUpperCase(),
            location: local.toUpperCase(),
            ip: ip,
            netUsb: netUsb,
            idStatus: parseInt(status),
            updatedBy: parseInt(setUser),
        };

       //INSERE OS VALORES NO BANCO DE DADOS
        await PrintersModel.update(novaPrinter, {
            where: {
                idPrinter: id
              }
        });

        msg = 'Impressora alterada com sucesso';
        msg_type = 'success';

        } catch (error) {
            console.error('Erro:', error);
            msg = 'Houve um erro interno.';
            msg_type = 'error';
        };

      try {

        await PrintersDepartmentsModel.destroy({
            where: {
                idPrinter: idPrinter
            }
        })

        //BUSCAR OS IDS DOS DEPARTAMENTOS NO BANCO DE DADOS
        const resultadoConsulta = await DepartmentsModel.findAll({
            where: { department: req.body.data.grupoDepto },
            attributes: ['idDept'],
            raw: true,
            nest: true,
        });

        //COLOCA OS IDS EM UMA VARIVAEL
        const departmentIds = resultadoConsulta.map((dept) => dept.idDept);

        //PARA CADA ID INSERE UM REGISTRO NO BANCO DE DADOS
        for (const idDept of departmentIds) {
            await PrintersDepartmentsModel.create({
                idPrinter: idPrinter,
                idDept,
            });
        }; 

    } catch (error) {
        console.error('Erro:', error);
        msg = 'Houve um erro interno.';
    }; 

    return res.json({ msg, msg_type });
};
    