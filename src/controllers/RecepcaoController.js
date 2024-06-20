const { vouchers } = require('../functions/vouchers');
const { sendEmailVoucher } = require('../functions/sendEmail');
const VouchersModels = require('../../models/Vouchers');
const RamaisModels = require('../../models/Ramais');
const DepartamentosModels = require('../../models/Departamentos');

// BUSCA VOUCHER COM  X HORAS
exports.getVoucherWifi = async (req, res) => {

  const email = 'suporte.ti@sulplast.com.br';

  const { horas } = req.body;

  vouchers(horas)
  .then(conteudo => {

    if(conteudo.quantidade === 1){
      const res = sendEmailVoucher( horas, email )
    }
    return res.json({ conteudo });

  })
  .catch(error => {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  });

};

// SALVA VOUCHERS USADOS
exports.saveUsedVoucher = async (req, res) => {

  const { time, voucherUsed, justification, user } = req.body

  var msg, msg_type;

  //COLOCA O NOVO VALOR NUMA VARIAVEL
  const voucherSave  = {
    voucher: voucherUsed,
    time: time,
    justification: justification,
    updatedBy: user
  };

  //ATUALIZA A TABELA COM O NOVO VALOR
  await VouchersModels.create(voucherSave).then(() => {

      console.log("Voucher criado com sucesso");
      
      msg = "Voucher criado com sucesso"
      msg_type = "success"

      return res.json({ msg, msg_type });

  }).catch((err) => {
      console.log("erro", err);
      msg = "Houve um erro interno."
      msg_type = "error"

      return res.json({ msg, msg_type });
  }) ;

};

// BUSCA RAMAL
exports.findRamal = async (req, res) => {

  const { ramal } = req.body

  try {
    const ramalResp = await RamaisModels.findOne({
      attributes: ['nameUsers', 'idDept' , 'externalSuffix'],
      where: {extensionsNumber: parseInt(ramal) },
      include: [{
          model: DepartamentosModels,
          attributes: [ 'department'],
          as: 'department',
      }],
      raw: true,
      nest: true,
  });

  return res.json({ ramalResp });

  } catch (error) {
  console.log("Houve um erro interno", error);
  return res.status(500).json({ error: "Internal server error." });
  };
};

// EDITA RAMAIS
exports.createEditRamal = async (req, res) => {

  const { ramal, nome, ext, idDepto, idUser, control } = req.body

  var msg, msg_type;
  
  if(control === 1) {

      //COLOCA O NOVO VALOR NUMA VARIAVEL
      const dataUpdate  = {
        nameUsers: nome,
        idDept: idDepto,
        externalSuffix: ext,
        updatedBy: idUser
        }

        await RamaisModels.update(dataUpdate, {
          where: {
            extensionsNumber: ramal
          }
        }).then(() => {
          console.log("Ramal atualizado com sucesso");
          msg = "Ramal atualizado com sucesso"
          msg_type = "success"

          return res.json({ msg, msg_type });

      }).catch((err) => {
          console.log("erro", err);
          msg = "Houve um erro interno."
          msg_type = "error"

          return res.json({ msg, msg_type });
      });

  } else {
    //COLOCA O NOVO VALOR NUMA VARIAVEL
    const dataSave  = {
      nameUsers: nome,
      idDept: idDepto,
      extensionsNumber: ramal, 
      externalSuffix: ext,
      createdBy: idUser,
      updatedBy: idUser
      }

      await RamaisModels.create(dataSave).then(() => {
        console.log("Ramal criado com sucesso");
        msg = "Ramal criado com sucesso"
        msg_type = "success"

        return res.json({ msg, msg_type });

    }).catch((err) => {
        console.log("erro", err);
        msg = "Houve um erro interno."
        msg_type = "error"

        return res.json({ msg, msg_type });
    });

  }

};

//EXCLUSÃO DE IMPRESSORA
exports.deleteRamal = async (req, res) => {

  var ramal = parseInt(req.body.ramal)
  var msg, msg_type;

  //PRIMEIRO APAGA OS RELACIONAMENTOS DA IMPRESSORA COM A TABELA IMPRESSORA-DEPARTAMENTOS
  await RamaisModels.destroy({
      where: {
        extensionsNumber: ramal
        }
      }).then(() => {
          console.log('Ramal excluído com sucesso');
          msg = "Ramal excluído com sucesso";
          msg_type = "success";
      }).catch((err) => {
          console.log("erro", err);
          msg = "Houve um erro interno.";
          msg_type = "error";
      });

  return res.json({ msg, msg_type });
};


