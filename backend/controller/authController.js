import { User } from "../config/authdb.js";
import transporter from "../config/nodemailer.js";
import Jwt from 'jsonwebtoken';

// signup
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide name, email and password..." });
        }
        let existUser = await User.findOne({ email });
        if (existUser && existUser.isAccountVerified) {
            return res.status(400).json({ success: false, message: "User already exist..." });
        }
        if (existUser && !existUser.isAccountVerified) {
            let otp = String(Math.floor(100000 + Math.random() * 900000));
            let expireAt = Date.now() + 10 * 60 * 1000;
            existUser.name = name;
            existUser.password = password;
            existUser.verifyEmailOtp = otp;
            existUser.verifyEmailOtpExpireAt = expireAt;
            let user = await existUser.save();
            // console.log("old: ",user);
            let mailOptions = {
                from: process.env.SMTP_EMAIL,
                to: existUser.email,
                subject: `You received a message via your MERN project`,
                html: `<div
        style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border-radius: 10px; background-color: #f9f9f9; overflow: hidden;">
        <div style="background-color: #52c956ff; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">Mern Auth OTP</h1>
        </div>
        <div style="padding: 20px;">
            <h2 style="color: #4CAF50; font-size: 20px; text-align:center;">your OTP for verify account is:</h2>
            <p
                style="text-align: center; margin-top: 20px;background-color: #4CAF50;width:150px;font-size:25px;font-weight:bold;color:white;margin: auto;border-radius:8px;">
                ${otp}
            </p>
            <p style="text-align:center; margin-top:15px; color:#777; font-size:16px;">
      This OTP will expire in <strong>10 minutes</strong>.
    </p>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            This message was sent from MERN-Auth project.
        </div>
    </div>`
            }
            await transporter.sendMail(mailOptions);
            // console.log(existUser);
            return res.status(200).json({ success: true, message: "OTP send to your Email...", user });
        }

        let otp = String(Math.floor(100000 + Math.random() * 900000));
        let expireAt = Date.now() + 10 * 60 * 1000;
        let user = new User({ name, email, password, verifyEmailOtp: otp, verifyEmailOtpExpireAt: expireAt })
        await user.save();
        let mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: `You received a message via your MERN project`,
            html: `<div
        style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border-radius: 10px; background-color: #f9f9f9; overflow: hidden;">
        <div style="background-color: #52c956ff; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">Mern Auth OTP</h1>
        </div>
        <div style="padding: 20px;">
            <h2 style="color: #4CAF50; font-size: 20px; text-align:center;">your OTP for verify account is:</h2>
            <p
                style="text-align: center; margin-top: 20px;background-color: #4CAF50;width:150px;font-size:25px;font-weight:bold;color:white;margin: auto;border-radius:8px;">
                ${otp}
            </p>
            <p style="text-align:center; margin-top:15px; color:#777; font-size:16px;">
      This OTP will expire in <strong>10 minutes</strong>.
    </p>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            This message was sent from MERN-Auth project.
        </div>
    </div>`
        }
        await transporter.sendMail(mailOptions);
        // console.log(user);
        return res.status(200).json({ success: true, message: "OTP send to your Email...", user });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// verify account
export const verifyAccount = async (req, res) => {
    try {
        const { email, verifyEmailOtp } = req.body;
        if (!email || !verifyEmailOtp) {
            return res.status(400).json({ success: false, message: "Please provide email and OTP..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email, signup again..." });
        }
        if (user && user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Email already verified..." });
        }
        if (user.verifyEmailOtp !== verifyEmailOtp || user.verifyEmailOtp === "") {
            return res.status(400).json({ success: false, message: "Invalid OTP..." });
        }
        if (user.verifyEmailOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired..." });
        }

        user.verifyEmailOtp = "";
        user.verifyEmailOtpExpireAt = 0;
        user.isAccountVerified = true;
        await user.save();
        user = user.toObject();
        delete user.password;
        delete user.verifyEmailOtp;
        delete user.resetPasswordOtp;
        let token = Jwt.sign({ id: user._id }, process.env.JWT_KEY);
        return res.status(200).json({ success: true, message: "User signup successfully...", user, auth: token });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// login account
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email..." });
        }
        if (user && user.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid Password..." });
        }
        if (!user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "you can't login because this account is not verified, signup again..." });
        }
        user = user.toObject();
        delete user.password;
        delete user.verifyEmailOtp;
        delete user.resetPasswordOtp;
        
        let token = Jwt.sign({ id: user._id }, process.env.JWT_KEY);
        return res.status(200).json({ success: true, message: "User login successfully...", user, auth: token });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// send otp for reset password
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide email..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email..." });
        }
        if (user && !user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "you can't send Email because this account is not verified, signup again..." });
        }

        let otp = String(Math.floor(100000 + Math.random() * 900000));
        let expireAt = Date.now() + 10 * 60 * 1000;

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpireAt = expireAt;
        await user.save();

        let mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: `You received a message via your MERN project`,
            html: `<div
        style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border-radius: 10px; background-color: #f9f9f9; overflow: hidden;">
        <div style="background-color: #52c956ff; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">Mern Auth OTP</h1>
        </div>
        <div style="padding: 20px;">
            <h2 style="color: #4CAF50; font-size: 20px; text-align:center;">your OTP for reset password is:</h2>
            <p
                style="text-align: center; margin-top: 20px;background-color: #4CAF50;width:150px;font-size:25px;font-weight:bold;color:white;margin: auto;border-radius:8px;">
                ${otp}
            </p>
            <p style="text-align:center; margin-top:15px; color:#777; font-size:16px;">
      This OTP will expire in <strong>10 minutes</strong>.
    </p>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            This message was sent from Mern-Auth project.
        </div>
    </div>`
        }
        await transporter.sendMail(mailOptions);
        // console.log(user);
        return res.status(200).json({ success: true, message: "OTP send to your Email for reset password...", user });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}

// for reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, resetPasswordOtp, newPassword } = req.body;

        if (!email || !resetPasswordOtp || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide email, OTP and new Password..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email..." });
        }
        if (user && !user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "you can't reset password because this account is not verified, signup again..." });
        }
        if (user.resetPasswordOtp !== resetPasswordOtp || user.resetPasswordOtp == "") {
            return res.status(400).json({ success: false, message: "Invalid OTP..." });
        }
        if (user.resetPasswordOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired..." });
        }

        user.resetPasswordOtp = "";
        user.resetPasswordOtpExpireAt = 0;
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ success: true, message: "Password Updated...", user });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "something went wrong...", error: err.message });
    }
}
