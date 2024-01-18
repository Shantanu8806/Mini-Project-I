
import Ft from './Ft'
// import img from './assets/logo.png'

function Features(){
  const featuresData=[
    {
        id: 1,
        icon:"https://is3-ssl.mzstatic.com/image/thumb/Purple126/v4/6c/89/c2/6c89c288-d5ba-cc3a-8997-29fd1c337b94/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg",
        heading:"Comfortable parking",
        desc:"Our user-friendly website ensures you effortlessly dicover the perfect parking spot,ensuring your convinience and peace of mind",
    },
    {
        id: 2,
        icon:"https://i.pinimg.com/1200x/ff/a3/be/ffa3be26611b6536851b9f5fda182da9.jpg",
        heading:"Real time online Booking",
        desc:"Secure real-time bookings eith our website,guaranteeing you instant access to available parking spots for your utmost convenienceand efficiency.",
    
    },
    {
        id:3,
        icon:"https://www.shutterstock.com/image-photo/no-hidden-fees-symbol-concept-260nw-2231747869.jpg",
        heading:"No hidden charges",
        desc:"Rest assured, we have a transparent pricing policy with no hidden charges, providing you with clarity and peace of mind while using our service",
    },
    {
        id:4,
        icon:"https://banner2.cleanpng.com/20180705/sro/kisspng-computer-icons-gear-circle-clip-art-developement-5b3d9a4bdc45a8.7921170115307638519023.jpg",
        heading:"Full set of extra services",
        desc:"Our website offers a comprehensive range of additional services to enhance your experience ensuring concinience and satisfaction throughout you parking journey",
    },
    {
        id:5,
        icon:"https://cdn1.vectorstock.com/i/1000x1000/19/05/lock-icon-white-on-the-blue-background-vector-3451905.jpg",
        heading:"Reliable and Secure",
        desc:"Our website offers a comprehensive range of additional services to enhance your experience ensuring concinience and satisfaction throughout you parking journey",
    }
];
    return(
        // featuresData.map((data)=>{
        //   return <div>
        //     <Ft data={data}></Ft>
        //   </div>
        // })
       
        <div className='mt-24'>
             <h1 className='text-center font-bold text-2xl '>Features</h1>
             <div className='h-1 w-12 rounded-sm mb-7 mt-3 bg-blue-600 mx-auto my-auto'></div>
            <div className="grid-container">
        <div className="grid-item  shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] rounded-md">
            <img className='h-24 rounded-full mx-20 ' src={featuresData[0].icon} alt=''/>
            <div>
                <h2 className='font-bold text-lg p-4 pt-8'>{featuresData[0].heading}</h2>
                <p>{featuresData[0].desc}</p>
            </div>
        </div>
        <div className="grid-item shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] rounded-md">
        <img className='h-24 w-24 rounded-full mx-20'  src={featuresData[1].icon} alt=''/>
            <div>
                <h2 className='font-bold text-lg p-4 pt-8'>{featuresData[1].heading}</h2>
                <p>{featuresData[1].desc}</p>
            </div>
        </div>
        <div className="grid-item shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] rounded-md">
        <img className='h-24 w-24 rounded-full mx-20' src={featuresData[2].icon} alt=''/>
            <div>
                <h2 className='font-bold text-lg p-4 pt-8'>{featuresData[2].heading}</h2>
                <p>{featuresData[2].desc}</p>
            </div>
        </div>
        <div className="grid-item shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] rounded-md"><img className='h-24 w-24 rounded-full mx-20' src={featuresData[3].icon} alt=''/>
            <div>
                <h2 className='font-bold text-lg p-4 pt-8'>{featuresData[3].heading}</h2>
                <p>{featuresData[3].desc}</p>
            </div></div>
            <div className="grid-item shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] rounded-md"><img className='h-24 w-24 rounded-full mx-20' src={featuresData[4].icon} alt=''/>
            <div>
                <h2 className='font-bold text-lg p-4 pt-8'>{featuresData[4].heading}</h2>
                <p>{featuresData[4].desc}</p>
            </div></div>
      </div>
        </div>

    )
}
export default Features





/*
<div id='map' style='width: 400px; height: 300px;'></div>
<script>
  mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
  });
</script>







*/