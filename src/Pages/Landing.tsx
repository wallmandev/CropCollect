import {useNavigate} from 'react-router-dom';
import landingVideo from '../../public/video/LandingVideo.mp4';
import  Hero  from '../Pages/Hero';
import Footer from '../Pages/Footer';
import Parallax from './Parallax';
import MapLanding from './MapLanding';
import Button from '../components/Button';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div>

            <div className="flex">

                <div className='flex flex-col items-center bg-myColor justify-center h-screen w-full gap-10'>
                    <h1 className="text-2xl font-primary text-center font-semibold mr-2 ml-2 tracking-wide text-black">Bringing Farm-Fresh Goodness <p className="font-bold leading-loose">Straight to You</p></h1>

                    <p className="font-primary text-sm tracking-wide text-center mr-10 ml-10">At CropCollect, we connect local farmers with communities that value fresh, sustainable produce. Our mission is to simplify farm-to-table sourcing so everyone can enjoy high-quality, responsibly grown crops. Join us—and discover a new way to shop, eat, and live healthier.</p>

                    <Button> Get Started</Button>

                    <button
                        className="text-blue-500 font-secondary bottom-10 absolute hover:text-secondary"
                        onClick={() => navigate("/register")}
                        >
                        Create account
                    </button>
                </div>

                

                <div className="hidden absolute h-screen w-1/2 right-0">
                    <video 
                    autoPlay 
                    muted 
                    loop 
                    className='w-full h-screen object-cover'
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
        </div>
    );
}

export default LandingPage;