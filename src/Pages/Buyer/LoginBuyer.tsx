import { useState } from "react";
import Person from "../../assets/images/login.svg";
import Pass from "../../assets/images/password.svg";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom"; // För navigering efter login

const LoginBuyer = () => {
  const [email, setEmail] = useState<string>(""); // State för email
  const [password, setPassword] = useState<string>(""); // State för lösenord
  const [error, setError] = useState<string | null>(null); // State för felmeddelanden
  const navigate = useNavigate(); // Navigera till annan sida

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
        const response = await fetch(`${import.meta.env.VITE_API_LOGIN_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, role: "buyer" }), // Skicka med rollen
        });
        console.log(response)
        
        if (!response.ok) {
            throw new Error("Invalid credentials. Please try again.");
        }
  
      const data = await response.json();
      localStorage.setItem("token", data.token); // Spara JWT i localStorage
      localStorage.setItem("userId", data.userId); // Spara userId i localStorage
      localStorage.setItem("role", data.role); // Spara roll i localStorage
      localStorage.setItem("loginstatus", "true");
      console.log("Login successful!", data);
  
      // Navigera till en skyddad sida
      navigate("/marketplace");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Login error:", err);
    }
  };
  

  return (
    <div className="flex bg-[#f1f1f1]">
      <div className="relative flex flex-col items-center justify-center h-screen w-screen gap-10">
        <h1 className="font-secondary text-3xl font-semibold">Login as a buyer</h1>
        <form className="flex flex-col justify-center items-center" onSubmit={handleLogin}>
          <div className="flex flex-col items-center justify-center mb-2 gap-8">
            <div className="flex gap-3 pr-6">
              <img className="w-7" src={Person} alt="User Icon" />
              <input
                type="email"
                placeholder="Email"
                className="p-2 w-80 h-14 border-2 border-icons rounded font-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pr-6">
              <img className="w-7" src={Pass} alt="Password Icon" />
              <input
                type="password"
                placeholder="Password"
                className="p-2 w-80 h-14 border-2 rounded border-icons font-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" className="w-48">
            Login
            </Button>
        </form>
        <a href="/" className="text-sm font-secondary mb-10">Forgot password?</a>
        <Button
          className="absolute bottom-0 mb-10 h-11 text-center w-48"
          onClick={() => navigate("/register")}
        >
          Create account
        </Button>
      </div>
    </div>
  );
};

export default LoginBuyer;
