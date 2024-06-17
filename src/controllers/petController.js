import fs from 'fs';
import Pet from "../models/pet.js";
import path from 'path';
const __dirname = path.resolve();
import sharp from 'sharp';

export async function createPet(req, res) {
	try {
		const { name, specie, breed, birthDate, description, characteristics, sex, size, images, rescuer } = req.body;

		const newPet = new Pet({
			name,
			specie,
			breed,
			characteristics: characteristics.map((characteristic) => ({
				key: characteristic.key,
				value: characteristic.value,
			})),
			sex,
			size,
			rescuer: rescuer,
			birthDate,
			description,
		});

		// add images to the pet
		const pet = await newPet.save();
		if (!pet) {
			return res.status(500).json({ error: 'Error al crear la mascota.' });
		}
		if (images.length !== 0) {
			const imagePath = await addImagesToPet(pet, images);
			pet.images = imagePath;
			await pet.save();
		}
		res.status(201).json(newPet);
	} catch (error) {
		console.error('Error al crear la mascota', error);
		res.status(500).json({ error: 'Error al crear la mascota.' });
	}
}

// main function to add images to the pet. This function will receive the pet id and the images
async function addImagesToPet(pet, images) {
	try {
		const folder = 'pets';
		const uploadDirectory = path.join(__dirname, `uploads/${folder}`); // path to the folder where the images will be saved

		// create the folder if it doesn't exist
		if (!fs.existsSync(uploadDirectory)) {
			fs.mkdirSync(uploadDirectory, { recursive: true });
		}

		// delete images that are not in the new images array
		const petImages = pet.images;
		const deletionPromises = petImages.map(async (petImage) => {
			if (!images.find((image) => image === petImage)) {
				const imageName = petImage.split("/").pop();
				const deleted = await deleteImageFromFs(imageName);
				if (!deleted) {
					console.error("Error al eliminar la imagen:", imageName);
				}
			}
		});

		await Promise.all(deletionPromises);

		// save the new images
		const imagePaths = await Promise.all(images.map(async (image, index) => {
			if (image.startsWith("http")) {
				return image;
			} else if (image.startsWith("data")) {
				const newImageName = `${pet._id}-${Date.now()}-${index}.webp`;
				const saved = await saveImageInFs(image, newImageName, folder);
				if (saved) {
					return `http://localhost:4000/uploads/pets/${newImageName}`;
				}
			}
			return null;
		}));

		// filter the images that were not saved
		return imagePaths.filter(Boolean);
	} catch (error) {
		console.error("Error al guardar las imágenes de la mascota", error);
		return null;
	}
}

// Asegúrate de definir las funciones deleteImageFromFs y saveImageInFs aquí
async function deleteImageFromFs(imageName) {
	try {
		console.log('deleting', imageName);
		const filePath = path.join(__dirname, 'uploads/pets', imageName);
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

async function saveImageInFs(base64Image, imageName, folder) {
	try {
		const uploadDirectory = path.join(__dirname, `uploads/${folder}`);
		const filePath = path.join(uploadDirectory, imageName);

		// Decode from base64
		const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

		const buffer = Buffer.from(base64Data, 'base64');

		await sharp(buffer)
			// DECIDE LATER HOW TO RESIZE THE IMAGE (IF NEEDED)
			// .resize({ width: 1280, height: 720, fit: "inside" }) // Resize the image to fit inside a 1280x720 box
			// .resize({ width: 800, height: 800, fit: "cover" }) // Resize the image to cover a 800x800 box
			.resize({ height: 800 }) // Redimensionar la imagen
			.webp({ quality: 80 }) // Ajustar calidad de compresión
			.toFile(filePath)


		return true;
	} catch (error) {
		console.error("Error al guardar la imagen en el sistema de archivos", error);
		return false;
	}
}

const allowedCharacteristicTypes = [
	"size",
	"coat length",
	"good with cats",
	"good with dogs",
	"good with kids",
	"color",
	"age range",
];

// this function will get all the pets from the database and return them
// but can also filter them by specie, age range, size, sex
// if the filters are not provided, it will return all the pets
export async function getAllPets(req, res) {
	try {
		//the filters are in the body of the request
		const { age
			, specie
			, size,
			sex } = req.query
		// if there are no filters, return all the pets
		if (!age && !specie && !size && !sex) {
			const pets = await Pet.find().populate("rescuer", "name _id");
			return res.status(200).json(pets);
		}
		// age can be an array with multiple values
		// so we need to iterate over all the values and convert them to a date range
		const filters = []; //array to store the filters

		let ageRange = null;
		if (age) {
			const ages = Array.isArray(age) ? age : [age];
			ageRange = ages.map(Pet.ageRangeToDateRange);
			filters.push({
				$or: ageRange.map(range => ({
					birthDate: { $gte: range.start, $lte: range.end }
				}))
			});
		}
		if (specie) {
			filters.push({ specie });
		}
		if (size) {
			filters.push({ size });
		}
		if (sex) {
			filters.push({ sex });
		}
		// Búsqueda en la base de datos
		const query = filters.length > 0 ? { $and: filters } : {};
		const pets = await Pet.find(query);

		if (!pets.length) {
			return res.status(404).json([]);
		}
		res.status(200).json(pets);

	} catch (error) {
		console.error("Error al obtener las mascotas", error);
		res.status(500).json({ error: "Error al obtener las mascotas." });
	}
}

export async function getRandomAnimals(req, res) {
	try {
		const catAnimals = await Pet.aggregate([
			{ $match: { specie: "cat" } },
			{ $sample: { size: 2 } },
		]);

		const dogAnimals = await Pet.aggregate([
			{ $match: { specie: "dog" } },
			{ $sample: { size: 2 } },
		]);

		const randomAnimals = [...catAnimals, ...dogAnimals];

		res.status(200).json(randomAnimals);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Error al obtener los animales aleatorios." });
	}
}

export async function getRescuerPets(req, res) {
	try {
		const { rescuerId } = req.params;

		const pets = await Pet.find({ rescuer: rescuerId });
		res.status(200).json(pets);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener las mascotas del rescatista." });
	}
}

export async function getPetById(req, res) {
	try {
		const { petId } = req.params;
		const pet = await Pet
			.findById(petId)
			.populate("rescuer", "name _id");
		if (!pet) {
			return res.status(404).json({ error: "No se encontró la mascota." });
		}
		res.status(200).json(pet);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener la mascota." });
	}
}

export async function editPet(req, res) {
	try {
		const { petId } = req.params;
		const newPet = req.body;

		const pet = await Pet.findById(petId);
		if (!pet) {
			return res.status(404).json({ error: "No se encontró la mascota." });
		}

		if (newPet.images) {
			const imagePath = await addImagesToPet(pet, newPet.images);
			pet.images = imagePath;
		}

		await pet.save();
		res.status(200).json(pet);
	} catch (error) {
		console.error("Error al editar la mascota", error);
		res.status(500).json({ error: "Error al editar la mascota." });
	}
}
