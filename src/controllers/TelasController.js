const TelasPermissoesUserModel = require('../../models/TelasPermissoesUsuarios');
const TelasPermissoesDepartmentModel = require('../../models/TelasPermissoesDepartamentos');
const TelasModel = require('../../models/Telas');

const UserModel = require('../../models/Usuarios');
var msg, msg_type;

//BUSCA DE TELAS
exports.findViews = async (req, res) => {

  try {
    const telas = await TelasModel.findAll();

    return res.json({telas});
    
  } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
  }   
};

//BUSCA AS PERMISSOES DOS USUÁRIOS
exports.findUserPermission = async (req, res) => {

    const {idUser} = req.body

    try {
        const permissoes = await TelasPermissoesUserModel.findAll({
            where: {
              idUser
            },
            include: {
              model: TelasModel,
              attributes: ['viewName'],
              as: 'View'
            },
            attributes: ['idView', 'idUser'],
            raw: true,
            nest: true
          });

        return res.json({permissoes});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    }   
};

//SALVA AS PERMISSOES DOS USUÁRIOS
exports.saveUserPermission = async (req, res) => {

  const {idCreatedUser, telas} = req.body

  const telasComAcessoTrue = telas.filter(tela => tela.acesso === true);
  const idViewsComAcessoTrue = telasComAcessoTrue.map(tela => tela.idView);

  try {

      // primeiro Exclui as linhas correspondentes na tabela TelasPermissoesUserModel se houver
      await TelasPermissoesUserModel.destroy({
        where: {
          idUser: idCreatedUser
        }
      });

      if(idViewsComAcessoTrue.length > 0) {

        // Iterando sobre cada idView com acesso true
        idViewsComAcessoTrue.forEach(idView => {
          inserirRegistroNaTabela(idView, idCreatedUser); // 
        });
        msg = "Acessos criados com sucesso"
        msg_type = "success"
      } else {
        msg = "Não houve acesso para criar"
        msg_type = "success"
      }

      function inserirRegistroNaTabela(idView, idUser) {
        TelasPermissoesUserModel.create({
            idView: idView,
            idUser: idUser
        }).then(() => {
            console.log(`Registro adicionado para idView ${idView}`);
        }).catch(err => {
            console.error(`Erro ao adicionar registro para idView ${idView}: ${err}`);
        });
      }

      return res.json({msg, msg_type}); 
      
  } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
  }   
};


//BUSCA AS PERMISSOES DOS DEPARTAMENTOS
exports.findDepartmentPermission = async (req, res) => {

  const {idDept} = req.body

  try {
      const permissoes = await TelasPermissoesDepartmentModel.findAll({
          where: {
            idDept
          },
          include: {
            model: TelasModel,
            attributes: ['viewName'],
            as: 'View'
          },
          attributes: ['idView', 'idDept'],
          raw: true,
          nest: true
        });

      return res.json({permissoes});
      
  } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
  }   
};

//SALVA PERMISSÕES DOS DEPARTAMENTOS
exports.saveDepartmentPermission = async (req, res) => {

const {idDept, telas} = req.body

const telasComAcessoTrue = telas.filter(tela => tela.acesso === true);
const idViewsComAcessoTrue = telasComAcessoTrue.map(tela => tela.idView);

try {

    // primeiro Exclui as linhas correspondentes na tabela TelasPermissoesUserModel se houver
    await TelasPermissoesDepartmentModel.destroy({
      where: {
        idDept: idDept
      }
    });

    if(idViewsComAcessoTrue.length > 0) {

      // Iterando sobre cada idView com acesso true
      idViewsComAcessoTrue.forEach(idView => {
        inserirRegistroNaTabela(idView, idDept); // 
      });
      msg = "Acessos criados com sucesso"
      msg_type = "success"
    } else {
      msg = "Não houve acesso para criar"
      msg_type = "success"
    }

    function inserirRegistroNaTabela(idView, idUser) {
      TelasPermissoesDepartmentModel.create({
          idView: idView,
          idDept: idDept
      }).then(() => {
          console.log(`Registro adicionado para idView ${idView}`);
      }).catch(err => {
          console.error(`Erro ao adicionar registro para idView ${idView}: ${err}`);
      });
    }

    return res.json({msg, msg_type}); 
    
} catch (error) {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
}   
};