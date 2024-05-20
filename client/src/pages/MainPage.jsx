  import React , { useState, useEffect } from 'react'
  import Layout from '../components/layout/Layout'
  import FoodItems from '../components/layout/FoodItems'
  import DatePicker from 'react-datepicker'
  import 'react-datepicker/dist/react-datepicker.css'
  import DailyConsumption from '../components/layout/DailyConsumption'
  import axios from 'axios';
  import MyDocument from '../components/layout/MyDocument';
  import { PDFDownloadLink } from '@react-pdf/renderer';
  import MyDocument2 from '../components/layout/MyDocument2'
  import Popup from '../components/layout/Popup';
  import '../../src/styles/popup.css'

  const MainPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dailyConsumption, setDailyConsumption] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [droppedItemsMap, setDroppedItemsMap] = useState(new Map());
    const [lastDate,setLastDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [showForm,setShowForm] = useState(false);
    const [food,setFood] = useState('');
    const [link,setLink] = useState('');
    const [category,setCategory] = useState('');
    const [unit,setUnit] = useState('');
    const [protein,setProtein] = useState(0);
    const [carbohydrate,setCarbohydrate] = useState(0);
    const [calorie,setCalorie] = useState(0);
    

    const handleCategoryChange = (e) => {
      setSelectedCategory(e.target.value);
    };

    const handleAddTileClick =async () => {
       try {
        const formattedDate = selectedDate.toLocaleDateString('en-GB');
        const data = {
          date: formattedDate,
          foodItems: [], // Blank array
          calorieIntake: 0 // Zero value
        };
        const response = await axios.post('http://localhost:8080/api/v1/add-daily-data', data);
        // console.log(response?.data);
        if(response?.status===201)
          setDailyConsumption([{ date: formattedDate }, ...dailyConsumption]); // Update daily consumption state with the new entry
        else if(response?.status===200)
          window.alert("Date is already present!!");
       } catch (error) {
          console.error('Error in adding daily consumption data', error);
       }
     };
    useEffect(()=>{
      const fetchDailyData = async()=>{
         try {
          const response = await axios.get('http://localhost:8080/api/v1/get-daily-data');
          // console.log(response?.data?.data);
          setDailyConsumption(response?.data?.data);
         } catch (error) {
          console.error("Error in fetching daily consumption data",error);
         }
      }
      fetchDailyData();
    },[]);
    useEffect(()=>{
      const formattedDate = selectedDate.toLocaleDateString('en-GB');
      setLastDate(formattedDate);
    },[selectedDate])

    const handleOptionChange = (e) => {
      setSelectedOption(e.target.value);
    };

    // Function to handle receiving droppedItemsMap from child component
  const handleDroppedItemsMap = (map) => {
    setDroppedItemsMap(map);
  };

  const handleSubmit = async(e) => {
     e.preventDefault();
     try {
       var qty=1;
       let modifiedunit = unit;
       if(unit==="gram"){
         qty = 100;
         modifiedunit = "gram";
       }
       else if(unit==="itself"){
        modifiedunit = food;

       }
       const data = {
          FOOD_ITEMS : food,
          LINKS: link,
          Type: category,
          Protein: protein,
          Carbohydrate:carbohydrate,
          Calorie:calorie,
          Unit:qty,
          Term:modifiedunit
       }
       await axios.post('http://localhost:8080/api/v1/add-food-item',data)
       // Reset the form fields or clear the input fields if needed
       setFood('');
       setLink('');
       setCategory('');
       setUnit('');
       setProtein(0);
       setCarbohydrate(0);
       setCalorie(0);
     } catch (error) {
        console.log("Error in saving new food item..!!");
     }
     
  };
 // console.log(droppedItemsMap);
    return (
      <>
      <Layout>
      <div className='flex h-screen overflow-hidden my-1'>
          <div className='bg-gray-800 shadow-2xl rounded-xl text-center w-[23%] h-full mx-1'>
            <p className='p-4 text-white font-bold text-2xl font-mono'>Food Items</p>
            <hr className="border border-gray-300"/>
            <div className='m-3 h-5/6 rounded-xl flex flex-col shadow-2xl bg-red-100'>
            <div className="p-2">
            <select className="w-full border rounded-md px-4 py-1 focus:outline-none focus:border-blue-400"
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
                <option value="">All Category</option>
                <option value="Sabzi">Sabzi</option>
                <option value="Bread">Indian Breads</option>
                <option value="fruits">Fruits</option>
                <option value="dryfruits">Dry Fruits</option>
                <option value="dairyproducts">Dairy products</option>
                <option value="vegetables">Raw Vegetables</option>
                <option value="nonveg">Non Veg</option>
                <option value="grains">Grains</option>
                <option value="pulses">Pulses</option>
                <option value="drinks">Drinks</option>
                <option value="snacks">Snacks</option>
                <option value="south">South Indian</option>
            </select>
              </div>
              <div>
                <button className='p-2 bg-gray-800 font-mono text-sm font-bold text-white rounded-xl hover:bg-gray-600'
                  onClick={()=>setShowForm(true)}
                >Can't find food</button>
                <Popup trigger={showForm} setTrigger={setShowForm}>
                  <h3 className='p-1 text-white font-bold text-2xl font-mono'>Input food Item</h3>
                  <hr className="border border-gray-300"/>
                  <div className='bg-red-200 my-2 rounded'>
                  <form>
                   <div className="p-2">
                    <span className='font-bold text-xl'>Food Item Name: <span className='text-red-500'>*</span></span>
                    <input
                      type="text"
                      value={food}
                      onChange={(event) => setFood(event.target.value)}
                      className="rounded p-2 mx-2"
                      placeholder='Enter the text'
                      required
                      autoFocus
                    />
                   </div>
                   <div className="p-2">
                    <span className='font-bold text-xl'>Image URL: <span className='text-red-500'>*</span></span>
                    <input
                      type="text"
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                      className="rounded p-2 ml-[55px]"
                      placeholder='Enter the valid Link'
                      required
                      autoFocus
                    />
                   </div>
                   <div className='flex ml-12'>
                   <div className="p-2">
                     <span className='font-bold text-xl'>Category: <span className='text-red-500'>*</span></span>
                     <select className='ml-2 border rounded p-2 focus:outline-none focus:border-blue-400'
                       value={category}
                       onChange={(event)=>setCategory(event.target.value)}
                     >
                       <option value="">All Category</option>
                       <option value="Sabzi">Sabzi</option>
                       <option value="Bread">Indian Breads</option>
                       <option value="fruits">Fruits</option>
                       <option value="dryfruits">Dry Fruits</option>
                       <option value="dairyproducts">Dairy products</option>
                       <option value="vegetables">Raw Vegetables</option>
                       <option value="nonveg">Non Veg</option>
                       <option value="grains">Grains</option>
                       <option value="pulses">Pulses</option>
                       <option value="drinks">Drinks</option>
                       <option value="snacks">Snacks</option>
                       <option value="south">South Indian</option>
                     </select>
                   </div>
                   <div className="p-2">
                   <span className='font-bold text-xl'>Per: <span className='text-red-500'>*</span></span>
                     <select className='ml-2 border rounded p-2 focus:outline-none focus:border-blue-400'
                        value={unit}
                        onChange={(event)=>setUnit(event.target.value)}
                     >
                       <option value="">All Units</option>
                       <option value="plate">plate</option>
                       <option value="bowl">bowl</option>
                       <option value="cup">cup</option>
                       <option value="tablespoon">tablespoon</option>
                       <option value="gram">100 gram</option>
                       <option value="itself">item itself</option>
                     </select>
                   </div>
                   </div>
                   <div className="p-2">
                    <span className='font-bold text-xl'>Protein: <span className='text-red-500'>*</span></span>
                    <input
                      type="number"
                      value={protein}
                      onChange={(event) => setProtein(event.target.value)}
                      className="rounded p-2 ml-[90px]"
                      placeholder='Enter the protien value'
                      required
                      autoFocus
                    />
                   </div>
                   <div className="p-2">
                    <span className='font-bold text-xl'>Carbohydrate: <span className='text-red-500'>*</span></span>
                    <input
                      type="number"
                      value={carbohydrate}
                      onChange={(event) => setCarbohydrate(event.target.value)}
                      className="rounded p-2 ml-[30px]"
                      placeholder='Enter the carbohydrate'
                      required
                      autoFocus
                    />
                   </div>
                   <div className="p-2">
                    <span className='font-bold text-xl'>Calories: <span className='text-red-500'>*</span></span>
                    <input
                      type="number"
                      value={calorie}
                      onChange={(event) => setCalorie(event.target.value)}
                      className="rounded p-2 ml-[83px]"
                      placeholder='Enter the calories value'
                      required
                      autoFocus
                    />
                   </div>
                 </form>
                </div>
                 <p className='text-red-600'>* please enter the correct values</p>
                 <p className='text-red-600'>* If unit is 100 gram then add values per 100 grams of material</p>
                 <p className='text-red-600'>* please enter the values corresponding per unit quantity</p>                
                 <hr className="border border-gray-300"/>
                 <button type="submit" className="p-2 m-2 bg-red-500 font-mono text-sm font-bold text-white rounded-xl hover:bg-blue-600"
                  onClick={(event) => {
                   handleSubmit(event); // Call the handleSubmit function
                   setShowForm(false); // Close the popup
                  }}
                 >
                  SAVE
                 </button>
             </Popup>
              </div>
                <FoodItems  category={selectedCategory}/>
            </div>
          </div>
          <div className='bg-gray-800 shadow-2xl rounded-xl flex-1 w-[73%] text-center mr-1'>
            <p className='p-4 text-white font-bold text-2xl font-mono'>Calorie Tracker</p>
            <hr className="border border-gray-300"/>
            <div className='m-3 h-5/6 rounded-xl shadow-2xl bg-red-100 overflow-y-auto'>
              <p className='p-2 text-black font-bold text-2xl font-mono'>Routine Intake</p>
              <div className="underline mx-auto w-1/6 h-1 bg-gray-700"></div>
              <div className='flex justify-center items-center'>
                <p className='p-4 text-black font-bold text-2xl font-mono'>Enter the Date:- </p>
                {!showForm && (
                <>
                    <DatePicker
                      className="rounded-lg border-2 border-gray-300 p-2 appearance-none"
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      // maxDate={new Date()}
                    />
                </>
              )}
                <button className='p-3 bg-gray-800 font-mono text-sm font-bold text-white rounded-xl mx-3 hover:bg-gray-600' onClick={handleAddTileClick}>Add Tile</button>
                <div className='p-2 rounded-xl'>
                  <select 
                    className='bg-gray-800 rounded-xl p-2 text-white text-md font-mono hover:bg-gray-600'
                    value={selectedOption}
                    onChange={handleOptionChange} 
                  >
                    <option value="">Download Report</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  {selectedOption === "weekly" && (
                    <PDFDownloadLink className='m-2 p-2 bg-green-700 hover:bg-green-500 rounded-xl font-mono text-white' 
                    document={<MyDocument droppedItemsMap={droppedItemsMap}  />} fileName="Weekly_Report.pdf">
                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download 7 days report now!')}
                   </PDFDownloadLink>
                  )}
                  {selectedOption === "monthly" && (
                    <PDFDownloadLink className='m-2 p-2  bg-green-700 rounded-xl hover:bg-green-500 font-mono text-white' 
                    document={<MyDocument2  droppedItemsMap={droppedItemsMap}  />} fileName="Monthly_Report.pdf">
                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download monthly report now!')}
                   </PDFDownloadLink>
                  )}
                </div>

              </div>
              <hr className="border border-gray-300"/>
              <div className='p-2'>
                {dailyConsumption.sort((a, b) => {
                  // Convert the date strings to JavaScript Date objects for comparison
                  const dateA = new Date(a.date.split('/').reverse().join('/'));
                  const dateB = new Date(b.date.split('/').reverse().join('/'));
    
                      // Compare the dates and return the comparison result
                     return dateB - dateA;
                }).map(dailyConsumption => (
                <DailyConsumption key={dailyConsumption.id} date={dailyConsumption.date} lastDate={lastDate} onDroppedItemsMap={handleDroppedItemsMap}/>
              ))}
              </div>
            </div>
          </div>
      </div>
      {/* {<MyDocument droppedItemsMap={droppedItemsMap}  />} */}
      </Layout> 
      </>
    )
  }

  export default MainPage;