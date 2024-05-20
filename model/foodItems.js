import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
   FOOD_ITEMS:{
     type:String,
     required:true
   },
   LINKS:{
     type:String,
     required:true
   },
   Type:{
     type:String,
     required:true
   },
   Protein:{
     type:Number,
     required:true
    },
    Carbohydrate:{
      type:Number,
      required:true
    },
    Calorie:{
      type:Number,
      required:true
    }
},{timestamps:true})

export default mongoose.model('FoodItems',foodItemSchema);