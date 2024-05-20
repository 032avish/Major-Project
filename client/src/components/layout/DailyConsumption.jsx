import React,{useState,useEffect} from 'react';
import axios from 'axios';

const DailyConsumption = ({ date, lastDate,onDroppedItemsMap }) => {
  const [droppedItemsMap, setDroppedItemsMap] = useState(new Map());
  const [dropCompleted, setDropCompleted] = useState(false);
  const [calorieIntake, setCalorieIntake] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/fetch-daily-eatings');
      const items = response?.data?.data;
      const itemsMap = new Map();
      // Populate the items map with items for each date
      items.forEach(item => {
        const itemDate = item.date;
        if (!itemsMap.has(itemDate)) {
          itemsMap.set(itemDate, [item]);
        } else {
          const existingItems = itemsMap.get(itemDate);
          itemsMap.set(itemDate, [...existingItems, item]);
        }
      });
      setDroppedItemsMap(itemsMap); // Assuming the response data is an array of items

    } catch (error) {
      console.error('Error fetching daily eatings data:', error);
    }
  };

  fetchData();
}, [dropCompleted]); // Empty dependency array to ensure useEffect runs only once on component mount


const droppedItems = droppedItemsMap.get(date) || [];
const handleDrop = async (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  const item = JSON.parse(data);
  if(date===lastDate){
    const newItem = { date:date, item:item, consumedQuantity: 0 }; // Initialize consumedQuantity for the new item
    try {
      const sendData =  await axios.post('http://localhost:8080/api/v1/append-daily-eatings',newItem);
      if(sendData.status===201){
        setDroppedItemsMap(prevItemsMap => {
          const newItemsMap = new Map(prevItemsMap);
          const itemsForDate = newItemsMap.get(date) || [];
          newItemsMap.set(date, [...itemsForDate, sendData?.data?.data]);
          return newItemsMap;
        });
        if(dropCompleted===true)
        setDropCompleted(false);
      else
      setDropCompleted(true);
  }
  else if(sendData.status===200){
    window.alert("Item is Already present please add the amount in that component itself.");
  }
} catch (error) {
  console.error("Error in adding daily eatings to the component",error)
}
}
else{
  alert("Drop into current date..");
}
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const handleDelete = async (itemId) => {
  try {
    // Send a request to delete the item with the specified itemId
    const response = await axios.delete(`http://localhost:8080/api/v1/delete-item/${itemId}?date=${date}`);
    if (response.status === 200) {
      // Remove the item from the droppedItems array
      const updatedItems = droppedItems.filter(item => item._id !== itemId);
      setDroppedItemsMap(prevItemsMap => {
        const newItemsMap = new Map(prevItemsMap);
        newItemsMap.set(date, updatedItems);
        return newItemsMap;
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleUpdate = async (itemId) => {
    try {
      // Prompt the user for input
      const userInput = window.prompt("Enter the updated value for the Item:");
      if (!userInput) {
        // If the user cancels the prompt, exit the function
        return;
      }
      // Send a request to delete the item with the specified itemId
      const response = await axios.put(`http://localhost:8080/api/v1/update-item/${itemId}?date=${date}`,{ newValue: userInput });
      if (response.status === 200) {
        // Update the item in the frontend
        setDroppedItemsMap(prevItemsMap => {
          const newItemsMap = new Map(prevItemsMap);
          const itemsForDate = newItemsMap.get(date) || [];
          const updatedItems = itemsForDate.map(item =>
            item._id === itemId ? { ...item, consumedQuantity: userInput } : item
          );
          newItemsMap.set(date, updatedItems);
          return newItemsMap;
        });
        
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  
  const handleAdd = async (itemId) => {
    try {
      // Prompt the user for input
      const userInput = window.prompt("Enter the value for the Item to add:");
      if (!userInput) {
        // If the user cancels the prompt, exit the function
        return;
      }
      // Send a request to delete the item with the specified itemId
      const response = await axios.put(`http://localhost:8080/api/v1/add-item/${itemId}?date=${date}`,{ newValue: userInput });
      if (response.status === 200) {
        // Update the item in the frontend
        setDroppedItemsMap(prevItemsMap => {
          const newItemsMap = new Map(prevItemsMap);
          const itemsForDate = newItemsMap.get(date) || [];
          const updatedItems = itemsForDate.map(item =>
            item._id === itemId ? { ...item, consumedQuantity: response.data?.data } : item
          );
          newItemsMap.set(date, updatedItems);
          return newItemsMap;
        });
        
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  
  const renderButtons=(item) => date === lastDate ? (
    <div className="flex justify-center space-x-1">
      <button onClick={() => handleAdd(item._id)} className="block text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-sm rounded-lg text-sm px-2 py-2 text-center">
        Add
      </button>
      <button onClick={() => handleUpdate(item._id)} className="block text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-sm rounded-lg text-sm px-2 py-2 text-center">
        Edit
      </button>
      <button onClick={() => handleDelete(item._id)} className="block text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-sm rounded-lg text-sm px-2 py-2 text-center">
        Del.
      </button>
    </div>
  ) : null;
  
  
  useEffect(() => {
    const calculateCalories = () => {
      let totalCalories = 0;
      droppedItems.forEach(item => {
        totalCalories = totalCalories + ((item.Calorie/item.Unit)*item.consumedQuantity);
      });
      totalCalories = parseFloat(totalCalories.toFixed(2));
      setCalorieIntake(totalCalories);
    };
  
    onDroppedItemsMap(droppedItemsMap);
    calculateCalories();
  }, [droppedItems]);

  return (
    <>
    <span className="bg-red-200 text-gray-800 mt-2 text-md font-bold rounded-t-lg p-2 w-fit flex justify-start">{date}</span>
    <div className="w-full p-1 flex justify-between items-center border bg-gray-800 rounded-r-lg overflow-y-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="mx-4 p-1 flex items-center space-x-4 overflow-x-auto">
      {droppedItems && droppedItems.map((item, index)=>(
      <div className="flex border border-red-200 rounded-xl flex-col items-center" key={index}>
        <img
        src={item.LINKS}
        alt={item.FOOD_ITEMS}
        className="h-32 w-32 object-cover rounded-lg border-gray-400 border mt-1"
        onError={(e) => console.error("Error loading image:", e)}
      />
       <div className="border border-black bg-white w-32 m-1 rounded-md p-1">
        <p className="text-sm text-black">{item.consumedQuantity} {item.Term}</p>
       </div>
       <div className="flex justify-center p-1 space-x-1">
          {renderButtons(item)}
       </div>

      </div>
      
      ))}
      </div>
      <div className='border border-black py-2 rounded-r-lg space-2 bg-gray-500'>
      <p className='m-3 underline text-white font-bold font-mono text-xl'>Calories</p>
      <div className="border border-black bg-white mx-1 rounded-md p-2">
        <p className="text-lg text-gray-800 font-bold">{calorieIntake} cal.</p>
      </div>
      </div>
    </div>
    </>
  );
}

export default DailyConsumption;
