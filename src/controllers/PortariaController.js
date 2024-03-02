const Sequelize = require('sequelize');
const VeiculosModel = require('../../models/Veiculos');
const ControleVeiculosModel = require('../../models/VeiculosMovimentos');
const { converterHora } = require('../functions/manipuladorHoras');
const { converterParaInteiro } = require('../functions/manipuladorNumeros');
var  msg, msg_type
const { where } = require('sequelize');


//LISTA DE VEICULOS ************************************************************************************************************
exports.listaVeiculos = async (req, res) => {

   try {
   const veiculos = await VeiculosModel.findAll({
      attributes: ['vehicle_id', 'vehicle_name', 'image', 
        [Sequelize.literal('(SELECT inOuut FROM VeiculosMovimentos WHERE VeiculosMovimentos.vehicle_id = Veiculos.vehicle_id ORDER BY id DESC LIMIT 1)'), 'inOuut']
      ],
      where: { idStatus: 1 },
      raw: true,
      nest: true,
    });

         return res.json({veiculos});
         
      } catch (error) {
         console.log("Houve um erro interno", error);
         return res.status(500).json({ error: "Internal server error." });
      }   
   
};

//LISTA DE MOVIMENTOS DO VEICULOS PASSADO NO PARÂMETRO ************************************************************************************************************
exports.movimentoVeiculos = async (req, res) => {

   const veiculo = parseInt(req.body.veiculoId);
   try {
      const movimento = await ControleVeiculosModel.findAll({
         where: { vehicle_id: veiculo }, 
         raw: true,
         nest: true,
         order: [['id', 'DESC']]
     });

      return res.json({movimento});
      
   } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
   }   

};

//SALVA-ATUALIZA MOVIMENTOS DO VEICULOS PASSADO NO PARÂMETRO ************************************************************************************************************
exports.salvaMovimentoVeiculos = async (req, res) => {

   const {
            destiny,
            depDriver,
            depData,
            depTime,
            depKm,
            depLiberator,
            depObservation,
            arrDriver,
            arrData,
            arrTime,
            arrKm,
            arrLiberator,
            arrObservation,
            veiculoId,
            moveOpen,
            id
         } = req.body.data;

   if (!moveOpen) {

      const data = {
         vehicle_id: parseInt(veiculoId),
         destiny: destiny.toUpperCase(),
         departure_driver: depDriver.toUpperCase(),
         departure_date: depData,
         departure_time: converterHora(depTime),
         departure_km: converterParaInteiro(depKm),
         departure_liberator: depLiberator.toUpperCase(),
         departure_observation: depObservation ? depObservation.toUpperCase() : null,
         inOuut: 'OUT'
      }

      try {
         await ControleVeiculosModel.create(data);
         
         msg = "Movimento lançado com sucesso";
         msg_type = "success";
       } catch (err) {
         console.log("erro", err);
         msg = "Houve um erro interno.";
         msg_type = "error";
       }   

   } else {

      const data = {
         arrival_driver: arrDriver.toUpperCase(),
         arrival_date: arrData,
         arrival_time: converterHora(arrTime),
         arrival_km: converterParaInteiro(arrKm),
         arrival_liberator: arrLiberator.toUpperCase(),
         arrival_observation: arrObservation ? arrObservation.toUpperCase() : null,
         inOuut: 'IN'
      }
         try {
            await ControleVeiculosModel.update(data, {
              where: { vehicle_id: veiculoId,
                       id: id},
            });
            
            msg = "Movimento lançado com sucesso";
            msg_type = "success";
          } catch (err) {
            console.log("erro", err);
            msg = "Houve um erro interno.";
            msg_type = "error";
          }   
   }

   return res.json({ msg, msg_type });
};