import { useNavigate } from "react-router-dom";

interface BackProps {
    className?: string;
}

const Back: React.FC<BackProps> = ({ className = "" }) => {
    const navigate = useNavigate();
    return (
        <div className={className}>
            <button
                onClick={() => navigate(-1)}
                className={`bg-white text-center w-12 rounded-2xl h-full left-0 text-black text-xl font-semibold group ${className}`}
                type="button"
            >
                <div
                    className="bg-green-400 relative rounded-xl h-12 w-full flex items-center justify-center left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1024 1024"
                        height="25px"
                        width="25px"
                    >
                        <path
                            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                            fill="#000000"
                        ></path>
                        <path
                            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                            fill="#000000"
                        ></path>
                    </svg>
                </div>
            </button>
        </div>
    );
};

export default Back;
