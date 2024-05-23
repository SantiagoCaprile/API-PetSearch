import Pet from "../models/pet.js";
import cloudinary from '../config/cloudinaryConfig.js'

export async function createPet(req, res) {
	try {
		const { name, specie, breed, birthDate, description, characteristics, images, rescuer } = req.body;

		const imageUploads = await Promise.all(images.map(async (image) => {

			const uploadResponse = await cloudinary.uploader.upload(image, {
				asset_folder: 'pets',
				resource_type: 'image',
				allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
			});
			return uploadResponse.secure_url;
		}));

		const newPet = new Pet({
			name,
			specie,
			breed,
			characteristics: characteristics.map((characteristic) => ({
				key: characteristic.key,
				value: characteristic.value,
			})),
			rescuer: rescuer,
			birthDate,
			description,
			images: imageUploads
		});

		await newPet.save();
		res.status(201).json(newPet);
	} catch (error) {
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

function calculateAgeRange(age) {
	if (age.unit !== "years") {
		return "baby";
	}
	if (age.number > 1 && age.number < 4) {
		return "young";
	}

	if (age.number >= 4 && age.number < 8) {
		return "adult";
	}

	if (age.number >= 8) {
		return "senior";
	}
}

//this should be getAllPets and decode the images from base64 to a web format like jpeg or png
export async function getAllPets(req, res) {
	try {
		const pets = await Pet.find().populate("rescuer", "name email");
		if (!pets) {
			return res.status(404).json({ error: "No se encontraron mascotas." });
		}

		res.status(200).json(pets);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error al obtener las mascotas." });
	}
}


export async function getPetsBySpecies(req, res) {
	try {
		const { species } = req.params;
		const { filters } = req.query;

		let filterObj = {};

		// Verificar si se proporcionaron filtros
		if (filters) {
			const filtersArray = filters.split(",");

			// Aplicar los filtros a filterObj
			filtersArray.forEach((filter) => {
				const [key, value] = filter.split(":");
				filterObj[`characteristics.${key}`] = value;
			});
		}

		const pets = await Pet.find({ species, ...filterObj }).populate("user");

		res.status(200).json(pets);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Error al obtener las mascotas por especie." });
	}
}

export async function getRandomAnimals(req, res) {
	try {
		const catAnimals = await Pet.aggregate([
			{ $match: { species: "cat" } },
			{ $sample: { size: 2 } },
		]);

		const dogAnimals = await Pet.aggregate([
			{ $match: { species: "dog" } },
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
