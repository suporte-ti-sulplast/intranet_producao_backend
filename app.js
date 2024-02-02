const express = require('express');
const cors = require("cors");
const app = express();
const path = require('path');
const router = require("./src/routes"); 
const multer = require('multer');
require('dotenv').config();
const { getSensorDataRackSalaTI } = require('./src/conections/arduino');
const { monitorSensorDataRackSalaTI } = require('./src/functions/getDataArduinos');

//configura o CORs
app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  next();
});



const upload = require('./src/routes/upload');
const authRouter =  require('./src/routes/auth');
const indexRouter =  require('./src/routes/index');
const userRoutes = require('./src/routes/userRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const labelsRoutes = require('./src/routes/labelsRoutes');
const printerRoutes = require('./src/routes/printerRoutes');
const reportsRoutes = require('./src/routes/reportsRoutes');
const conciergeRoutes = require('./src/routes/conciergeRoutes');
const filesRouter = require('./src/routes/filesRouter'); 
const sgiRouter = require('./src/routes/sgiRoutes'); 
const panelRouter = require('./src/routes/panelRoutes'); 
const voucherWifi = require('./src/routes/voucherWifiRouters'); 
const monitorRouter = require('./src/routes/monitorRouter'); 

const { rackSalaTI } = require('./src/services//sendEmailSensors');

const { render } = require('ejs');

app.use(router);

app.use(express.json()); // Para analisar JSON
app.use(express.urlencoded({ extended: true })); // Para analisar dados de formulários

//CAMINHO DA PASTA PUBLIC - JS, CSS, IMAGENS
app.use(express.static(path.join(__dirname, 'public')));

//ROTAS
app.use("/auth", authRouter);
app.use("/", newsRoutes);
app.use("/", userRoutes);
app.use("/", indexRouter);
app.use("/", labelsRoutes);
app.use("/", printerRoutes);
app.use("/", reportsRoutes);
app.use("/", conciergeRoutes);
app.use("/", filesRouter);
app.use("/", sgiRouter);
app.use("/", panelRouter);
app.use("/", voucherWifi);
app.use("/", monitorRouter);

// Configurar uma rota para servir imagens
app.use('/images-news', express.static(path.join(__dirname, 'public/upload/news')));
app.use('/images-vehicles', express.static(path.join(__dirname, 'public/upload/vehicles')));
//rota para fazer upload de imagem
app.use('/upload', upload);

// Endpoint para servir arquivos
app.use('/files-lgpd', express.static(path.join(__dirname, 'public/file/lgpd')));
app.use('/files-manuais-informatica', express.static(path.join(__dirname, 'public/file/manuaisinformatica')));
app.use('/files-its', express.static(path.join(__dirname, 'public/file/sgi/its')));
app.use('/files-comunicacoes', express.static(path.join(__dirname, 'public/file/comunicacoes')));


getSensorDataRackSalaTI();
monitorSensorDataRackSalaTI(60);
// Inicia serviços a cada 20 segundos
rackSalaTI(20);

//inicializa o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});