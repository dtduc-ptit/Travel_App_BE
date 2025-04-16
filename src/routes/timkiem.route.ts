import express from "express";
import { timKiemTatCa } from "../controllers/timkiem.controller";

const router = express.Router();

router.get("/", timKiemTatCa); // <-- đủ rồi

export default router;
