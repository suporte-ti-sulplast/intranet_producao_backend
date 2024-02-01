const { vouchers } = require('../functions/vouchers');
const { sendEmailVoucher } = require('../functions/sendEmail');

// BUSCA VOUCHER COM  X HORAS
exports.getVoucherWifi = async (req, res) => {

  const email = 'leandro.costa@sulplast.com.br';

  const { horas } = req.body;

  vouchers(horas)
  .then(conteudo => {

    if(conteudo.quantidade === 1){
      const res = sendEmailVoucher( horas, email )
      console.log(res)
    }

    return res.json({ conteudo });

  })
  .catch(error => {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  });

};

