"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    displayName: { type: String },
    email: { type: String }
});
module.exports = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=models.js.map