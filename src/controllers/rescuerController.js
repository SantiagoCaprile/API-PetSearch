import Rescuer from "../models/rescuer.js";
import User from "../models/user.js";
import cloudinary from '../config/cloudinaryConfig.js'

export async function createRescuer(req, res) {
	try {
		const {
			user,
			name,
			contactEmail,
			contactPhone,
			socialMediasLinks,
			address,
			bio,
		} = req.body;

		const rescuer = await Rescuer.create({
			user,
			name,
			contactEmail,
			contactPhone,
			socialMediasLinks,
			address,
			bio,
		});
		res.status(201).json({ rescuer });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function getRescuers(req, res) {
	try {
		const rescuers = await Rescuer.find()
			.populate("user", "name email");
		res.status(200).json({ rescuers });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function getRescuerById(req, res) {
	try {
		//this will find by user id in the rescuer model
		const { id } = req.params;
		const rescuer = await Rescuer.findOne({ user: id })
			.populate("user", "name email profilePic")
		res.status(200).json({ rescuer });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function updateRescuer(req, res) {
	try {
		const { id } = req.params;
		const {
			contactPhone,
			socialMediasLinks,
			profilePic,
			city,
			bio,
		} = req.body;
		console.log(req.body);

		const rescuer = await Rescuer.updateOne(
			{ user: id },
			{
				contactPhone,
				socialMediasLinks,
				city,
				bio,
			}
		);
		if (profilePic) {
			let uploadImgUrl
			try {
				const uploadResponse = await cloudinary.v2.uploader
					.upload(profilePic, {
						folder: 'profilePics',
						resource_type: 'image',
						allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
					});
				uploadImgUrl = uploadResponse.secure_url;
			} catch (error) {
				console.log(error);
				return res.status(500).json({ message: error.message });
			}
			await User.updateOne(
				{ _id: id },
				{ profilePic: uploadImgUrl, }
			);
		}
		res.status(200).json({ rescuer });
	} catch (error) {
		console.log(error);
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
