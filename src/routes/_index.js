const express = require("express")
const router = express.Router()


//PAGINA INICIAL DE LOGIN
router.get('/', (req, res) => {
    res.render("index")
})

module.exports = router