import Tag from "../models/tag.js";
import { saveImageInFs, deleteImageFromFs } from "../utils/images.js";

//ver si el tag esta registrado (todos) [GET]
export async function isRegistered(req, res) {
    const { id } = req.params;
    try {
        const tagFounded = await Tag.findById(id);
        if (!tagFounded) {
            return res.status(404).json({ message: "Tag not found" });
        }
        if (tagFounded.user) {
            return res.status(200).json({ registered: true });
        }
        res.status(200).json({ registered: false });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//una ruta para crear un tag vacio [POST]
export async function createTag(req, res) {
    try {
        //the tag created is empty, we only need to generate the id
        const tag = new Tag();
        await tag.save();
        res.status(201).json({ message: "Tag created", tagId: tag._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//una ruta para registrar un usuario a un tag [PUT]
export async function linkUserToTag(req, res) {
    try {
        const { id } = req.params;
        const { userId, data } = req.body;
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        tag.user = userId;
        Object.keys(data).forEach(key => {
            if (key === "_id" || key === "user" || key === "image") {
                return;
            }
            tag[key] = data[key];
        });
        if (data.image) {
            //save the image in fs
            const imageName = `${tag._id}-${Date.now().toString().slice(0, 10)}.webp`;
            const folder = "tags";

            //delete the old image if it exists
            if (tag.image) {
                const oldImageName = tag.image.split("/").pop();
                const deleted = await deleteImageFromFs(oldImageName, folder);
                if (!deleted) {
                    return res.status(500).json({ message: "Error deleting image" });
                }
            }

            //save the new image
            const saved = await saveImageInFs(data.image, imageName, folder, 300, 80);
            if (!saved) {
                return res.status(500).json({ message: "Error saving image" });
            }
            tag.image = `http://localhost:4000/uploads/${folder}/${imageName}`;
        }
        await tag.save();
        res.status(200).json({ message: "User linked to tag", updateCount: 1 });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

//una ruta para ver la data de la mascota [GET]
export async function getTagData(req, res) {
    try {
        const tag = await Tag.findById(req.params.id).populate("user", "name");
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.status(200).json(tag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//una ruta para desvincular el tag de la mascota. [PUT]
export async function unlinkUserToTag(req, res) {
    try {
        //clears all the data from the tag leaving only the id
        const { id } = req.params;
        const tagFounded = await Tag.findById(id);
        if (!tagFounded) {
            return res.status(404).json({ message: "Tag not found" });
        }
        //delete the image
        const oldImageName = tagFounded.image.split("/").pop();
        const folder = "tags";
        await deleteImageFromFs(oldImageName, folder);
        Tag.deleteOne({ _id: id }).then(() => {
            Tag.create({ _id: id });
        });
        res.status(200).json({ message: "Tag unlinked" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getTagsList(req, res) {
    try {
        const tags = await Tag.find().select("_id user");
        let registeredTags = 0;
        tags.forEach(tag => {
            if (tag.user) {
                registeredTags++;
            }
        });
        res.status(200).json({
            length: tags.length,
            registered: registeredTags,
            unregistered: tags.length - registeredTags,
            tags: tags
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getUserTags(req, res) {
    const userId = req.params.id;
    try {
        const tags = await Tag.find({ user: userId });
        res.status(200).json(tags);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function addHealthHistory(req, res) {
    try {
        const { medicine, dateApplied, details, nextApplication } = req.body;
        const tag = await Tag.findById(req.params.id);
        tag.healthHistory.push({ medicine, dateApplied, details, nextApplication });
        await tag.save();
        res.status(201).json(tag.healthHistory[tag.healthHistory.length - 1]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteHealthHistory(req, res) {
    try {
        const tagId = req.params.id;
        const tag = await Tag.findById(tagId);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        const entryId = req.params.entryId;
        const entry = tag.healthHistory.id(entryId);
        if (!entry) {
            return res.status(404).json({ error: 'Health history entry not found' });
        }
        tag.healthHistory.pull(entryId);
        await tag.save();
        res.status(200).json({ message: 'Health history entry deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};