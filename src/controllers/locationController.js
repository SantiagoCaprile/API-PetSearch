import { Location, Province } from "../models/locations.js";

export async function getActiveProvinces(req, res) {
    const provinces = await Province.find({ active: true });
    res.json(provinces);
}

export async function getActiveLocations(req, res) {
    const locations = await Location.find({ active: true });
    res.json(locations);
}

export async function getLocationsByProvince(req, res) {
    const province = req.params.province;
    const locations = await Location.find({ admin: province, active: true });
    res.json(locations);
}

export async function putActivateProvince(req, res) {
    const provinceName = req.params.province;
    await Province.findOneAndUpdate(
        { name: provinceName },
        { active: true }
    );
    res.json({ message: "Provincia activada" });
}

export async function getProvinces(req, res) {
    try {
        const provinces = await Province.find();
        res.json(provinces);
    } catch (error) {
        console.log(error);
    }
}

export async function getLocations(req, res) {
    const locations = await Location.find();
    if (!locations) {
        return res.status(400).json({ message: "No hay localidades" });
    }

    res.json(locations);
}

export async function postLocation(req, res) {
    const { admin, name, lat, lng } = req.body;
    //check if province admin exists
    const province = await Province.findOne({ name: admin });
    if (!province) {
        return res.status(400).json({ message: "Provincia no encontrada" });
    }
    const location = new Location({ admin, name, lat, lng });
    await location.save();
    res.json(location);
}

export async function putEditLocation(req, res) {
    const locationId = req.params.id;
    const { admin, name, lat, lng } = req.body;
    await Location.findByIdAndUpdate(locationId, { admin, name, lat, lng });
    res.json({ message: "Localidad actualizada" });
}