import React, { useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import Vegetales from '../assets/images/vegetables_picture.jpg'
import Handcraft from '../assets/images/handcraft.jpg'
import HoneyMaking from '../assets/images/honey_making.jpg'
import Explore from '../components/Button'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

function Hero() {
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(".hero-image", {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: ".hero-image",
                start: "top 80%",
                end: "bottom 60%",
                once: true // Add this line to ensure the animation only happens once
            }
        });
    }, []);

    return (
        <>
      <div className="h-full pb-24 bg-primary text-myColor">
        
        {/* HERO-TOPIC */}
        <h1 className="text-center font-primary font-semibold text-2xl pt-20 mb-5">
          Cultivating Community Connections
        </h1>
        <p className="text-center text-lg">
          At the heart of our platform is a thriving community of local farmers, artisans, and small-scale producers
        </p>

        <div className="flex mt-5 justify-center w-full">
            <Explore className="w-1/3 h-[55px] font-light" onClick={() => navigate("/register")}>Explore</Explore>
        </div>

        {/* HERO-IMAGES */}
        <div
          className="
            grid
            grid-cols-2
            grid-rows-2
            gap-4
            mx-5
            mt-14

            lg:grid-cols-3
            lg:grid-rows-1
          "
        >
          {/* Bild 1 */}
          <article
            className="
              relative
              col-span-1
              row-span-1
              hero-image
              lg:col-span-1
              lg:row-span-1
            "
          >
            <img
              src={Vegetales}
              alt="Picture of vegetables"
              className="block w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-center ml-5">
              <p className="text-white text-2xl font-bold">Fresh Harvest</p>
              <p className="text-white text-lg mt-2 font-semibold italic font-sans">
                Pure flavors in each harvest
              </p>
            </div>
          </article>

          {/* Bild 2 */}
          <article
            className="
              relative
              col-span-1
              row-span-1
              hero-image
              lg:col-span-1
              lg:row-span-1
            "
          >
            <img
              src={Handcraft}
              alt="Picture of handcraft"
              className="block w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-center ml-5">
              <p className="text-white text-2xl font-bold">Handmade Creations</p>
              <p className="text-white text-lg mt-2 font-semibold italic font-sans">
                Crafted with <br></br>skill and heart
              </p>
            </div>
          </article>

          {/* Bild 3 */}
          <article
            className="
              relative
              col-span-2
              row-span-1
              hero-image
              lg:col-span-1
              lg:row-span-1
            "
          >
            <img
              src={HoneyMaking}
              alt="Picture of honey making"
              className="block w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-center ml-5">
              <p className="text-white text-2xl font-bold">Sweet Possibilities</p>
              <p className="text-white text-lg mt-2 font-semibold italic font-sans">
                A swirl of natural flavor, perfect for cooking, baking, and everyday treats.
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
    );
}
export default Hero;