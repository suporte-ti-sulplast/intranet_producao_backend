const path = require('path');
const fs = require('fs'); // Importe o módulo fs
const ItsDepartmentsViewersModel = require('../../models/ItsDepartmentsViewers');
const ItsDepartmentsOwnersModel = require('../../models/ItsDepartmentsOwners');
const ItModel = require('../../models/Its');
const ListaRamaisModel = require('../../models/TelephoneExtensions');
const DepartmentsModel = require('../../models/Departments');

//LISTA DE ARQUIVOS LGPD ************************************************************************************************************
exports.listarArquivosLGPD = async (req, res) => {

    // Função para listar arquivos em um diretório
    const listarArquivosLGPD = (caminhoDiretorio) => {
        try {
            const arquivos = fs.readdirSync(caminhoDiretorio);
            const arquivosPDF = arquivos.filter((arquivo) => arquivo.toLowerCase().endsWith('.pdf'));
            return arquivosPDF;
        } catch (error) {
            console.error('Erro ao listar arquivos:', error);
            return [];
        }
    };

    const caminhoDiretorio = path.join(__dirname, '../../public/file/lgpd')
    const ArquivosPDF = listarArquivosLGPD(caminhoDiretorio);
    // Envia a lista de arquivos em formato JSON para o cliente
    res.json({ arquivos: ArquivosPDF });
};


//LISTA DE ARQUIVOS LGPD ************************************************************************************************************
exports.listarArquivosITs = async (req, res) => {

    const { idDept } = req.body;

    try {
        const itsViewer = await ItsDepartmentsViewersModel.findAll({
            attributes: ['idIt'],
            where: {idDept},
            include: [{
                model: ItModel,
                attributes: ['itName'],

            }],
            raw: true,
            nest: true,
          });

        const itsOwner = await ItsDepartmentsOwnersModel.findAll({
        where: { idDept },
        attributes: ['idIt'],
        include: [{
            model: ItModel,
            attributes: ['itName'],

        }],
        raw: true,
        nest: true,
        });

        const its = [itsOwner, itsViewer].flat();

        return res.json({ its });
        
    } catch (error) {
        console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
    };
};

//LISTA DE ARQUIVOS DICAS ************************************************************************************************************
exports.listarArquivosComunicações = async (req, res) => {

    // Função para listar arquivos em um diretório
    const listarArquivosComunicações = (caminhoDiretorio) => {
        try {
            const arquivos = fs.readdirSync(caminhoDiretorio);
            const arquivosFiltrados = arquivos.filter((arquivo) => {
                const extensao = arquivo.toLowerCase().split('.').pop();
                return extensao === 'jpeg' || extensao === 'jpg' || extensao === 'png';
            })
    
            // Obtém informações sobre cada arquivo (data de modificação)
            const arquivosComInfo = arquivosFiltrados.map((arquivo) => {
                const caminhoCompleto = `${caminhoDiretorio}/${arquivo}`;
                const stat = fs.statSync(caminhoCompleto);
                return { nome: arquivo, dataModificacao: stat.mtime };
            });
    
            // Ordena os arquivos com base na data de modificação (mais recente primeiro)
            const nomesArquivosOrdenados = arquivosComInfo
                .sort((a, b) => b.dataModificacao.getTime() - a.dataModificacao.getTime())
                .map((arquivo) => arquivo.nome);
    
            return nomesArquivosOrdenados;
        } catch (error) {
            console.error('Erro ao listar arquivos:', error);
            return [];
        }
    };

    const caminhoDiretorio = path.join(__dirname, '../../public/file/comunicacoes')
    const Arquivos = listarArquivosComunicações(caminhoDiretorio);
    // Envia a lista de arquivos em formato JSON para o cliente
    res.json({ arquivos: Arquivos });
};


//LISTA DE ARQUIVOS LGPD ************************************************************************************************************
exports.listarArquivosManuaisInformatica = async (req, res) => {

    // Função para listar arquivos em um diretório
    const listarArquivosManuaisInformatica = (caminhoDiretorio) => {
        try {
            const arquivos = fs.readdirSync(caminhoDiretorio);
            const arquivosPDF = arquivos.filter((arquivo) => arquivo.toLowerCase().endsWith('.pdf'));
            return arquivosPDF;
        } catch (error) {
            console.error('Erro ao listar arquivos:', error);
            return [];
        }
    };

    const caminhoDiretorio = path.join(__dirname, '../../public/file/manuaisinformatica')
    const ArquivosPDF = listarArquivosManuaisInformatica(caminhoDiretorio);
    // Envia a lista de arquivos em formato JSON para o cliente
    res.json({ arquivos: ArquivosPDF });
};

//LISTA DE RAMAIS ************************************************************************************************************
exports.listarArquivosRamais = async (req, res) => {

    try {
        const resultado = await ListaRamaisModel.findAll({
            attributes: ['idTelExt','idDept', 'nameUsers', 'extensionsNumber', 'externalSuffix'],
            include: [{
                model: DepartmentsModel,
                attributes: ['department'],
                as: 'department'
            }],
            order: [
                ['extensionsNumber', 'ASC'] // Ordena pelo campo extensionsNumber em ordem crescente
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