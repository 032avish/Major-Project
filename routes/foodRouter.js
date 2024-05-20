import express from 'express';
import { addDailyEating, addFoodItemController, deleteDailyEating, fetchDailyEatings, getDailyConsumptionController, getFoodItemController, saveDailyConsumptionController, saveDailyEatings, updateDailyEating } from '../controllers/getFoodItemController.js';



const router = express.Router();



//get food item controller
router.get('/get-item',getFoodItemController);

//add food item controller
router.post('/add-food-item',addFoodItemController);

//saving component router
router.post('/add-daily-data',saveDailyConsumptionController);


//getting the component
router.get('/get-daily-data',getDailyConsumptionController);


//save daily eatings
router.post('/append-daily-eatings',saveDailyEatings);

//fetch daily eatings
router.get('/fetch-daily-eatings',fetchDailyEatings);

//delete daily eatings
router.delete('/delete-item/:itemId',deleteDailyEating);

//update daily eatings
router.put('/update-item/:itemId',updateDailyEating);

//add daily eatings
router.put('/add-item/:itemId',addDailyEating);

export default router;