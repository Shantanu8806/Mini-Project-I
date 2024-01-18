import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const handleNavigation = () => {
    // Navigate based on the selected option
    if (selectedOption === 'Owner') {
     navigate('/signup/owner')
    } else if (selectedOption === 'Rental') {
      navigate('/signup/tenant')
    }
    console.log(selectedOption);
    // Add more conditions as needed
  };

  return (
    <div className="bg-[rgb(207,209,209)] h-[625px] px-96 py-40">
      <div className='bg-white w-[750px]  rounded-xl p-12'>
        <h3 className="text-2xl font-bold">Select Your Role</h3>
      <div className='flex flex-row'>
      <div className='p-5'>
      <label className="font-bold text-lg">
        <input
        
          type="radio"
          name="options"
          value="Owner"
          checked={selectedOption === 'Owner'}
          onChange={handleOptionChange}
        />
        Owner
      </label>
      <p>Transform your unutilized parking spot into a source of passive income with ease.</p>
      </div>

      <div className='p-5'>
      <label  className="font-bold text-lg">
        <input
       
          type="radio"
          name="options"
          value="Rental"
          checked={selectedOption === 'Rental'}
          onChange={handleOptionChange}
        />
        Rental
      </label>
      <p>Discover hassle-free parking solutions within your vicinity.</p>
      </div>

      
      </div>
      <div className='mt-7'>
      <button onClick={handleNavigation} disabled={!selectedOption} className='bg-[rgb(31,32,97)] p-2 w-24 mx-auto rounded-xl text-white font-bold'>
      Next
      </button>
      </div>
    </div>
    </div>
  );
};

export default SignUpTypeSelection