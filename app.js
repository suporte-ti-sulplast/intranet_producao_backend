const express = require('express');
const cors = require("cors");
const app = express();
const path = require('path');
const router = require("./src/routes/_index"); 
const multer = require('multer');
const ldapFunctions = require('./src/conections/ldap');
require('dotenv').config();
const { getSensorDataRackSalaTI } = require('./src/conections/arduino');
const { monitorSensorDataRackSalaTI } = require('./src/functions/getDataArduinos');

const { binpack } = require('./src/functions/binpack')

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

const upload = require('./src/routes/_upload');
const authRouter =  require('./src/routes/_auth');
const indexRouter =  require('./src/routes/_index');
const UsuariosRoutes = require('./src/routes/UsuariosRoutes');
const NoticiasRoutes = require('./src/routes/NoticiasRoutes');
const EtiquetasRoutes = require('./src/routes/EtiquetasRoutes');
const ImpressorasRoutes = require('./src/routes/ImpressorasRoutes');
const RelatoriosRoutes = require('./src/routes/RelatoriosRoutes');
const PortariaRoutes = require('./src/routes/PortariaRoutes');
const ArquivosRouter = require('./src/routes/ArquivosRouter'); 
const CoqRoutes = require('./src/routes/CoqRoutes'); 
const PaineisRoutes = require('./src/routes/PaineisRoutes'); 
const RecepcaoRouters = require('./src/routes/RecepcaoRouters'); 
const MonitoresRouter = require('./src/routes/MonitoresRouter'); 
const DelsoftRouter = require('./src/routes/DelsoftRoutes'); 

const { rackSalaTI } = require('./src/services//sendEmailSensors');

app.use(router);

app.use(express.json()); // Para analisar JSON
app.use(express.urlencoded({ extended: true })); // Para analisar dados de formulários

//CAMINHO DA PASTA PUBLIC - JS, CSS, IMAGENS
app.use(express.static(path.join(__dirname, 'public')));

//ROTAS
app.use("/auth", authRouter);
app.use("/auth/cracha", authRouter);
app.use("/", NoticiasRoutes);
app.use("/", UsuariosRoutes);
app.use("/", indexRouter);
app.use("/", EtiquetasRoutes);
app.use("/", ImpressorasRoutes);
app.use("/", RelatoriosRoutes);
app.use("/", PortariaRoutes);
app.use("/", ArquivosRouter);
app.use("/", CoqRoutes);
app.use("/", PaineisRoutes);
app.use("/", RecepcaoRouters);
app.use("/", MonitoresRouter);
app.use("/", DelsoftRouter);

// Configurar uma rota para servir imagens
app.use('/images-vehicles', express.static(path.join(__dirname, 'public/upload/vehicles')));
//rota para fazer upload de imagem
app.use('/upload', upload);

// Endpoint para servir arquivos
app.use('/files-lgpd', express.static(path.join(__dirname, 'public/file/lgpd')));
app.use('/files-manuais-informatica', express.static(path.join(__dirname, 'public/file/manuaisinformatica')));
app.use('/files-its', express.static(path.join(__dirname, 'public/file/sgi/its')));
app.use('/files-comunicacoes', express.static(path.join(__dirname, 'public/file/comunicacoes')));
app.use('/files-noticias', express.static(path.join(__dirname, 'public/file/noticias')));


/* ldapFunctions.buscarUsuarios((err, usuarios) => {
  if (err) {
    console.error('Erro na busca de usuários:', err);
  } else {
    console.log('Usuários encontrados:', usuarios);
  }
}) */

/* binpack(); */

getSensorDataRackSalaTI();
monitorSensorDataRackSalaTI(60);
// Inicia serviços a cada 20 segundos
rackSalaTI(60*10);

//inicializa o servidor
app.listen(process.env.PORT, () => {
  console.log('Servidor rodando na porta:', process.env.PORT);
});