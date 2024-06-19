import { Router } from "express";
const router = Router();

import {
    getProvinces,
    getLocations,
    getLocationsByProvince,
    putActivateProvince
} from "../controllers/locationController.js";
import { validateApiKey } from "../middlewares/apiKeyMiddleware.js";

// Rutas para obtener la lista de provincias y localidades
router.get("/locations/provinces", getProvinces);

// Rutas para obtener la lista de provincias y localidades
router.get("/locations", validateApiKey, getLocations);

// Ruta para obtener las localidades de una provincia
router.get("/locations/:province", validateApiKey, getLocationsByProvince);

// Ruta para activar una provincia
router.put("/locations/provinces/:province", putActivateProvince);

export default router;