import cron from 'node-cron';
import { User } from '../config/authdb.js';


const deleteUnverifiedUser = () => {
    cron.schedule('*/10 * * * *', async () => {
        try {
            let result = await User.deleteMany({
                $and: [
                    { isAccountVerified: false },
                    { updatedAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } }
                ]
            })
            console.log("unverified user is deleted...");
        }
        catch (err) {
            console.log("user not delete...", err.message);
        }

    });
}
export default deleteUnverifiedUser;
