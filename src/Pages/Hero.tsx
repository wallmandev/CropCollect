import React from "react";  
import Vegetales from '../assets/images/vegetables_picture.jpg'
import Handcraft from '../assets/images/handcraft.jpg'
import HoneyMaking from '../assets/images/honey_making.jpg'


function Hero() {
    return (
        <>
            <div className="h-screen bg-primary text-myColor">

                {/* HERO-TOPIC */}
                <h1 className="text-center font-primary font-semibold text-5xl pt-20 mb-5">Cultuvating Community Connections</h1>
                <p className="text-center text-lg">At the heart of our platform is a thriving community of local farmers, artisans and small-scale producers</p>

                {/* HERO-IMAGES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-5 mt-28">
                    <article className="relative">
                        <img 
                        src={Vegetales} 
                        alt="Picture of vegetables" 
                        className="block" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white text-xl font-bold">Fresh Harvest</p>
                        </div>
                    </article>

                    <article className="relative">
                        <img 
                        src={Handcraft} 
                        alt="Picture of handcraft" 
                        className="block"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white text-xl font-bold">Handmade Creations</p>
                        </div>
                    </article>

                    <article className="relative">
                        <img 
                        src={HoneyMaking} 
                        alt="Picture of honey making" 
                        className="block"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white text-xl font-bold">Pure Honey</p>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
    }
    export default Hero;