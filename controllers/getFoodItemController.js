import FoodItems from "../model/foodItems.js"
import DailyData from "../model/dailyData.js"
import mongoose from "mongoose";

const getFoodItemController = async (req,res)=>{
try{
    const food = await FoodItems.find({});
    res.status(200).json({
      success: true,
      message: "All foodList",
      data:food,
    });
}
catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting food items",
    });
}  
};


const addFoodItemController = async (req,res)=>{
  try{
      const { FOOD_ITEMS, LINKS, Type, Protein, Carbohydrate, Calorie, Unit, Term } = req.body;
      const newFoodData = await FoodItems.create({
        FOOD_ITEMS, 
        LINKS, 
        Type, 
        Protein, 
        Carbohydrate, 
        Calorie, 
        Unit, 
        Term
      });

      res.status(201).json({
        success: true,
        message: 'New Food item created successfully',
        data: newFoodData,
      });
  }
  catch(error){
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in getting food items",
      });
  }  
  };




const saveDailyConsumptionController = async(req,res)=>{
     try {
      // console.log(req.body);
      const { date, foodItems, calorieIntake } = req.body;
    
    // // Parse the incoming date string into a JavaScript Date object
    // const date = moment.utc(dateString, 'DD/MM/YYYY').toDate();
    // // Check if a daily consumption entry already exists for the given date
    // console.log(date);

    const existingDailyData = await DailyData.findOne({ date });

    if (existingDailyData) {
      res.status(200).json({
        success: true,
        message: 'Daily consumption entry updated successfully',
        data: existingDailyData,
      });
    } else {
      // If no entry exists, create a new entry
      const newDailyData = await DailyData.create({
        date,
        calorieIntake,
      });

      res.status(201).json({
        success: true,
        message: 'New daily consumption entry created successfully',
        data: newDailyData,
      });
    }
     } catch (error) {
      console.log(error);
      res.status(500).send({
      success: false,
      error,
      message: "Error in saving daily component",
    });
     }
};


const getDailyConsumptionController =async(req,res)=>{
  // console.log("AAgya");
  try {
    // console.log("ujjhe hit kiya");
    // Retrieve all daily consumption entries from the database
    const dailyConsumptionData = await DailyData.find({});
    res.status(200).json({
      success: true,
      message:"Successfully fetched",
      data: dailyConsumptionData,
    });
  } catch (error) {
    console.error('Error fetching daily consumption data:', error);
    res.status(500).json({
      success: false,
      error,
      message: 'Error fetching daily consumption data',
    });
  }
};

const saveDailyEatings = async(req,res)=>{
    // console.log(req.body);
    try {
      const {date,item, consumedQuantity} = req.body;
      let existingDailyData = await DailyData.findOne({ date: date });
      
       // Check if the item is already consumed on the given date
      const isItemConsumed = existingDailyData.consumedQUantity.some(
        (consumedItem) => consumedItem.itemConsume.toString() === item._id.toString()
      );

      // If item is already consumed, send a message
      if (isItemConsumed) {
        return res.status(200).json({
          success: true,
          message: "Item is already consumed on this date",
        });
      }

      
      existingDailyData.consumedQUantity.push({ itemConsume: item._id, quantity: consumedQuantity });
      await existingDailyData.save();
      res.status(201).json({
        success:true,
        data: existingDailyData
      });
    } catch (error) {
      console.error('Error in saving daily eatings to database',error);
      res.status(500).send({
         success:false,
         error,
         message:'Error in saving daily eatings to database'      
      });
    }

};

const fetchDailyEatings = async(req,res)=>{
  try {
    const response = await DailyData.find({})
    const foodItems = [];
     // Iterate through each daily entry and extract date and food items
     for (const data of response) {
      const date = data.date; // Assuming date is stored in the 'date' field
      const consumedItems = data.consumedQUantity;

      // Iterate through consumed items for the current daily entry
      for (const consumedItem of consumedItems) {
        // Fetch the food item based on the itemConsume reference
        const fetchedItem = await FoodItems.findById(consumedItem.itemConsume);

        // Add date and consumed quantity to the fetched food item
        const itemWithDateAndQuantity = {
          ...fetchedItem.toObject(),
          date,
          consumedQuantity: consumedItem.quantity,
        };

        foodItems.push(itemWithDateAndQuantity);
      }
    }
  //  console.log(foodItems);
    res.status(200).json({
      success: true,
      message:"Successfully fetched",
      data: foodItems,
    });
  } catch (error) {
    console.error('Error fetching daily Eatings data:', error);
    res.status(500).json({
      success: false,
      error,
      message: 'Error fetching daily Eatings data',
    });
  }
};


  const deleteDailyEating = async(req,res)=>{
    try {
      const {itemId} = req.params;
      const {date} = req.query;
      
      // Find the daily data document containing the item to be deleted
      const objectId = new mongoose.Types.ObjectId(itemId);

      const dailyDataItem = await DailyData.findOne({ date: date });
      if (!dailyDataItem) {
        return res.status(404).json({ message: 'Daily data item not found' });
      }

    // Find the index of the consumed item with the matching itemId
    const index = dailyDataItem.consumedQUantity.findIndex(item => item.itemConsume.equals(objectId));

    if (index === -1) {
      return res.status(404).json({ message: 'Item not found in daily data' });
    }

    // Remove the item from the consumedQUantity array
    dailyDataItem.consumedQUantity.splice(index, 1);

    // Save the updated daily data document
    await dailyDataItem.save();

      return res.status(200).json({ 
        success:true,
        message: 'Daily data item deleted successfully' });
    } catch (error) {
      console.error('Error deleting daily data item:', error);
      return res.status(500).json({ 
        success:false,
        message: 'Internal server error' });
    }  
  };


  const updateDailyEating = async(req,res)=>{
    try{
      const {itemId} = req.params;
      const {date} = req.query;
      const {newValue} = req.body;

      
      const dailyDataItem = await DailyData.findOne({ date: date });
      if (!dailyDataItem) {
        return res.status(404).json({ message: 'Daily data item not found' });
      }

      // Find the consumed item with the matching itemId
    const consumedItem = dailyDataItem.consumedQUantity.find(item => item.itemConsume.equals(itemId));

    if (!consumedItem) {
      return res.status(404).json({ message: 'Item not found in daily data' });
    }

    // Update the quantity of the consumed item
    consumedItem.quantity = newValue;

    // Save the updated daily data
    await dailyDataItem.save();
    return res.status(200).json({ 
      success:true,
      message: 'Daily data item updated successfully' });
  } catch (error) {
    console.error('Error updating daily data item:', error);
    return res.status(500).json({ 
      success:false,
      message: 'Internal server error' });
  } 
  }



  const addDailyEating = async(req,res)=>{
    try{
      const {itemId} = req.params;
      const {date} = req.query;
      const {newValue} = req.body;

      
      const dailyDataItem = await DailyData.findOne({ date: date });
      if (!dailyDataItem) {
        return res.status(404).json({ message: 'Daily data item not found' });
      }

      // Find the consumed item with the matching itemId
    const consumedItem = dailyDataItem.consumedQUantity.find(item => item.itemConsume.equals(itemId));

    if (!consumedItem) {
      return res.status(404).json({ message: 'Item not found in daily data' });
    }

    // Update the quantity of the consumed item
    consumedItem.quantity = consumedItem.quantity+Number(newValue);

    // Save the updated daily data
    await dailyDataItem.save();
    return res.status(200).json({ 
      success:true,
      data: consumedItem.quantity,
      message: 'Daily data item updated successfully' });
  } catch (error) {
    console.error('Error updating daily data item:', error);
    return res.status(500).json({ 
      success:false,
      message: 'Internal server error' });
  } 
  }
export {getFoodItemController,saveDailyConsumptionController,getDailyConsumptionController,saveDailyEatings,fetchDailyEatings,deleteDailyEating,updateDailyEating,addDailyEating,addFoodItemController};