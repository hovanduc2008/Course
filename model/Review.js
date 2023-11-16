const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userId: {
            type: String,
            require: true,
        },
        courseId: {
            type: String,
            require: true,
        },
        description: {
            type: String,
        },
        star: {
            type: Number,
            require: true,
        },
        refreshToken: String,
    },
    {
        timestamps: true, // Tự động thêm created_at và updated_at
    },
);

module.exports = mongoose.model("Review", userSchema);
