import { Router } from "express";
const router = Router();

import {
    getActiveProvinces,
    getActiveLocations,
    getProvinces,
    getLocations,
    postLocation,
    putEditLocation,
    getLocationsByProvince,
    putChangeActiveProvince,
    putChangeActiveLocation
} from "../controllers/locationController.js";
import { validateApiKey } from "../middlewares/apiKeyMiddleware.js";
import { authorizeRole } from "../middlewares/roleAuthMiddleware.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

// Rutas para obtener la lista de provincias y localidades
router.get("/locations/provinces", getActiveProvinces);

// Rutas para obtener la lista de provincias y localidades
router.get("/locations", validateApiKey, getActiveLocations);

// Ruta para obtener las localidades de una provincia
router.get("/locations/:province", validateApiKey, getLocationsByProvince);

//RUTAS PARA ADMIN
//Ruta de admin para obtener todas las provincias (activas e inactivas)
router.get("/admin/provinces", validateApiKey, authorizeRole("admin"), authenticateToken, getProvinces);

//Ruta de admin para obtener todas las localidades (activas e inactivas)
router.get("/admin/locations", validateApiKey, authorizeRole("admin"), authenticateToken, getLocations);

//Ruta para agregar una localidad
router.post("/admin/locations", validateApiKey, authorizeRole("admin"), authenticateToken, postLocation);

// Ruta para activar una provincia
router.put("/admin/provinces/:id/activate", validateApiKey, authorizeRole("admin"), authenticateToken, putChangeActiveProvince);

// Ruta para editar una localidad
router.put("/admin/locations/:id", validateApiKey, authorizeRole("admin"), authenticateToken, putEditLocation);

// Ruta para activar una localidad
router.put("/admin/locations/:id/activate", validateApiKey, authorizeRole("admin"), authenticateToken, putChangeActiveLocation);

export default router;