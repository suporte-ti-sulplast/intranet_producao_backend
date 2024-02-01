const dbDelsoft = require('../../models/dbDelsoft');


//PESQUISA NO DELSOFT TESTE ************************************************************************************************************
exports.consultaFechamentoEstoque = async (req, res) => {

 const dataParametro = req.body.data; // Defina a data desejada aqui

   const resultadoConsulta = await dbDelsoft.query(
     'SELECT * FROM REL_Fechamento_Estoque_Mensal(:data)',
     {
       replacements: { data: dataParametro }, // Substitua pela sua data desejada
       type: dbDelsoft.QueryTypes.SELECT,
     }
   );
   
   return res.json({ resultadoConsulta });
};