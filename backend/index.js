import express from 'express';
import cors from 'cors';
import "dotenv/config";
import deleteUnverifiedUser from './deleteUnverifiedUser/deleteUnverifiedUser.js';
import authRoute from './route/authRoute.js';
import dataRoute from './route/dataRoute.js';

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(cors({
    origin:"http://localhost:5173"
}));

app.get("/",(req,res)=>{
    res.send("Api Working...");
});

// for authroute
app.use("/auth",authRoute);

// for dataroute
app.use("/data",dataRoute);

deleteUnverifiedUser();

app.listen(port,()=>{
    console.log(`server is running on port ${port}...`);
});
