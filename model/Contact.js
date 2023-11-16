const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
    {
        keyname: {
            type: String,
            required: true,
        },
        value: {
            type: String,
        },
        norder: {
            type: Number,
        },
        added_by: {
            type: String,
        },
        updated_by: {
            type: String,
        },
    },
    {
        timestamps: true, // Tự động thêm created_at và updated_at
    },
);

contactSchema.pre("save", async function (next) {
    if (!this.norder) {
        const highestNorder = await this.constructor.findOne().sort({ norder: -1 });
        this.norder = highestNorder ? highestNorder.norder + 1 : 1;
    } else {
        this.norder = 0;
    }

    next();
});

module.exports = mongoose.model("Contact", contactSchema);
