import fs from "fs";
import path from "path";

// Função para remover a imagem do sistema de arquivos
export const removeImageFromFileSystem = (imageAddress: string): void => {

    const imagePath = path.join(__dirname, "..", "..", "..", "..", "uploads", "imgs", imageAddress);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); 
    }

};