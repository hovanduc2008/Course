const Contact = require("../model/Contact");

const getAllContact = async function (req, res) {
    const contacts = await Contact.find().sort({ norder: -1 });
    if (!contacts) return res.status(204).json({ message: "No contacts found." });
    res.json(contacts);
};

const createContact = async function (req, res) {
    const { keyname, value } = req.body;

    if (!keyname || !value)
        return res.status(401).json({ message: "Keyname or value is required." });

    const foundContact = await Contact.findOne({ keyname: keyname });
    if (foundContact) return res.status(401).json({ message: "Keyname already exists" });

    try {
        const rs = await Contact.create({
            keyname,
            value,
            added_by: req.userId,
            updated_by: req.userId,
        });
        return res.status(201).json({
            message: "Created successfully",
            data: rs,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Lỗi 500",
            error: err.message,
        });
    }
};

const getContact = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    try {
        const contact = await Contact.findOne({ _id: req.params.id });

        if (!contact) {
            return res.status(204).json({ message: `No contact matches ID ${req.params.id}.` });
        }

        return res.json({ message: "Successfully", data: contact });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateContact = async function (req, res) {
    const { keyname, value } = req.body;
    if (!keyname || !value)
        return res.status(401).json({ message: "Keyname or value is required." });

    const foundContact = await Contact.findOne({ keyname: keyname });
    if (foundContact && keyname != foundContact.keyname)
        return res.status(401).json({ message: "Keyname already exists" });

    try {
        const rs = await Contact.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    keyname,
                    value,
                    norder: req.body.norder,
                },
            },
            { new: true },
        );

        return res.status(200).json({
            message: "Updated successfully",
            data: rs,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Lỗi 500",
            error: err.message,
        });
    }
};

const deleteContact = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    try {
        const contact = await Contact.findOneAndDelete({ _id: req.params.id });

        if (!contact) {
            return res.status(204).json({ message: `No contact matches ID ${req.params.id}.` });
        }

        return res.json({ message: "Xóa thành công", data: contact });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllContact,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};
