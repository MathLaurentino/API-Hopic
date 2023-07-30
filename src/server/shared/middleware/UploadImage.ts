import multer from "multer";
import * as path from "path";

export const uploadImage = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const destinationPath = path.join(__dirname, "..", "..", "..", "..", "imgs");
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const imageName = Date.now().toString() + "_" + file.originalname;
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
