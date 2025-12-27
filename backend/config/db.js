import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://srivaibhav63_db_user:Sri2004@cluster0.ie9q4un.mongodb.net/jobify')
    .then(()=>console.log("DB connected"))
}