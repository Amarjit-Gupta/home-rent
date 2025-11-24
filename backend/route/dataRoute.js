import express from 'express';
import Jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { addData, deleteData, getAllCustomerData, getData, getSingleCustomerData, getSingleData, searchAdminData, searchCustomerData, sendEmail, updateData } from '../controller/dataController.js';
import { User } from '../config/authdb.js';

const dataRoute = express.Router();

// for check auth
const checkAuth = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.split(" ")[1];
            // console.log(token);
            let decode = Jwt.verify(token, process.env.JWT_KEY);
            // console.log("decode: ",decode);
            if (decode.id) {
                let user = await User.findOne({_id:decode.id});
                req.user = user;
                next();
            }
            else {
                return res.json({ success: false, message: "Not authorized, login again..." });
            }
        }
        else {
            return res.json({ success: false, message: "Not authorized, login again..." });
        }
    }
    catch (err) {
        return res.json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// for cloudinary

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

// console.log(process.env.CLOUD_NAME,process.env.API_KEY,process.env.API_SECRET);

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"data-folder"
    }
});

const upload = multer({storage:storage});

// for admin
dataRoute.post("/addData",upload.single("file"),checkAuth, addData);
dataRoute.get("/getData",checkAuth, getData);
dataRoute.get("/getSingleData/:id",checkAuth, getSingleData);
dataRoute.put("/updateData/:id",upload.single("file"),checkAuth, updateData);
dataRoute.delete("/deleteData/:id",checkAuth, deleteData);
dataRoute.get("/searchAdminData/:key",checkAuth, searchAdminData);

// for customer
dataRoute.get("/getAllCustomerData",getAllCustomerData);
dataRoute.get("/getSingleCustomerData/:id",getSingleCustomerData);
dataRoute.post("/sendMail",sendEmail);
dataRoute.get("/searchCustomerData/:key",searchCustomerData);

export default dataRoute;
