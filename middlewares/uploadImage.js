const multer = require('multer');

module.exports = (multer({
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
            console.log("imagem:", file, "imagem:", file.mimetype)
            return cb(null, true, );
        } else {
            console.log("imagem:", file, "imagem:", file.mimetype)
            return cb(null, false);
        }
    }
})

);
