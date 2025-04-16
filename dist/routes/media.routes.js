"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const media_controller_1 = require("../controllers/media.controller");
const router = express_1.default.Router();
router.post('/', media_controller_1.createMedia);
router.get('/:id', media_controller_1.getMediaById);
router.patch('/:id', media_controller_1.updateMedia);
router.get("/", media_controller_1.getMediaByDoiTuong); // GET /api/media?doiTuong=PhongTuc&doiTuongId=65fabc...&type=image
exports.default = router;
