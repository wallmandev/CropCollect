import react from 'react';
import { useNavigate } from 'react-router-dom';
import Shop from '../components/Button';
import map from '../assets/images/business-location-analysis.jpg'


function MapLanding () {

    const navigate = useNavigate();

  return (
    <>
        <div className="pb-10 pt-10 flex gap-4 w-full h-auto items-center flex-col justify-center lg:flex-row bg-[#44452E]">

            <div className=" mr-4 ml-4 rounded-md bg-[#515138] h-[370px] flex flex-col items-start justify-center">
                <h1 className="ml-2 mr-2 text-3xl font-bold text-myColor">Discover Your Neighborhood</h1>
                <p className="ml-2 mr-2 mt-6 text-myColor">Our intuitive platform empowers you to explore the diverse bounty of your local food community. Browse through an ever-expanding array of fresh produce.</p>
                <Shop className="mt-5 ml-2 w-44 h-12"  onClick={() => navigate("/register")}>Shop Local</Shop>
            </div>

            <div className="mr-4 ml-4 h-full">
                <img 
                    src={map}
                    alt="" 
                    className="h-auto w-full rounded-md"
                />
            </div>

        </div>
    </>
  )
}

export default MapLanding;