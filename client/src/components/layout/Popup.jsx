import React from 'react'
import '../../../src/styles/popup.css'

const Popup = (props) => {
  return  (props.trigger)? (
    <div className='popup'>
        <div className='popup-inner bg-gray-800'>
           <button className='close-btn text-white text-2xl bg-red-600 font-bold font-mono px-2 rounded-xl hover:bg-red-800'
              onClick={()=> props.setTrigger(false)}
           >X</button>
           {props.children}
        </div>
    </div>
  ): "";
}

export default Popup