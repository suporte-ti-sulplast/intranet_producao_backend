const dbDelsoft = require('../conections/dbDelsoft');
var  msg, msg_type
const zebraRede = require('../functions/zebraPrinterRede');
const zebraPrinterLocal = require('../functions/zebraPrinterLocal');
const PrintersModel = require('../../models/Impressoras');
const { centralizarString } = require('../functions/manipuladorStrings');

//IMPRIME A ETIQUETA DA QUALIDADE  ************************************************************************************************************
exports.coqLabelsPrintQuali = async (req, res) => {

    const {printerName, coq, data, qtdade} = req.body
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };

    let margemSuperior;

    if(printer.netUsb === 'usb'){
        margemSuperior = 0;
    } else {
        margemSuperior = 0;
    };

    const zplData = '^XA \n' + // Inicia o arquivo

    '^LH0,'+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO25,35^FD' + coq + '^FS \n' +
    '^CF0,30 \n' +
    '^FO25,105^FD' + data + '^FS \n' +

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO240,35^FD' + coq + '^FS \n' +
    '^CF0,30 \n' +
    '^FO240,105^FD' + data + '^FS \n' +

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO445,35^FD' + coq + '^FS \n' +
    '^CF0,30 \n' +
    '^FO445,105^FD' + data + '^FS \n' +

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO655,35^FD' + coq + '^FS \n' +
    '^CF0,30 \n' +
    '^FO655,105^FD' + data + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};

//IMPRIME A ETIQUETA DA RASTREABILIDADE  ************************************************************************************************************
exports.coqLabelsPrintRastreabilidade = async (req, res) => {

    const {printerName, linha1, data, qtdade} = req.body
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };

    let margemSuperior;

    if(printer.netUsb === 'usb'){
        margemSuperior = 10;
    } else {
        margemSuperior = 0;
    };

    const zplData = '^XA \n' + // Inicia o arquivo

    '^LH0,'+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO65,35^FD' + linha1 + '^FS \n' +
    '^CF0,30 \n' +
    '^FO45,105^FD' + data + '^FS \n' +

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO280,35^FD' + linha1 + '^FS \n' +
    '^CF0,30 \n' +
    '^FO260,105^FD' + data + '^FS \n' +

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO485,35^FD' + linha1 + '^FS \n' +
    '^CF0,30 \n' +
    '^FO465,105^FD' + data + '^FS \n' +

    '^FX \n' +
    '^CF0,60 \n' +
    '^FO695,35^FD' + linha1 + '^FS \n' +
    '^CF0,30 \n' +
    '^FO675,105^FD' + data + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};


//IMPRIME A ETIQUETA DA CURA   ************************************************************************************************************
exports.coqLabelsPrintCura = async (req, res) => {

    const {printerName, ano, qtdade} = req.body

    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };
    
    let margemSuperior;

    if(printer.netUsb === 'usb'){
        margemSuperior = 15;
    } else {
        margemSuperior = 0;
    };
    
    const zplData = '^XA \n' + // Inicia o arquivo

    '^LH0,'+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8
    '^FO145,0^GB550,55,5^FS' + // Adiciona a caixa gráfica com fundo preto

    '^CF0,36^FO130,15^FB600,1,0,C^FDINÍCIO DA CURA DO PRODUTO^FS' +
    '^CF0,35\n' +
    '^FO100,77^FD' + 'Data: ____/_____/ ' + ano + '    Hora: ____:____' + '^FS \n' +
    '^CF0,30 \n' +
    '^FO240,132^FD' + 'Doc. de Ref. Folha de Processo' + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};

//IMPRIME A ETIQUETA DA CURA2   ************************************************************************************************************
exports.coqLabelsPrintCura2 = async (req, res) => {

    const {printerName, ano, qtdade} = req.body
    console.log(ano)
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };
    
    let margemSuperior;

    if(printer.netUsb === 'usb'){
        margemSuperior = 8;
    } else {
        margemSuperior = 0;
    };
    
    const zplData = '^XA \n' + // Inicia o arquivo

    '^LH0,'+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8
    '^FO145,0^GB550,55,5^FS' + // Adiciona a caixa gráfica com fundo preto

    '^CF0,36^FO130,15^FB600,1,0,C^FDINÍCIO DA CURA DO PRODUTO^FS' +
    '^CF0,30\n' +
    '^FO90,77^FD' + 'Data: ____/_____/ ' + ano + '     Saída da estufa: ____:____' + '^FS \n' +
    '^CF0,30 \n' +
    '^FO340,132^FD' + ' Início do polimento: ____:____' + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};


//IMPRIME A ETIQUETA DA DATA   ************************************************************************************************************
exports.coqLabelsPrintData = async (req, res) => {

    const {printerName, qtdade, data} = req.body;
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };
    
    const altura = 200 ; // Ajuste com base na sua resolução
    const comprimento = 160 * 8; // Ajuste com base na sua resolução
    let margemSuperior;

    if(printer.netUsb === 'usb'){
        margemSuperior = 15;
    } else {
        margemSuperior = 0;
    };
    
    const zplData = '^XA \n' + // Inicia o arquivo

    '^LL' + altura + '\n' + // Define o comprimento
    '^PW' + comprimento + '\n' + // Define a altura
    '^LH0,'+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8
    '^CF0,80\n' +
    '^FO220,45^FD' + data + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};

//IMPRIME A ETIQUETA DA TEXTO LIVRE   ************************************************************************************************************
exports.coqLabelsPrintTexto = async (req, res) => {

    const {printerName, qtdade, texto} = req.body;
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };
    
    let margemSuperior, margemEsquerda;

    if(printer.netUsb === 'usb'){
        margemSuperior = 0;
        margemEsquerda = 0;
    } else {
        margemSuperior = 0;
        margemEsquerda = 30;
    };
    
    const zplData = '^XA \n' + // Inicia o arquivo
    
    '^CI28\n' + // Define a codificação UTF-8
    '^LH' + margemEsquerda + ','+ margemSuperior + '\n' +
    '^FO10,40^FB800,1,0,C^A0N,80,80^FD ' + texto + '^FS' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};

//IMPRIME A ETIQUETA DA Roto   ************************************************************************************************************
exports.coqLabelsPrintRotoSearch = async (req, res) => {

    const {texto} = req.body;

    const resultadoConsulta = await dbDelsoft.query(
        'SELECT * FROM ETIQUETA_BuscarProdutosRelacionados(:codigo)',
        {
          replacements: { codigo: texto },
          type: dbDelsoft.QueryTypes.SELECT,
        }
    );
      
    if(resultadoConsulta[0] === undefined || resultadoConsulta[1] === undefined ) {
    // Extrai os dígitos da PRO_Descricao na posição específica
    const codigo = "NÃO";
    const material = "ENCONTRADO"
    return res.json({ codigo, material }); 
    } else {

        const match = resultadoConsulta[1].PRO_Descricao.match(/\d+/);
        const numeros  = match ? match[0] : null;
        const codigo = numeros ? `${numeros.slice(0, 3)}-${numeros.slice(3)}` : null;
        const material = resultadoConsulta[0].PRO_ProdutoCaracteValor;
        return res.json({ codigo, material }); 


    }
};

//IMPRIME A ETIQUETA DA Roto   ************************************************************************************************************
exports.coqLabelsPrintRoto = async (req, res) => {

    const { printerName, qtdade, codigo, material } = req.body;
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };
    
    const altura = 200 ; // Ajuste com base na sua resolução
    const comprimento = 160 * 8; // Ajuste com base na sua resolução
    let margemSuperior;

    if(printer.netUsb === 'usb'){
        margemSuperior = 15;
    } else {
        margemSuperior = 0;
    };

    const zplData = '^XA \n' + // Inicia o arquivo

    '^LL' + altura + '\n' + // Define o comprimento
    '^PW' + comprimento + '\n' + // Define a altura
    '^CF0,60\n' +
    '^FO290,15^FD' + codigo + '^FS \n' +
    '^CF0,60\n' +
    '^FO270,90^FD' + material + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};


//IMPRIME A ETIQUETA BARCODE39   ************************************************************************************************************
exports.coqLabelsPrintBarCode39 = async (req, res) => {

    const { printerName, qtdade, codigo, setLegenda } = req.body;
    const Y = setLegenda ? "Y" : "";

    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };

    const altura = 200 ; // Ajuste com base na sua resolução
    const comprimento = 160 * 8; // Ajuste com base na sua resolução
    let margemSuperior;

    const zplData = '^XA \n' + // Inicia o arquivo

    '^LL' + altura + '\n' + // Define o comprimento
    '^PW' + comprimento + '\n' + // Define a altura
    '^LH0,'+ margemSuperior + '\n' +
    '^BY6,2,270\n' +
    '^FO270,35^BY4^BCN,100,' + Y + 'N,N\n' +
    '^FD>;' + codigo + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!"
                msg_type = "success"
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!"
                msg_type = "error"
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!"
            msg_type = "error"
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!"
                msg_type = "success"
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!"
                msg_type = "error"
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!"
            msg_type = "error"
            return res.json({ msg, msg_type }); 
        });
    }
};


//BUSCA DADOS DA ETIQUETA DA MODALGEM   ************************************************************************************************************
exports.coqLabelsPrintMoldagemSearch = async (req, res) => {

    const {texto} = req.body;
    var resultadoConsulta1, resultadoConsulta2, resultadoConsulta3;
    var moldagem, material, codigo;

    resultadoConsulta1 = await dbDelsoft.query(
        'SELECT * FROM ETIQUETA_BuscarProdutosMoldagem1(:codigo)',
        {
          replacements: { codigo: texto },
          type: dbDelsoft.QueryTypes.SELECT,
        }
    );

    resultadoConsulta2 = await dbDelsoft.query(
        'SELECT * FROM ETIQUETA_BuscarProdutosMoldagem2(:codigo)',
        {
          replacements: { codigo: texto },
          type: dbDelsoft.QueryTypes.SELECT,
        }
    );

    resultadoConsulta3 = await dbDelsoft.query(
        'SELECT * FROM ETIQUETA_BuscarProdutosMoldagem3(:codigo)',
        {
          replacements: { codigo: texto },
          type: dbDelsoft.QueryTypes.SELECT,
        }
    );

    if (resultadoConsulta1 != null && resultadoConsulta1.length >= 2) {
        // Extrai o código do resultado da busca 1
        // Encontrar a posição no array onde PRO_Descricao contém 'FENDER'
        const posicao = resultadoConsulta1.findIndex(item => item.PRO_Descricao.includes('FENDER'));
        const match = resultadoConsulta1[posicao].PRO_Descricao.match(/\d+/);
        const numeros  = match ? match[0] : null;
        codigo = numeros ? `${numeros.slice(0, 3)}-${numeros.slice(3)}` : null;
    
        // Extrai o material do resultado da busca 3
        const chapa = resultadoConsulta3[0].PRO_Descricao;
        const partes = chapa.split(/\s+/);
        material = partes.slice(1, 3).join(' ');
    
        // Extrai o código da moldagem do resultado da busca 2
        moldagem = resultadoConsulta2[0].PRO_Codigo.trim();
    } else {
        codigo = material = moldagem = 'NA';
    }

    return res.json({ codigo, material, moldagem, texto }); 

};

//IMPRIME A ETIQUETA DA MOLDAGEM   ************************************************************************************************************
exports.coqLabelsPrintMoldagem = async (req, res) => {

    const { printerName, qtdade, codigo, material, moldagem, acabado } = req.body;
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };

    const altura = 200 ; // Ajuste com base na sua resolução
    const comprimento = 160 * 8; // Ajuste com base na sua resolução
    let margemSuperior;

    if(printer.netUsb === 'usb'){
        margemSuperior = 25;
    } else {
        margemSuperior = 0;
    };

    const zplData = '^XA \n' + // Inicia o arquivo

    '^LL' + altura + '\n' + // Define o comprimento
    '^PW' + comprimento + '\n' + // Define a altura
    '^LH0,'+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8
    '^CF0,40\n' +
    '^FO290,0^FD' + codigo + '^FS \n' +
    '^CF0,40\n' +
    '^FO290,60^FD ' + material + ' ^FS \n' +
    '^CF0,40\n' +
    '^FO135,115^FD ' + moldagem + '                     ' + acabado + '^FS \n' +

    '^FO135,20^GFA,750,750,10,N01F,N07FC,N0FFE,M01IF,M03IF8,:M07F1FC,M07E0FC,M0FC07E,L01FC07F,L01F803F,L03F803F8,L03F001F8,L07EI0FC,L0FEI0FE,L0FCI07E,K01FCI07F,K01F8I03F038,K03FJ01F87C,:K01EK0FC7C,L0CK0FEFC,R07EFC,R07FFC,R03FF8,Q0F1FF8,Q0JF8,P01JF,J0FK01JF,I0FF8K0JF,007FF8K07IF,03IF8L07FE,07IFCM07E,07IFC,:07EFFC,I0FFE,001FFE,:003F3E,007F3FO078,007E3FO07C,00FE1FO07E,00FC1EO07E,01F8Q03F,:03FR01F8,07FR01FC,07ES0FC,0FES0FE,0FCS07E,1F8S03F,:3FO04J01F8,7FN01FJ01FC,7EN03FK0FC,7EN07FK0FC,FCN0FFK07E,FCM01FEK07E,FCM03FCK07E,FCM07F8K07E,7KF800OFC,7KFC01OFC,3KFE01OF8,1KFE01OF,0KFE01NFE,03JF800NF8,O07F8,O03FC,O01FE,P0FF,P07F,P03F,P01F,Q0E,^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };

};

//BUSCA DADOS DA ETIQUETA DA VOLKSWAGEN   ************************************************************************************************************
exports.coqLabelsPrintVolkswagenSearch = async (req, res) => {

    const {texto} = req.body;
    var resultadoConsulta1
    var descricao, pn;

    resultadoConsulta1 = await dbDelsoft.query(
        'SELECT * FROM ETIQUETA_BuscarProdutosVolkswagen(:codigo)',
        {
          replacements: { codigo: texto },
          type: dbDelsoft.QueryTypes.SELECT,
        }
    );

     if (resultadoConsulta1 != null && resultadoConsulta1.length !== 0) {
        // Extrai a descrição do resultado da busca 1
        const descricaoCompleta = resultadoConsulta1[0].PRO_Descricao;

        // Usando regex para extrair as partes desejadas
        const match = descricaoCompleta.match(/\(([^)]+)\)\s*(.*)/);
        
        // match[1] contém a primeira parte, match[2] contém a segunda parte
        pn = match ? match[1] : null;
        descricao = match ? match[2] : null;
        
    } else {
        codigo = pn = descricao = 'NA';
    } 

    return res.json({ pn, descricao, texto }); 

};

//IMPRIME A ETIQUETA DA VOLKSWAGEN   ************************************************************************************************************
exports.coqLabelsPrintVolkswagen = async (req, res) => {

    const { printerName, qtdade, codigo, pn, desc, lote, aprov, fabric } = req.body;
    const titulo = 'SULPLAST      APROVAÇÃO FINAL';
    let printer;

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };

    const altura = 200 ; // Ajuste com base na sua resolução
    const comprimento = 160 * 8; // Ajuste com base na sua resolução
    let margemSuperior;
    let margemEsquerda;

    if(printer.netUsb === 'usb'){
        margemSuperior = 15;
        margemEsquerda = 10;
    } else {
        margemSuperior = 0;
        margemEsquerda = 10;
    };
    

    const zplData = '^XA \n' + // Inicia o arquivo

    '^LL' + altura + '\n' + // Define o comprimento
    '^PW' + comprimento + '\n' + // Define a altura
    '^LH' + margemEsquerda + ','+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8
    '^FO75,0^ADN,30,15^FD' + titulo + '^FS \n' +
    '^CF0,26\n' +
    '^FO69,39^FD Desc. da peça: ' + desc + ' ^FS \n' +
    '^CF0,26\n' +
    '^FO69,70^FD Cód. final da peça: ' + codigo + '^FS \n' +
    '^CF0,26\n' +
    '^FO69,100^FD Lote: ' + lote + '                                             P.N.: ' + pn + '^FS \n' +
    '^CF0,20\n' +
    '^FO69,130^FD Data aprovação: ' + aprov + '                                      Data fabricação: ' + fabric + '^FS \n' +

    '^XZ'; // Fecha o arquivo


    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};

//IMPRIME A ETIQUETA DO IP  ************************************************************************************************************
exports.coqLabelsPrintIP = async (req, res) => {

    const {printerName, qtdade, linha1, linha2} = req.body
    let printer;

    const isTextoPar = (txt) => txt.length % 2 === 0;
    const posicaoX1 = isTextoPar(linha1) ? 7 : 25;
    const posicaoX2 = isTextoPar(linha2) ? 7 : 25;
    const posicaoX3 = isTextoPar(linha1) ? 220 : 238;
    const posicaoX4 = isTextoPar(linha2) ? 220 : 238;
    const posicaoX5 = isTextoPar(linha1) ? 425 : 443;
    const posicaoX6 = isTextoPar(linha2) ? 425 : 443;
    const posicaoX7 = isTextoPar(linha1) ? 640 : 658;
    const posicaoX8 = isTextoPar(linha2) ? 640 : 658;

    const txt1 = centralizarString(linha1, 6);
    const txt2 = centralizarString(linha2, 6);

    try {
        printer = await PrintersModel.findOne({
            attributes: ['printerName', 'model','ip','netUsb'],
            where: {
                printerName: printerName
            },
            raw: true,
            nest: true,
        });
    } catch {
        console.log("Houve um erro interno", error);
        return res.status(500).json({ error: "Internal server error." });
    };

    const altura = 200 ; // Ajuste com base na sua resolução
    const comprimento = 160 * 8; // Ajuste com base na sua resolução
    let margemSuperior, margemEsquerda;

    if(printer.netUsb === 'usb'){
        margemSuperior = 5;
        margemEsquerda = 5;
    } else {
        margemSuperior = 15;
        margemEsquerda = 15;
    };

    const zplData = '^XA \n' + // Inicia o arquivo
    '^LL' + altura + '\n' + // Define o comprimento
    '^PW' + comprimento + '\n' + // Define a altura
    '^LH' + margemEsquerda + ','+ margemSuperior + '\n' +
    '^CI28\n' + // Define a codificação UTF-8

    '^FX \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX1 + ',30^FD' + txt1 + '^FS \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX2 + ',85^FD' + txt2 + '^FS \n' +

    '^FX \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX3 + ',30^FD' + txt1 + '^FS \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX4 + ',85^FD' + txt2 + '^FS \n' +

    '^FX \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX5 + ',30^FD' + txt1 + '^FS \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX6 + ',85^FD' + txt2 + '^FS \n' +

    '^FX \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX7 + ',30^FD' + txt1 + '^FS \n' +
    '^CF0,45 \n' +
    '^FO' + posicaoX8 + ',85^FD' + txt2 + '^FS \n' +

    '^XZ'; // Fecha o arquivo

    if(printer.netUsb === 'usb'){
        zebraPrinterLocal(zplData, qtdade, printer.printerName, printer.ip) 
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        }); 
    } else {
        zebraRede(zplData, qtdade, printer.ip)
        .then((resultado) => {
            if(resultado === true) {
                msg = "Impressão concluída com sucesso!";
                msg_type = "success";
                return res.json({ msg, msg_type }); 
            } else {
                msg = "Houve um erro ao conectar com a impressora!";
                msg_type = "error";
                return res.json({ msg, msg_type }); 
            }
        })
        .catch((erro) => {
            msg = "Houve um erro ao conectar com a impressora!";
            msg_type = "error";
            return res.json({ msg, msg_type }); 
        });
    };
};