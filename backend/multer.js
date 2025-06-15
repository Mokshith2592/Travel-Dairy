import multer from "multer";
import path from "path"

//storage config
const storage = multer.diskStorage({
    destination: function(req ,file ,cb) {
        cb(null ,'./uploads/')
    },

    filename: function(req ,file ,cb) {
        cb(null ,Date.now() + path.extname(file.originalname)) //gives unique name
    }
})

//to accept only images
const fileFilter = (req ,file ,cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null ,true)
    }
    else {
        cb(new Error("Only images are allowed") ,false)
    }
}
//Initializing multer
const upload = multer({storage ,fileFilter})

export default upload