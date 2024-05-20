import React,{useState} from 'react'

const DailyEatings = ({item}) => {
  const [quantity, setQuantity] = useState({});

  const handleChange = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={item.LINKS}
        alt={item.FOOD_ITEMS}
        className="h-32 w-32 object-cover rounded-lg"
      />
      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        className="mt-2 w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-[9px]"
        placeholder="Consumed in grams"
      />
    </div>
  )
}

export default DailyEatings