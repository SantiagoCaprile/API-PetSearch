import { Router } from "express";
const router = Router();
import {
    isRegistered,
    createTag,
    linkUserToTag,
    getTagData,
    unlinkUserToTag,
    getTagsList,
    getUserTags,
    addHealthHistory,
    deleteHealthHistory
} from "../controllers/tagControllers.js"

//una ruta para ver si el tag esta registrado (todos) [GET]
router.get("/tags/check/:id", isRegistered);

//una ruta para crear un tag vacio (solo admin) [POST]
router.post("/tags", createTag);

//una ruta para registrar un usuario a un tag (debe estar loggueado) [PUT]
router.put("/tags/:id", linkUserToTag);

//una ruta para ver la data de la mascota (todos) [GET]
router.get("/tags/:id", getTagData);

//una ruta para desvincular el tag de la mascota. (solo user) [PUT]
router.put("/tags/unlink/:id", unlinkUserToTag);

//ruta para obtener lista de tags registradas (solo admins) [GET]
router.get("/tags", getTagsList);

//ruta para obtener lista de tags de un usuario (solo user) [GET]
router.get("/tags/user/:id", getUserTags);

//ruta para agregar historial de salud a un tag (solo user) [PUT]
router.put("/tags/:id/healthHistory", addHealthHistory);

router.delete("/tags/:id/healthHistory/:entryId", deleteHealthHistory);

export default router;
