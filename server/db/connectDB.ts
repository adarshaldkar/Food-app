// adarshaldkar
// xJdY1BOHnqgZqmsh
// xJdY1BOHnqgZqmsh
// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://adarshaldkar:xJdY1BOHnqgZqmsh@cluster0.4tiis.mongodb.net/');
//         console.log('mongoDB connected.');
//     } catch (error) {
//         console.log("error");
//     }
// }
// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('mongoDB connected.');
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;