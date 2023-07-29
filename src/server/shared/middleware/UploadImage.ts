import multer from "multer";
import * as path from "path";
// import fs from "fs";

// const uploadDir = "./../../../../imgs"; 

// // Verifica se o diretório de upload existe, caso contrário, cria-o
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

export const uploadImage = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "../../../../imgs");
        },
        filename: (req, file, cb) => {
            const imageName = Date.now().toString() + "_" + path.extname(file.originalname);
            req.body.imageAddress = imageName;
            cb(null, imageName);
        }
    }),

    fileFilter: (req, file, cb) => {
        const extensaoImg = ["image/png", "image/jpg", "image/jpeg"].find(formatoCerto => formatoCerto == file.mimetype);

        if (extensaoImg) {
            return cb(null, true);
        }
        return cb(null, false);
    }
}));
