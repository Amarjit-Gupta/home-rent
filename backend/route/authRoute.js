import express from 'express';
import { login, resetPassword, sendOtp, signup, verifyAccount } from '../controller/authController.js';

const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/verifyAccount", verifyAccount);
authRoute.post("/login", login);
authRoute.post("/sendOtp", sendOtp);
authRoute.post("/resetPassword", resetPassword);

export default authRoute;