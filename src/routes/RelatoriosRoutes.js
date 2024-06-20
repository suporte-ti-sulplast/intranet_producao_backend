const express = require('express');
const router = express.Router();

const RelatoriosController = require('../controllers/RelatoriosController');

router.post('/consultaFechamentoEstoque', RelatoriosController.consultaFechamentoEstoque); //CONSULTA DELSOFT TESTE
router.post('/evolucaoCustoPorDepto', RelatoriosController.evolucaoCustoPorDepto); 
router.post('/evolucaoCustoPorDepto-adicionar', RelatoriosController.evolucaoCustoPorDeptoAdicionar); 
router.post('/evolucaoCustoPorDepto-buscar', RelatoriosController.evolucaoCustoPorDeptoBuscar); 
router.get('/evolucaoCustoPorDepto-listar', RelatoriosController.evolucaoCustoPorDeptoListar); 
router.get('/centroCusto-listar', RelatoriosController.centroCustoListar); 
router.post('/custoProduto-gerar', RelatoriosController.custoProdutoGerar); 
router.get('/custoProduto-listar', RelatoriosController.custoProdutoListar); 
router.post('/custoProduto-deletar', RelatoriosController.custoProdutoDeletar); 

module.exports = router;