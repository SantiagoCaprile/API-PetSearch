import Rescuer from "../models/rescuer.js";

export async function createRescuer(req, res) {
	try {
		const {
			user,
			name,
			contactEmail,
			contactPhone,
			socialMediasLinks,
			address,
			biography,
		} = req.body;

		const rescuer = await Rescuer.create({
			user,
			name,
			contactEmail,
			contactPhone,
			socialMediasLinks,
			address,
			biography,
		});
		res.status(201).json({ rescuer });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function getRescuers(req, res) {
	try {
		const rescuers = await Rescuer.find();
		res.status(200).json({ rescuers });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function getRescuerById(req, res) {
	try {
		const rescuer = await Rescuer.findById(req.params.id);
		res.status(200).json({ rescuer });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function updateRescuer(req, res) {
	try {
		const { id } = req.params;
		const {
			name,
			contactEmail,
			contactPhone,
			socialMediasLinks,
			address,
			biography,
		} = req.body;

		const rescuer = await Rescuer.findByIdAndUpdate(
			id,
			{
				name,
				contactEmail,
				contactPhone,
				socialMediasLinks,
				address,
				biography,
			},
			{ new: true }
		);

		res.status(200).json({ rescuer });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function addPetToRescuer(req, res) {
	try {
		const { id } = req.params;
		const { petId } = req.body;

		const rescuer = await Rescuer.findById(id);
		rescuer.pets.push(petId);
		await rescuer.save();

		res.status(200).json({ rescuer });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function removePetFromRescuer(req, res) {
	try {
		const { id } = req.params;
		const { petId } = req.body;

		const rescuer = await Rescuer.findById(id);
		rescuer.pets = rescuer.pets.filter((pet) => pet.toString() !== petId);
		await rescuer.save();

		res.status(200).json({ rescuer });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}
