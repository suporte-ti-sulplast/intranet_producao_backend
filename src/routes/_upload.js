const express = require("express");
const router = express.Router();
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/upload/news')          
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname)
    }
}),
fileFilter: (req, file, cb) => {
    const exttensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find

    (formatoAceito => formatoAceito == file.mimetype);
    if(exttensaoImg){
        return cb(null, true);
    } else {
        return cb(null, false);
    }
}
}).single('image');

// PAGINA INICIAL DE LOGIN
router.post('/', async (req, res) => {

  upload(req, res, (err) => {

      if(req.file){
        return res.json(
            {
                erro: false,
                meensagem: "Upload da imagem realizado com sucesso",
                name: req.file.filename
            }
        );
        
      } else {
        return res.status(400).json(
            {
                erro: true,
                meensagem: "Upload não realizado, necessário tentar novamente."
            }
        );
      };
  });
});

module.exports = router;