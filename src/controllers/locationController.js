import { Location, Province } from "../models/locations.js";

export async function getProvinces(req, res) {
    const provinces = await Province.find({ active: true });
    res.json(provinces);
}

export async function getLocations(req, res) {
    const locations = await Location.find();
    res.json(locations);
}

export async function getLocationsByProvince(req, res) {
    const province = req.params.province;
    const locations = await Location.find({ admin: province });
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