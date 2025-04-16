"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Import kiểu dữ liệu cho Request và Response
const baiviet_controller_1 = require("../controllers/baiviet.controller");
const router = express_1.default.Router();
// Route để lấy danh sách bài viết
router.get('/baiviet', baiviet_controller_1.getPosts);
// Route để lấy bài viết theo ID
router.get('/baiviet/:id', baiviet_controller_1.getPostById);
// Route để đăng bài viết mới
router.post('/baiviet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, baiviet_controller_1.createPost)(req, res); // Gọi hàm createPost trong controller
    }
    catch (error) {
        res.status(500).json({ error: 'Lỗi khi đăng bài viết' });
    }
}));
// Route để cập nhật bài viết
router.patch('/baiviet/:id', baiviet_controller_1.updatePost);
// Route để xóa bài viết
router.delete('/baiviet/:id', baiviet_controller_1.deletePost);
exports.default = router;
