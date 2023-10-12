const Pet = require("../models/pet");

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
  for (const characteristic of characteristics) {
    if (!allowedCharacteristicTypes.includes(characteristic.key)) {
      return {
        valid: false,
        error: `Tipo de característica no permitido: ${characteristic.key}`,
      };
    }
  }

  return { valid: true };
}

function calculateAgeRange(age) {
  if (age.unit !== "years") {
    return "baby";
  }
  //age.unit === "years"
  if (age.number > 1 && age.number < 4) {
    return "young";
  }

  if (age.number >= 4 && age.number < 8) {
    return "adult";
  }

  if (age.number >= 8) {
    return "senior";
  }
}

async function createPet(req, res) {
  try {
    const {
      name,
      species,
      breed,
      age,
      description,
      photos,
      status,
      user,
      characteristics,
    } = req.body;

    // Validar las características
    const { valid, error } = validateCharacteristics(characteristics);
    if (!valid) {
      console.log(error);
      return res.status(400).json({ error });
    }

    const ageRange = calculateAgeRange(age);

    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      description,
      photos,
      status,
      user,
      characteristics: [
        ...characteristics,
        { key: "age range", value: ageRange },
        {
          key: "good with cats",
          value: Boolean(
            characteristics.find((c) => c.key === "good with cats")?.value
          ),
        },
        {
          key: "good with dogs",
          value: Boolean(
            characteristics.find((c) => c.key === "good with dogs")?.value
          ),
        },
        {
          key: "good with kids",
          value: Boolean(
            characteristics.find((c) => c.key === "good with kids")?.value
          ),
        },
      ],
    });

    await newPet.save();

    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la mascota." });
  }
}

async function getAllPets(req, res) {
  try {
    const pets = await Pet.find();

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las mascotas." });
  }
}

async function getPetsBySpecies(req, res) {
  try {
    const { species } = req.params;
    const { filters } = req.query;

    let filterObj = {};

    // Verificar si se proporcionaron filtros
    if (filters) {
      const filtersArray = filters.split(",");

      // Aplicar los filtros a filterObj
      filtersArray.forEach((filter) => {
        const [key, value] = filter.split(":");
        filterObj[`characteristics.${key}`] = value;
      });
    }

    const pets = await Pet.find({ species, ...filterObj }).populate("user");

    res.status(200).json(pets);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener las mascotas por especie." });
  }
}

async function getRandomAnimals(req, res) {
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

module.exports = {
  createPet,
  getAllPets,
  getPetsBySpecies,
  getRandomAnimals,
};
