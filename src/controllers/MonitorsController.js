require('dotenv').config();
const fs = require('fs');
const MonitorModel = require('../../models/Monitors')


// BUSCA DADOS DO SENSOR NO ARDUINO
exports.rackSalaTI = async (req, res) => {

    try {
      const filePath = './public/sensorRackSalaTI.json'; // Caminho relativo
  
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const sensorData = JSON.parse(fileContent);

        return res.status(200).json(sensorData);
      } else {
        console.log("Não achou o file");
        return res.status(404).json({ error: 'Arquivo não encontrado.' });
      }
    } catch (error) {
      console.log('Houve um erro interno', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
};

// BUSCA INFORMAÇÃO DO SENSOR NA TABELA
exports.getParameters = async (req, res) => {

    const idMonitor = req.body.idMonitor
   
    try {
        const monitor = await MonitorModel.findOne({
            attributes: ['emailReceive', 'equipament', 'location', 'category','tempAttention','tempModerate','tempHigh', 'tempDisaster', 'emailTempAttention','emailTempModerate','emailTempHigh', 'emailTempDisaster'],
            where: {
                idMonitor
            },
            raw: true,
            nest: true,
        });

        return res.json({monitor});
        
    } catch (error) {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };   
};


// SALVA INFORMAÇÃO DO SENSOR NA TABELA
exports.saveMonitorsParameters = async (req, res) => {

    const { idMonitor, user, tempAttention, tempModerate, tempHigh, tempDisaster, emailAttention, emailModerate, emailHigh, emailDisaster} = req.body;

    console.log('CHEGOU AQUI:', idMonitor, user, tempAttention, tempModerate, tempHigh, tempDisaster, emailAttention, emailModerate, emailHigh, emailDisaster)


    try {
        //COLOCA OS VALORES QUE VEM DO FRONT EM UMA VARIÁVEL
        const alterMonitor = {
            idMonitor,
            updatedBy: user,
            tempAttention,
            tempModerate,
            tempHigh,
            tempDisaster,
            emailTempAttention: emailAttention ? 'sim' : 'nao',
            emailTempModerate: emailModerate ? 'sim' : 'nao',
            emailTempHigh: emailHigh ? 'sim' : 'nao',
            emailTempDisaster: emailDisaster ? 'sim' : 'nao',
        };

       //INSERE OS VALORES NO BANCO DE DADOS
        await MonitorModel.update(alterMonitor, {
            where: {
                idMonitor
              }
        });

        msg = 'Dados alterados com sucesso';
        msg_type = 'success';
        return res.json({ msg, msg_type });

        } catch (error) {
            console.error('Erro:', error);
            msg = 'Houve um erro interno.';
            msg_type = 'error';
            return res.json({ msg, msg_type });
        };


};
