import { Link } from "react-router-dom";
import MapPic from '../assets/images/icons8-map-pin-50.png';

interface MapButtonProps {
    className?: string;
}

const MapButton: React.FC<MapButtonProps> = ({ className }) => {
    return (
        <Link to="/map" className={className}>
            <img src={MapPic} alt="Map Button" />
        </Link>
    );
};

export default MapButton;
