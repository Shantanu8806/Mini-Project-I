import { useState,useEffect } from "react";
import Features from "./features/Features";


function ImageSlider() {
  // Create state variables for the index and image array
  const [index, setIndex] = useState(0);
  const images = ['https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D', 'https://media.istockphoto.com/id/1146517111/photo/taj-mahal-mausoleum-in-agra.jpg?s=612x612&w=0&k=20&c=vcIjhwUrNyjoKbGbAQ5sOcEzDUgOfCsm9ySmJ8gNeRk=', 'https://media.istockphoto.com/id/1093110112/photo/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-of-green-forest-with-pure.jpg?s=612x612&w=0&k=20&c=lpQ1sQI49bYbTp9WQ_EfVltAqSP1DXg0Ia7APTjjxz4='];
  
  // Use useEffect to increment the index and update the image every 5 seconds
  const data=[
    {
        id: 1,
        heading:"earn money from your unutilized parking spot",
        desc:"Transform your unutilized parking spot into a source of passive income with ease. List it today, set the price right, and watch your space work for you. Your empty spot is someone else's convenience",
        img:'https://img.freepik.com/premium-vector/parking-lot-with-car-city-background-car-parking-icon-parking-space-parking-lot-car-parking-concept-vector-illustration_735449-110.jpg?w=2000',
    },
    {
        id: 2,
        heading:"find suitable parking within your vicinity",
        desc:"Discover hassle-free parking solutions within your vicinity. From apps to local tips, finding the perfect spot is just a click or a question away. Navigating your way to convenience has never been easier.",
        img:"https://img.freepik.com/premium-vector/parking-smartphone-app-tiny-woman-looking-parking-lot-park-automobile-public-carpark_501813-832.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698019200&semt=ais",
    },
    {
        id: 3,
        heading:"secure parking  within your vicinity at lower cost",
        desc:"Unlock secure, cost-effective parking in your vicinity. We've got your spot, so you can enjoy peace of mind without breaking the bank",
        img:"https://static.vecteezy.com/system/resources/previews/023/642/025/original/parking-big-road-sign-public-car-park-urban-transport-tiny-people-looking-for-parking-space-park-automobile-modern-flat-cartoon-style-illustration-on-white-background-vector.jpg",
    }
]
  useEffect(() => {
  const intervalId = setInterval(() => {
  setIndex(prevIndex => (prevIndex + 1) % images.length);
  }, 4000);
  
  return () => clearInterval(intervalId);
  }, []);
  return (
  <div className="bg-[rgb(232,232,232)]">
    <div className="flex flex-row  w-11/12 p-24 h-[500px] mx-auto my-auto ">
    <div className=" w-full align-middle justify-center mb-10">
    <img className="mix-blend-multiply" src={data[index].img} width={1000}></img>
    </div>
    <div className="flex flex-col align-center justify-center w-11/12 ml-16  mt-14">
      <h2 className="font-bold text-3xl p-5">{data[index].heading}</h2>
      <p>{data[index].desc}</p>
    </div>
  </div>
  <Features/>
  <footer className="mt-10 bg-[rgb(58,81,187)] p-5">
      <p className="text-xl font-semibold">&copy; 2023 ParkIt. All rights reserved.</p>
    </footer>
  </div>
  );
  }
  
  export default ImageSlider;