import { useState } from "react";
import Person from "../../assets/images/login.svg";
import Pass from "../../assets/images/password.svg";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const LoginSeller = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // State för email
  const [password, setPassword] = useState<string>(""); // State för lösenord
  const [error, setError] = useState<string | null>(null); // State för felmeddelanden
  const [loading, setLoading] = useState<boolean>(false); // State för loading
  const navigate = useNavigate(); // Navigera till annan sida

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_LOGIN_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "seller" }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Inloggningen misslyckades!");
      }
  
      const data = await response.json();
      console.log("✅ API-respons:", data);
  
      if (!data.token || !data.userId || !data.name) {
        throw new Error("Ogiltig API-respons: saknar nödvändiga data.");
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("loginstatus", "true");
  
      console.log("✅ Inloggning lyckades:", data);
      navigate("/seller");
    } catch (error) {
      console.error("❌ Fel vid inloggning:", error);
      setError(error instanceof Error ? error.message : "Ett oväntat fel inträffade vid inloggning.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex bg-[#f1f1f1]">
      <div className="relative flex flex-col items-center justify-center h-screen w-screen gap-10">
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
            {loading ? "Logging in..." : "Login"}
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

export default LoginSeller;
