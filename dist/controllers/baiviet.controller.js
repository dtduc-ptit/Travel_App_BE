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
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getPosts = void 0;
const baiviet_model_1 = require("../models/baiviet.model");
const nguoidung_model_1 = require("../models/nguoidung.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Lấy tất cả bài viết
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield baiviet_model_1.BaiViet.find().populate('nguoiDung');
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy bài viết' });
    }
});
exports.getPosts = getPosts;
// Lấy bài viết theo ID
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield baiviet_model_1.BaiViet.findById(id).populate('nguoiDung');
        if (!post) {
            res.status(404).json({ error: 'Bài viết không tồn tại' });
            return;
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy bài viết theo ID' });
    }
});
exports.getPostById = getPostById;
// Tạo bài viết mới
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, hinhAnh, video, nguoiDungId } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(nguoiDungId)) {
        return res.status(400).json({ error: 'Người dùng không hợp lệ' });
    }
    try {
        const nguoiDung = yield nguoidung_model_1.NguoiDung.findById(nguoiDungId);
        if (!nguoiDung) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        const newPost = new baiviet_model_1.BaiViet({
            noiDung: content,
            hinhAnh,
            video,
            nguoiDung: nguoiDungId,
        });
        const savedPost = yield newPost.save();
        res.status(201).json(savedPost);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo bài viết' });
    }
});
exports.createPost = createPost;
// Cập nhật bài viết
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content, hinhAnh, nguoiDungId } = req.body;
    try {
        const post = yield baiviet_model_1.BaiViet.findById(id);
        if (!post) {
            res.status(404).json({ error: 'Bài viết không tồn tại' });
            return;
        }
        post.noiDung = content || post.noiDung;
        post.hinhAnh = hinhAnh || post.hinhAnh;
        post.nguoiDung = nguoiDungId || post.nguoiDung;
        const updatedPost = yield post.save();
        res.json(updatedPost);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật bài viết' });
    }
});
exports.updatePost = updatePost;
// Xóa bài viết
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield baiviet_model_1.BaiViet.findById(id);
        if (!post) {
            res.status(404).json({ error: 'Bài viết không tồn tại' });
            return;
        }
        yield post.deleteOne();
        res.json({ message: 'Bài viết đã được xóa' });
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa bài viết', details: err });
    }
});
exports.deletePost = deletePost;
