const DepartmentsModel = require('../../models/Departamentos');
const UserModel = require('../../models/Usuarios');
const PrinterDeptModel = require('../../models/ImpressorasDepartamentos');
var msg, msg_type;

 //LISTA OS DEPARTAMENTOS
exports.departmentsList = async (req, res) => {

    try {
        const resultado = await DepartmentsModel.findAll({
            attributes: ['idDept', 'department', 'supervisor1','supervisor2','inactivityTime'],
            include: [
                {
                    model: UserModel,
                    attributes: ['idUser', 'nameComplete'],
                    as: 'super1'
                },
                {
                    model: UserModel,
                    attributes: ['idUser', 'nameComplete'],
                    as: 'super2'
                }
            ],
              
            raw: true,
            nest: true,
        });

        return res.json({resultado});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }   
};

//CHECA SE EXISTE DEPARTAMENTO
exports.departmentsFind = async (req, res) => {

    var department = req.body.department
  
    const isUsing = await DepartmentsModel.findOne({
        where: {
          department
        }
    });
  
    if(isUsing) {
        msg = "Departamento já existe.";
        msg_type = "existe";
        return res.json({ msg, msg_type });
    } else {
        msg = "";
        msg_type = "hidden";
        return res.json({ msg, msg_type });
    }
};

//CRIA DEPARTAMENTO
exports.departmentsCreate = async (req, res) => {

    var {department, supervisor1, supervisor2, inactivityTime} = req.body.dados;
    console.log(department, supervisor1, supervisor2, inactivityTime)
  
    const novoValor = {
        department,
        supervisor1,
        supervisor2,
        inactivityTime: parseInt(inactivityTime)
    }

    console.log(novoValor)
  
    // ATUALIZA A TABELA COM O NOVO VALOR
    await DepartmentsModel.create(novoValor)
    .then(() => {
        console.log("Departamento criado com sucesso");
        msg = "Departamento criado com sucesso";
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
};

//EDITA DEPARTAMENTO
exports.departmentsEdit = async (req, res) => {

    var {department, supervisor1, supervisor2, idDept, inactivityTime} = req.body.dados;
    console.log(department, supervisor1, supervisor2, inactivityTime)

    //primeiro verifica se o nome não está em uso por outro grupo
    const isUsing = await DepartmentsModel.findOne({
      where: {
        department
      }
    });
  
    if(isUsing) {
      if(isUsing.idDept !== idDept ) {
          msg = "Grupo já existe.";
          msg_type = "existe";
          return res.json({ msg, msg_type });
      } 
    }
      const novoValor = {
        department,
        supervisor1,
        supervisor2,
        inactivityTime: parseInt(inactivityTime)
      }

      console.log(novoValor)
  
      // ATUALIZA A TABELA COM O NOVO VALOR
      await DepartmentsModel.update(novoValor, {
        where: {
            idDept
        }
      })
      .then(() => {
          msg = "Departamento alterado com sucesso";
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
  };


//EXCLUSÃO DE DEPARTAMENTO
exports.departmentsDelete = async (req, res) => {

    var idDept = parseInt(req.body.idDept)
  
    const isUsing = await UserModel.findOne({
        where: {
            idDept
        }
    });

    const isUsing2 = await PrinterDeptModel.findOne({
        where: {
            idDept
        }
    });
    

    if(isUsing || isUsing2) {

        if(isUsing) {
            msg = "Existem usuários alocados nesse departamento.";
            msg_type = "existe";
            return res.json({ msg, msg_type });
        }

        if(isUsing2) {
            msg = "Existem impressoras alocadas nesse departamento.";
            msg_type = "existe";
            return res.json({ msg, msg_type });
        }

    } else {

        await DepartmentsModel.destroy({
            where: {
                idDept
            }

        }).then(() => {
            msg = "Departamento excluído com sucesso";
            msg_type = "success";
        }).catch((err) => {
            console.log("erro", err);
            msg = "Houve um erro interno.";
            msg_type = "error";
        });
    }
    return res.json({ msg, msg_type });
  };



    