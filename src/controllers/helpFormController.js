import HelpForm from '../models/helpForm.js';
import cloudinary from '../config/cloudinaryConfig.js'

export async function createHelpForm(req, res) {
    try {
        const { user, type, date, location, description, image } = req.body;
        let uploadImgUrl

        try {
            const uploadResponse = await cloudinary.v2.uploader
                .upload(image, {
                    folder: 'helpMap',
                    resource_type: 'image',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
                });
            uploadImgUrl = uploadResponse.secure_url;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }

        const helpForm = new HelpForm({
            user,
            type,
            date,
            location,
            description,
            image: uploadImgUrl,
        });

        helpForm.save().then(() => {
            return res.status(201).json(helpForm);
        }).catch((error) => {
            console.log(error);
            return res.status(500).json({ message: error.message });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export function getHelpFormsByUserId(req, res) {
    try {
        const userId = req.params.userId;
        HelpForm.find({ user: userId }, (err, helpForms) => {
            if (err) {
                return res.status(500).json({ message: err });
            }
            return res.status(200).json(helpForms);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export function getHelpFormByCity(req, res) {
    try {
        const city = req.params.city;
        HelpForm.find({
            "location.city": city
        }, (err, helpForms) => {
            if (err) {
                return res.status(500).json({ message: err });
            }
            return res.status(200).json(helpForms);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}