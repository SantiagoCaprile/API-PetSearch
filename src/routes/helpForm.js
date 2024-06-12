import { Router } from "express";
const router = Router();

import {
    createHelpForm,
    getHelpFormsByUserId,
    getHelpFormByCity,
} from "../controllers/helpFormController.js";
import { validateApiKey } from "../middlewares/apiKeyMiddleware.js";

// Route to create a new help form
router.post("/help-forms", validateApiKey, createHelpForm);

// Route to get all help forms by user id
router.get("/help-forms/:userId", validateApiKey, getHelpFormsByUserId);

// Route to get all help forms by city
router.get("/help-forms/city/:city", validateApiKey, getHelpFormByCity);

export default router;