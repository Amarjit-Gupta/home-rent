import mongoose from "mongoose";

if(!mongoose.connection.readyState){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("database connected...");
    }).catch((err)=>{
        console.log("connection failed...",err.message);
    });
}

// for auth
const userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    verifyEmailOtp:{type:String,default:""},
    verifyEmailOtpExpireAt:{type:Number,default:0},
    isAccountVerified:{type:Boolean,default:false},
    resetPasswordOtp:{type:String,default:""},
    resetPasswordOtpExpireAt:{type:Number,default:0},
},{timestamps:true});

const User = mongoose.models.User || mongoose.model("HomerentUser",userSchema);

export {User};


// for data
const dataSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"HomerentUser"},
    userEmail:{type:String},
    title:{type:String},
    area:{type:Number},
    rent:{type:Number},
    pincode:{type:Number},
    bhk:{type:String},
    contact:{type:Number},
    availability:{type:String},
    address:{type:String},
    fileName:{type:String},
    url:{type:String},
    public_id:{type:String},
},{timestamps:true});

const Data = mongoose.models.Data || mongoose.model("HomerentData",dataSchema);

export {Data};