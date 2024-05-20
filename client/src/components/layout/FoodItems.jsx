import React, {useState,useEffect} from 'react'
import axios from 'axios';

const FoodItems = ({category}) => {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/get-item');
        // console.log(response.data.data);
        setFoodItems(response?.data?.data);
      } catch (error) {
        console.error('Error fetching food items', error);
      }
    };

    fetchData();
  }, [foodItems]);

  const handleDragStart = (e, item) => {
    const foodItemCopy = { ...item }; // Create a shallow copy of the food item
    e.dataTransfer.setData('text/plain', JSON.stringify(foodItemCopy)); // Store the copied food item data in the data transfer object
  };
  // Filter food items based on the selected category
  const filteredFoodItems = foodItems.filter(item => {

    if (category === '') {
      return true; // Show all items if category is empty
    }

    // Assuming your category field in foodItems matches the category options
    return item.Type.toLowerCase() === category.toLowerCase();
  });

  return (
    <div className='overflow-y-auto h-full'>
    <div className='flex flex-wrap justify-around items-center gap-4 p-4'>
    {Array.isArray(filteredFoodItems) && filteredFoodItems.map((item) => (
          <div key={item._id}>
            <img
              src={item.LINKS}
              alt={item.FOOD_ITEMS}
              className='h-32 w-32 object-cover border border-gray-400 rounded-lg hover:shadow-2xl'
              draggable="true"
              onDragStart={(e)=>handleDragStart(e,item)}
            />
          </div>
        ))}

     {/* <div key={foodItems._id}>
        <img
          src={foodItems.LINKS} alt={foodItems.FOOD_ITEMS}
          className='h-32 w-32 object-cover rounded-lg'
        />
      </div> */}
    </div>
  </div>
    
  )
}

export default FoodItems