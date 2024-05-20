import mongoose, { mongo } from "mongoose";
const itemConsumedCalorie = new mongoose.Schema({
    itemConsume:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodItems"
    },
    quantity:{
        type:Number,
        required:true,
    }
})
const dailyData = new mongoose.Schema({
    date: {
        type: String,
    },
    consumedQUantity:{
        type:[itemConsumedCalorie],    
    }
},{timestamps:true})

export default mongoose.model("DailyData",dailyData);