import { Router } from "express";
import {
  submitJson,
  getJsons
} from "../controllers/user";
import { isAuth } from "../../middleware/isAuth";

const router = Router();

router.get("/jsons", isAuth, getJsons);

// router.get("/json:id", isAuth, getJson);

router.post("/json", isAuth, submitJson);

export default router;

