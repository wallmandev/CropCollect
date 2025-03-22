import {useNavigate} from 'react-router-dom';
import landingVideo from '../../public/video/LandingVideo.mp4';
import  Hero  from '../Pages/Hero';
import Footer from '../Pages/Footer';
import Parallax from './Parallax';
import MapLanding from './MapLanding';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    localStorage.setItem("loginstatus", "false");

    const containerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 10, duration: 1 } },
        exit: { opacity: 0, y: 50, transition: { ease: 'easeInOut', duration: 1 } }
    };

    const buttonVariants = {
        hover: { scale: 1.1, transition: { yoyo: Infinity, duration: 0.3 } }
    };


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex flex-col lg:flex-row">
                <div className='flex flex-col items-center bg-myColor justify-center h-screen lg:h-screen w-full lg:w-1/2 gap-5'>
                    <h1 className="text-4xl lg:text-5xl font-primary text-center font-semibold mr-2 ml-2 tracking-wide lg:mt-24 mb-8 text-black">Bringing Farm-Fresh Goodness <p className="font-bold leading-loose">Straight to You</p></h1>
                    <p className="font-primary text-xl tracking-wide text-center mr-4 ml-4 mb-12">At CropCollect, we connect local farmers with communities that value fresh, sustainable produce. Our mission is to simplify farm-to-table sourcing so everyone can enjoy high-quality, responsibly grown crops. Join us—and discover a new way to shop, eat, and live healthier.</p>
                    <motion.div variants={buttonVariants}>
                        <Button className="w-52 h-16" onClick={() => navigate("/register")}> Get Started</Button>
                    </motion.div>
                </div>
                <div className="hidden lg:block h-screen w-1/2">
                    <video 
                        autoPlay 
                        muted 
                        loop 
                        className='w-full h-screen object-cover filter brightness-75'
                    >
                        <source src={landingVideo} type="video/mp4" />
                        Webbläsaren stödjer inte video.
                    </video>
                </div>
            </div>
            <Hero />
            <Parallax/>
            <MapLanding/>
            <Footer />
        </motion.div>
    );
}

export default LandingPage;