// adarshaldkar
// xJdY1BOHnqgZqmsh
// xJdY1BOHnqgZqmsh
// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         
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