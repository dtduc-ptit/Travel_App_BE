"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const phongtuc_controller_1 = require("../controllers/phongtuc.controller");
const router = express_1.default.Router();
router.get('/', phongtuc_controller_1.getAllPhongTuc);
router.get('/noibat', phongtuc_controller_1.getNoiBatPhongTuc);
router.post('/', phongtuc_controller_1.createPhongTuc);
router.patch('/:id', phongtuc_controller_1.updatePhongTuc);
exports.default = router;
