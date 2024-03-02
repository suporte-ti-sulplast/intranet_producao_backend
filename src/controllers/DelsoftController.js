const dbDelsoft = require('../conections/dbDelsoft');

//DIMENSIONA CARGA ************************************************************************************************************
exports.vendasPeriodoCliente = async (req, res) => {

    const { dataInit, dataFim, cliente1, cliente2 } = req.body;

    console.log('CHEGOU NO CONTROLLER')

    try {

        const resultado = await dbDelsoft.query(
            'SELECT * FROM dbo.VENDAS_ObterDadosPedidos(:dataInit,:dataFim,:cliente1,:cliente2);',
            {
              replacements: { 
                dataInit: dataInit, 
                dataFim: dataFim, 
                cliente1: cliente1, 
                cliente2: cliente2
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