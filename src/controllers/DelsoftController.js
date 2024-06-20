const dbDelsoft = require('../conections/dbDelsoft');

//DIMENSIONA CARGA ************************************************************************************************************
exports.vendasPeriodoCliente = async (req, res) => {

  const { dataInit, dataFim, cliente1, cliente2, cliente3 } = req.body;

    try {

      const resultado = await dbDelsoft.query(
        'SELECT * FROM dbo.VENDAS_ObterDadosPedidos(:dataInit,:dataFim,:cliente1,:cliente2,:cliente3);',
        {
          replacements: { 
            dataInit: dataInit, 
            dataFim: dataFim, 
            cliente1: cliente1, 
            cliente2: cliente2,
            cliente3: cliente3
          },
          type: dbDelsoft.QueryTypes.SELECT,
        }
    );

        return res.json({ resultado });
        
          
       } catch (error) {
          console.log("Houve um erro interno", error);
          return res.status(500).json({ error: "Internal server error." });
       }   
    
 };


 //BUSCA CLIENTES ************************************************************************************************************
exports.listaClientes = async (req, res) => {

    try {

        const resultado = await dbDelsoft.query(
            'SELECT * FROM dbo.CLIENTES_ObterClientes();',
            {
              type: dbDelsoft.QueryTypes.SELECT,
            }
        );

        return res.json({ resultado });
        
          
       } catch (error) {
          console.log("Houve um erro interno", error);
          return res.status(500).json({ error: "Internal server error." });
       }   
    
 };