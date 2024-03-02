require('dotenv').config();
const fs = require('fs');
const MonitorModel = require('../../models/Monitores')

// BUSCA DADOS DO SENSOR NO ARDUINO
exports.rackSalaTI = async (req, res) => {

    try {
      const filePath = './public/files/sensorRackSalaTI.json'; // Caminho relativo
  
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

// BUSCA INFORMAÇÃO DO MONITOR NA TABELA
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


// SALVA INFORMAÇÃO DO MONITOR NA TABELA
exports.saveMonitorsParameters = async (req, res) => {

    const { idMonitor, user, tempAttention, tempModerate, tempHigh, tempDisaster, emailAttention, emailModerate, emailHigh, emailDisaster} = req.body;

    try {
        //COLOCA OS VALORES QUE VEM DO FRONT EM UMA VARIÁVEL
        const alterMonitor = {
            idMonitor,
            updatedBy: user,
            tempAttention,
            tempModerate,
            tempHigh,
            tempDisaster,
            emailTempAttention: emailAttention ? 'S' : 'N',
            emailTempModerate: emailModerate ? 'S' : 'N',
            emailTempHigh: emailHigh ? 'S' : 'N',
            emailTempDisaster: emailDisaster ? 'S' : 'N',
        };

       //INSERE OS VALORES NO BANCO DE DADOS
        await MonitorModel.update(alterMonitor, {
            where: {
                idMonitor
              }
        });


        //PEGA OS DADOS ATUALIZADOS PARA SALVAR NO ARQUIVO PARA SER USADO PARA MONITORAR SE HOUVE ALTERAÇÃO DE ESTADO
        const dados = await MonitorModel.findOne({
            attributes: ['idMonitor', 'emailReceive', 'equipament', 'location', 'category','tempAttention','tempModerate','tempHigh', 'tempDisaster', 'emailTempAttention','emailTempModerate','emailTempHigh', 'emailTempDisaster'],
            where: {
                idMonitor
            },
            raw: true,
            nest: true,
        });

        const filePath = './public/files/monitorsData.json'; // Caminho relativo
    
        // Lê o conteúdo atual do arquivo (se existir)
        let monitorsData = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            try {
                monitorsData = JSON.parse(fileContent);
            } catch (parseError) {
                console.error('Erro ao analisar o conteúdo do arquivo JSON:', parseError);
                return res.status(500).json({ success: false, message: 'Erro ao analisar o conteúdo do arquivo JSON.' });
            }
        }
        
        // Verifica se o monitorsData é um array
        if (!Array.isArray(monitorsData)) {
            console.error('Conteúdo do arquivo não é um array válido.');
            return res.status(500).json({ success: false, message: 'Conteúdo do arquivo não é um array válido.' });
        }
        
        // Verifica se o idMonitor já existe no array
        const existingIndex = monitorsData.findIndex(item => item.idMonitor === idMonitor);
        
        if (existingIndex !== -1) {
            // Se o idMonitor já existe, sobrescreva os dados
            monitorsData[existingIndex] = {
                idMonitor: dados.idMonitor,
                emailReceive: dados.emailReceive,
                equipament: dados.equipament,
                category: dados.category,
                location: dados.location,
                tempAttention: dados.tempAttention,
                tempModerate: dados.tempModerate,
                tempHigh: dados.tempHigh,
                tempDisaster: dados.tempDisaster,
                emailTempAttention: dados.emailTempAttention,
                emailTempModerate: dados.emailTempModerate,
                emailTempHigh: dados.emailTempHigh,
                emailTempDisaster: dados.emailTempDisaster
            };
        } else {
            // Se o idMonitor não existe, adicione os novos dados ao array
            monitorsData.push({
                idMonitor: dados.idMonitor,
                emailReceive: dados.emailReceive,
                equipament: dados.equipament,
                category: dados.category,
                location: dados.location,
                tempAttention: dados.tempAttention,
                tempModerate: dados.tempModerate,
                tempHigh: dados.tempHigh,
                tempDisaster: dados.tempDisaster,
                emailTempAttention: dados.emailTempAttention,
                emailTempModerate: dados.emailTempModerate,
                emailTempHigh: dados.emailTempHigh,
                emailTempDisaster: dados.emailTempDisaster
            });
        }
        
        // Escreve os dados atualizados de volta no arquivo JSON
        fs.writeFileSync(filePath, JSON.stringify(monitorsData, null, 2), 'utf-8');
        
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
