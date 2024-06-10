import Pet from "../models/pet.js";
import cloudinary from '../config/cloudinaryConfig.js'

export async function createPet(req, res) {
	try {
		const { name, specie, breed, birthDate, description, characteristics, sex, size, images, rescuer } = req.body;

		let imageUploads = [];
		if (images && images.length !== 0) {
			imageUploads = await Promise.all(images.map(async (image) => {

				const uploadResponse = await cloudinary.uploader.upload(image, {
					asset_folder: 'pets',
					resource_type: 'image',
					allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
				});
				return uploadResponse.secure_url;
			}))
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
			images: imageUploads
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
