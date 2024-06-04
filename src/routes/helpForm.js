import { Router } from "express";
const router = Router();

import {
    createHelpForm,
    getHelpFormsByUserId,
    getHelpFormByCity,
} from "../controllers/helpFormController.js";

// Route to create a new help form
router.post("/help-forms", createHelpForm);

// Route to get all help forms by user id
router.get("/help-forms/:userId", getHelpFormsByUserId);

// Route to get all help forms by city
router.get("/help-forms/city/:city", getHelpFormByCity);

export default router;