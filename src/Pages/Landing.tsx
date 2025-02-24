import {useNavigate} from 'react-router-dom';
import landingVideo from '../../public/video/LandingVideo.mp4';
import  Hero  from '../Pages/Hero';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div>

            <div className="flex">

                <div className='flex flex-col items-center bg-myColor justify-center h-screen w-1/2 gap-10'>
                    <h1 className="text-4xl font-primary text-center font-semibold mr-10 ml-10 tracking-wide text-black">Bringing Farm-Fresh Goodness <p className="font-bold leading-loose">Straight to You</p></h1>

                    <p className="font-primary text-lg tracking-wide mr-10 ml-10">At CropCollect, we connect local farmers with communities that value fresh, sustainable produce. Our mission is to simplify farm-to-table sourcing so everyone can enjoy high-quality, responsibly grown crops. Join us—and discover a new way to shop, eat, and live healthier.</p>

                    <button className="relative inline-block font-medium group py-1.5 px-2.5 w-60 h-14 border rounded bg-secondary font-secondary hover:bg-" onClick={() => navigate('/LoginBuyer')}>
                    <span className="absolute inset-0 w-full h-full transition duration-400 ease-out transform translate-x-1 translate-y-1 bg-secondary group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                    <span className="absolute inset-0 w-full h-full bg-myColor border border-secondary group-hover:bg-secondary"></span>
                    <span className="relative text-black ">Explore our marketplace</span>
                    </button>

                <button
                    className="text-blue-500 font-secondary bottom-10 absolute hover:text-secondary"
                    onClick={() => navigate("/register")}
                    >
                    Create account
                </button>
                </div>

                

                <div className="absolute h-screen w-1/2 right-0">
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
        </div>
    );
}

export default LandingPage;