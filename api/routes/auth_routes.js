import express from "express";
import {signup,signin,signout} from "../controllers/auth_controllers.js";

const router = express.Router();

router.post("/signup",signup);
router.get("/signin",signin);
router.get('/signout',signout);


export default router;