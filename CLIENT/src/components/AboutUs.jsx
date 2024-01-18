import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { motion } from 'framer-motion';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import image1 from '../images/parkibg8.png';
import image2 from '../images/parking2.png';
import image3 from '../images/Parking3.png';
import image4 from '../images/parking4.png';
import image5 from '../images/parking5.png';
import image6 from '../images/parking6.png';
import image7 from '../images/parking7.png';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS styles

const AboutUs = () => {
    const carouselImages = [
        { id: 1, src: image1, alt: 'Image 1' },
        { id: 2, src: image2, alt: 'Image 2' },
        { id: 3, src: image3, alt: 'Image 3' },
        { id: 4, src: image4, alt: 'Image 4' },
        { id: 5, src: image5, alt: 'Image 5' },
        { id: 6, src: image6, alt: 'Image 6' },
        { id: 7, src: image7, alt: 'Image 7' },
    ];

    const carouselSettings = {
        responsive: {
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 3,
                slidesToSlide: 3,
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2,
                slidesToSlide: 2,
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
                slidesToSlide: 1,
            },
        },
        arrows: true,
        customLeftArrow: <FaArrowAltCircleLeft />,
        customRightArrow: <FaArrowAltCircleRight />,
        infinite: true,
        autoPlay: true,
        autoPlaySpeed: 3000,
        keyBoardControl: true,
        transitionDuration: 500,
        containerClass: 'carousel-container mb-8 h-96', // Adjusted height here
        dotListClass: 'carousel-dot-list',
        itemClass: 'carousel-item',
    };

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    return (
        <motion.div
            className="about-us-container text-center p-8 bg-gray-100"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
        >
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="mb-8 text-gray-700">
            Welcome to ParkMate, your solution to urban parking challenges! At ParkMate, we empower space owners to turn their vacant spots into valuable assets by renting them to those in need. Say goodbye to parking woes and hello to a seamless, efficient, and lucrative way of managing urban parking. Join ParkMate today and be a part of the parking revolution, where convenience meets opportunity!
            </p>
            <Carousel {...carouselSettings}>
                {carouselImages.map((image) => (
                    <div key={image.id} className="carousel-item">
                        <img src={image.src} alt={image.alt} className="w-full h-full object-cover rounded" />
                    </div>
                ))}
            </Carousel>
            <motion.div
            className="truck-animation"
            initial={{ y: -10 }}
            animate={{ y: 10, transition: { yoyo: Infinity, duration: 1.5 } }}
        >
            <div className="truck"></div>
            <div className="wheels"></div>
        </motion.div>

        </motion.div>
    );
};

export default AboutUs;