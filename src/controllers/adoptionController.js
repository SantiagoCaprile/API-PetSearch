import Adoption from "../models/adoptionForm.js";
import Pet from "../models/pet.js";
import { Chat } from "../models/chat.js";

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
		const adoption = await Adoption.findById(id)
			.populate("pet", ["_id", "name", "images", "breed", "birthDate"])
			.populate("user", ["_id", "name", "email", "contactPhone"]);
		// if (!Chat.findOne({ adoptionForm: adoption._id })) {
		// 	const chat = await Chat.create({
		// 		adoptionForm: adoption._id,
		// 		messages: [],
		// 	});
		// 	console.log(chat);
		// }
		res.status(200).json({ adoption });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function reviewAdoptionForm(req, res) {
	// can be used to update the adoption form result
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

export async function hasSentAdoptionForm(req, res) {
	try {
		const { userId, petId } = req.params;
		const adoption = await Adoption.findOne({ user: userId, pet: petId }).select('_id');
		res.status(200).json(adoption ? true : false);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}