import express from "express";
import { searchPodcasts, getRanked } from "../controllers/podcastController.js";

const router = express.Router();

router.get("/search/:query", searchPodcasts);
router.get("/ranked", getRanked);

export default router;