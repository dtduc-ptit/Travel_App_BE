"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
// 2. Schema định nghĩa cấu trúc lưu trong MongoDB
const mediaSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['image', 'video'],
        required: [true, 'Trường "type" là bắt buộc'],
    },
    url: {
        type: String,
        required: [true, 'Trường "url" là bắt buộc'],
        validate: {
            validator: (v) => validator_1.default.isURL(v),
            message: (props) => `"${props.value}" không phải là một URL hợp lệ`,
        },
    },
    doiTuong: {
        type: String,
        enum: ['SuKien', 'DTTich', 'PhongTuc'],
        required: [true, 'Trường "doiTuong" là bắt buộc'],
    },
    doiTuongId: {
        type: String,
        required: [true, 'Trường "doiTuongId" là bắt buộc'],
        refPath: 'doiTuong',
    },
    moTa: {
        type: String,
        maxlength: [100000, 'Mô tả không được vượt quá 100000 ký tự'],
    },
}, {
    timestamps: true, // Tự động thêm createdAt & updatedAt
});
// 3. Tạo model
exports.Media = mongoose_1.default.model('media', mediaSchema);
