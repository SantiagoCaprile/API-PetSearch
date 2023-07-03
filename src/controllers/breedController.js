const Breed = require("../models/breed");

async function getBreedsBySpecies(req, res) {
  try {
    const { species } = req.params;

    const existingSpecies = await Breed.findOne({ species });
    if (!existingSpecies) {
      return res.status(404).json({ error: "La especie no existe." });
    }

    res.json(existingSpecies.breeds);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las razas." });
  }
}

async function addBreed(req, res) {
  try {
    const { species } = req.params;
    const { breed } = req.body;

    const existingSpecies = await Breed.findOne({ species });
    if (!existingSpecies) {
      return res.status(404).json({ error: "La especie no existe." });
    }

    if (existingSpecies.breeds.includes(breed)) {
      return res.status(409).json({ error: "La raza ya existe." });
    }

    existingSpecies.breeds.push(breed);
    await existingSpecies.save();

    res.json(existingSpecies);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la raza." });
  }
}

async function createSpecies(req, res) {
  try {
    const { species, breeds } = req.body;

    const existingSpecies = await Breed.findOne({ species });
    if (existingSpecies) {
      return res.status(409).json({ error: "La especie ya existe." });
    }

    const newSpecies = new Breed({ species, breeds });
    await newSpecies.save();

    res.status(201).json(newSpecies);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la especie." });
  }
}

module.exports = {
  getBreedsBySpecies,
  addBreed,
  createSpecies,
};
