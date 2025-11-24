import { Data } from "../config/authdb.js";
import { v2 as cloudinary } from 'cloudinary';
import transporter from "../config/nodemailer.js";

// post data for admin
export const addData = async (req, res) => {
    try {
        const { title, area, rent, pincode, bhk, contact, availability, address } = req.body;
        const file = req.file;
        if (!title || !area || !rent || !pincode || !bhk || !contact || !availability || !address || !file) {
            return res.status(400).json({ success: false, message: "Please provide title, area, rent, pincode, bhk, contact, availability, address and file..." });
        }
        let result = new Data({ userId: req.user._id, userEmail: req.user.email, title, area, rent, pincode, bhk, contact, availability, address, fileName: file.originalname, url: file.path, public_id: file.filename });
        let data = await result.save();
        return res.status(200).json({ success: true, message: "all Data inserted...", data });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// get all data for admin
export const getData = async (req, res) => {
    try {
        const price = req.query.sort
        let sorted = {};
        if (price === "asc") {
            sorted.rent = 1
        }
        if (price === "desc") {
            sorted.rent = -1
        }

        let result = await Data.find({ userId: req.user._id }).sort(sorted);
        return res.status(200).json({ success: true, message: "all Data...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// get single data for admin
export const getSingleData = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await Data.findOne({ _id: id, userId: req.user._id });
        return res.status(200).json({ success: true, message: "Single Data...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}


// update single data for admin
export const updateData = async (req, res) => {
    try {
        let id = req.params.id;
        const { title, area, rent, pincode, bhk, contact, availability, address } = req.body;

        let newfileName = "";
        let newURL = "";
        let newPublic_id = "";
        if (req.file) {
            newfileName = req.file.originalname;
            newURL = req.file.path;
            newPublic_id = req.file.filename;
            try {
                cloudinary.uploader.destroy(req.body.public_id);
                console.log("file is delete in update...");
            }
            catch (err) {
                console.log("file is not delete in update...");
            }
        }
        else {
            newfileName = req.body.fileName;
            newURL = req.body.fileurl;
            newPublic_id = req.body.public_id;
        }
        let result = await Data.updateOne({ _id: id, userId: req.user._id }, { $set: { title, area, rent, pincode, bhk, contact, availability, address, fileName: newfileName, url: newURL, public_id: newPublic_id } });
        return res.status(200).json({ success: true, message: "data updated...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}


// delete single data for admin
export const deleteData = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await Data.findOneAndDelete({ _id: id, userId: req.user._id });
        try {
            cloudinary.uploader.destroy(result.public_id);
            console.log("file is delete in delete...");
        }
        catch (err) {
            console.log("file is not delete in delete...");
        }
        return res.status(200).json({ success: true, message: "data deleted...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}


// search data for admin
export const searchAdminData = async (req, res) => {
    try {
        let query = req.params.key;
        let result = await Data.find({
            userId: req.user._id,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { bhk: { $regex: query, $options: "i" } },
                { address: { $regex: query, $options: "i" } }
            ]
        });
        return res.status(200).json({ success: true, message: "search admin data...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// getAllData for customer
export const getAllCustomerData = async (req, res) => {
    try {
        const price = req.query.sort
        let sorted = {};
        if (price === "asc") {
            sorted.rent = 1
        }
        if (price === "desc") {
            sorted.rent = -1
        }
        let result = await Data.find({}).sort(sorted);
        return res.status(200).json({ success: true, message: "getAllCustomerData...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// search data for customer
export const searchCustomerData = async (req, res) => {
    try {
        let query = req.params.key;
        let result = await Data.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { bhk: { $regex: query, $options: "i" } },
                { address: { $regex: query, $options: "i" } }
            ]
        });
        return res.status(200).json({ success: true, message: "search customer data...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// getSingleData for customer
export const getSingleCustomerData = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await Data.findOne({ _id: id });
        return res.status(200).json({ success: true, message: "getSingleCustomerData...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// for send Email to admin
export const sendEmail = async (req, res) => {
    try {
        const { userEmail, name, phone, address, dataId } = req.body;
        if (!userEmail || !name || !phone || !address || !dataId) {
            return res.status(400).json({ success: false, message: "Please provide userEmail, name, phone, address and dataId..." });
        }
        let result = await Data.findOne({ _id: dataId });
        result.availability = "Unavailable";
        await result.save();
        // console.log(result);
        let mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: userEmail,
            subject: `You received a message via your MERN project`,
            html: `<div
        style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border-radius: 10px; background-color: #f9f9f9; overflow: hidden;">
        <div style="background-color: #52c956ff; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">MERN Message</h1>
        </div>
        <div style="padding: 20px;">
            <h2 style="color: #4CAF50; font-size: 20px; text-align:center;">your got a message from ${name}, phone: ${phone} and address: ${address}.</h2>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            This message was sent from MERN project.
        </div>
    </div>`
        }
        let data = await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "message send successfully...", result });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}
