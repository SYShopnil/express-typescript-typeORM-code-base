import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.post("/create", userController.registration.bind(userController));
router.get("/single/:id", userController.getUserById.bind(userController));

export default router;
