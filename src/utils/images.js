import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
import sharp from 'sharp';

export async function saveImageInFs(base64Image, imageName, folder, height = 800, quality = 80) {
    try {
        // Crear directorio si no existe
        if (!fs.existsSync(path.join(__dirname, `uploads/${folder}`))) {
            fs.mkdirSync(path.join(__dirname, `uploads/${folder}`));
        }

        const uploadDirectory = path.join(__dirname, `uploads/${folder}`);
        const filePath = path.join(uploadDirectory, imageName);

        // Decode from base64
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const buffer = Buffer.from(base64Data, 'base64');

        await sharp(buffer)
            // DECIDE LATER HOW TO RESIZE THE IMAGE (IF NEEDED)
            // .resize({ width: 1280, height: 720, fit: "inside" }) // Resize the image to fit inside a 1280x720 box
            // .resize({ width: 800, height: 800, fit: "cover" }) // Resize the image to cover a 800x800 box
            .resize({ height: height }) // Redimensionar la imagen
            .webp({ quality: quality }) // Ajustar calidad de compresión
            .toFile(filePath)


        return true;
    } catch (error) {
        console.error("Error al guardar la imagen en el sistema de archivos", error);
        return false;
    }
}

export async function deleteImageFromFs(imageName, folder) {
    try {
        console.log('deleting', imageName);
        const filePath = path.join(__dirname, `uploads/${folder}`, imageName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error al eliminar la imagen del sistema de archivos", error);
        return false;
    }
}

/*
export async function minifyImages(base64Image, imageName, folder) {
    try {
        const uploadDirectory = path.join(__dirname, `uploads/${folder}`);
        const filePath = path.join(uploadDirectory, imageName);

        // Decodificar base64
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Convertir a WebP y reducir calidad
        await sharp(buffer)
            .webp({ quality: 80 }) // Ajustar calidad de compresión
            .toFile(filePath);

        console.log(`Imagen optimizada guardada en: ${filePath}`);
        return true;
    } catch (error) {
        console.error("Error al optimizar y guardar la imagen", error);
        return false;
    }
}
*/