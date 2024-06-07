import Adoption from "../models/adoptionForm.js";
import Pet from "../models/pet.js";
import { Chat } from "../models/chat.js";
import Rescuer from "../models/rescuer.js";

export async function createAdoptionForm(req, res) {
	try {
		const {
			user,
			pet,
			responsable,
			incomeMoney,
			homeType,
			allowed,
			alergies,
			hadPets,
			areSterilized,
			tellMoreAboutPets,
			inWorstCase,
			whyAdopt,
		} = req.body;
		if (await userHasSentAdoptionForm(user, pet)) {
			return res.status(400).json({ error: 'User has already sent an adoption form for this pet' });
		}
		const rescuePet = await Pet.findById(pet).select('rescuer');
		const chat = await Chat.create({
			messages: [],
		});
		const adoption = await Adoption.create({
			chat: chat._id,
			user,
			rescuer: rescuePet.rescuer,
			pet,
			responsable,
			incomeMoney,
			homeType,
			allowed,
			alergies,
			hadPets,
			areSterilized,
			tellMoreAboutPets,
			inWorstCase,
			whyAdopt,
		});
		chat.adoptionForm = adoption._id;
		await chat.save();
		res.status(201).json({ adoption });
		// Create a chat for the user and the rescuer

	} catch (error) {
		console.error("Error al crear el formulario de adopción", error);
		res.status(400).json({ error: error.message });
	}
}

export async function getAllAdoptionByUser(req, res) {
	try {
		const { id } = req.params;
		const adoptions = await Adoption.find({ user: id })
			.populate("pet", ["name", "images", "breed"])
			.populate("user", "name");
		res.status(200).json(adoptions ? adoptions : []);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function getAllAdoptionByRescuer(req, res) {
	try {
		const { id } = req.params;

		const adoptions = await Adoption.find({ rescuer: id })
			.populate("pet", ["name", "images", "breed"])
			.populate("user", "name");
		res.status(200).json(adoptions ? adoptions : []);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function getAdoptionFormById(req, res) {
	try {
		const { id } = req.params;
		const adoption = await Adoption.findOne({ _id: id })
			.populate("pet", ["_id", "name", "images", "breed", "birthDate"])
			.populate("user", ["_id", "name", "email", "contactPhone"])

		const rescuer = await Rescuer.findOne({ user: adoption.rescuer })
			.select('_id user') // Selecciona los campos _id y user del rescuer
			.populate({
				path: 'user',
				select: 'name email contactPhone' // Selecciona solo los campos necesarios del usuario
			});

		adoption.rescuer = rescuer;
		res.status(200).json({ adoption });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

// function to update the adoption form result
export async function reviewAdoptionForm(req, res) {
	try {
		const { id } = req.params;
		const adoption = await Adoption.findById(id);
		if (!adoption) {
			return res.status(404).json({ error: "Adoption form not found" });
		}
		adoption.result = req.body.result;
		await adoption.save();
		res.status(200).json(`Updated successfully to: ${adoption.result}`);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

// verify if the user has sent an adoption form for a pet
// TODO: maybe should check if the adoption status is not rejected or accepted too 
export async function hasSentAdoptionForm(req, res) {
	try {
		const { userId, petId } = req.params;
		const adoption = await Adoption.findOne({ user: userId, pet: petId }).select('_id');
		res.status(200).json(adoption ? true : false);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

// function to delete all the adoptions from a user
// also deletes the chat associated with the adoption
// can be used when the user deletes his account
export async function DeleteAllAdoptionFormsFromUser(userId) {
	try {
		const adoptions = await Adoption.find({ user: userId });
		const chats = adoptions.map(async adoption => {
			await Chat.deleteOne({ _id: adoption.chat });
		});
		await Promise.all(chats);
		await Adoption.deleteMany({ user: userId });
		console.log('All adoptions deleted');
	} catch (error) {
		console.error('Error deleting adoptions', error);
	}
}

// function to check if the user has an adoption form for a pet
// if it has, also should check if the adoption status is not pending, on review or cancelled
const userHasSentAdoptionForm = async (userId, petId) => {
	const adoption = await Adoption.findOne({ user: userId, pet: petId, result: { $nin: ['pending', 'on review', 'cancelled'] } });
	return adoption ? true : false;
}