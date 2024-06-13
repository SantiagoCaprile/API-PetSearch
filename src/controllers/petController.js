import fs from 'fs';
import Pet from "../models/pet.js";
// import cloudinary from '../config/cloudinaryConfig.js'
import path from 'path'; // Asegúrate de que la ruta sea correcta
const __dirname = path.resolve(); // Asegúrate de que la ruta sea correcta

export async function createPet(req, res) {
	try {
		const { name, specie, breed, birthDate, description, characteristics, sex, size, images, rescuer } = req.body;

		let imagePaths = [];
		if (images && images.length !== 0) {
			const uploadDirectory = path.join(__dirname, 'uploads', 'pets'); // Ruta donde se guardarán las imágenes

			// Crear la carpeta si no existe
			if (!fs.existsSync(uploadDirectory)) {
				fs.mkdirSync(uploadDirectory, { recursive: true });
			}

			imagePaths = await Promise.all(images.map(async (image, index) => {
				const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
				const buffer = Buffer.from(base64Data, 'base64');
				const imageName = `${Date.now()}-${index}.jpg`;
				const imagePath = path.join(uploadDirectory, imageName);

				// Guardar la imagen localmente
				await fs.promises.writeFile(imagePath, buffer);
				return imagePath;
			}));
		}

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
			images: imagePaths
		});

		await newPet.save();
		res.status(201).json(newPet);
	} catch (error) {
		console.error('Error al crear la mascota', error);
		res.status(500).json({ error: 'Error al crear la mascota.' });
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

function validateCharacteristics(characteristics) {
	const characteristicsArray = Array.from(characteristics);

	for (const characteristic of characteristicsArray) {
		if (!allowedCharacteristicTypes.includes(characteristic.key)) {
			return {
				valid: false,
				error: `Tipo de característica no permitido: ${characteristic.key}`,
			};
		}
	}

	return { valid: true };
}

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

		// la edicion de imagenes la vamos a implementar mas tarde
		Object.keys(newPet).forEach((key) => {
			if (key === "images") return;

			pet[key] = newPet[key];
		});

		await pet.save();
		res.status(200).json(pet);
	} catch (error) {
		console.error("Error al editar la mascota", error);
		res.status(500).json({ error: "Error al editar la mascota." });
	}
}


export const updatePetImages = async () => {
	// this will just update the images of the pet
	// we will receive the pet id and the new images
	try {
		const pets = await Pet.find();
		if (!pets) {
			return null;
		}

		for (const pet of pets) {
			let imagePaths = [];
			const uploadDirectory = path.join(__dirname, 'uploads/pets'); // Ruta donde se guardarán las imágenes

			// Crear la carpeta si no existe
			if (!fs.existsSync(uploadDirectory)) {
				fs.mkdirSync(uploadDirectory, { recursive: true });
			}

			// Reemplazar el imagePath guardado por uno del estilo http://localhost:3000/uploads/pets/<pet_id>-<index>.jpg
			const files = fs.readdirSync(uploadDirectory).filter(file => file.includes(pet._id));

			for (let i = 0; i < files.length; i++) {
				let imageUrl = `http://localhost:4000/uploads/pets/${pet._id}-${i}.jpg`;
				imagePaths.push(imageUrl);
			}

			pet.images = imagePaths;
			await pet.save();
		}

		return pets;
	} catch (error) {
		console.error("Error al editar la mascota", error);
		return null;
	}
};


// updatePetImages();
