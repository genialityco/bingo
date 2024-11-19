import { Router } from "express";
import FirebaseController from "../controllers/firebaseController";

const router = Router();

router.get("/firebaseusers", FirebaseController.getUsers);
router.delete("/firebaseusers", FirebaseController.deleteAllUsers);

export default router;

