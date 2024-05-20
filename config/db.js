import mongoose from "mongoose";
// mongodb://127.0.0.1:27017/calorietracker

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to MongoDB database ${conn.connection.host}`
    );
  } catch (error) {
    console.log(`error in MongoDB ${error}`);
  }
};

export default connectDB;
