import react from "react";
import Button from "../components/Button";

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <div>
        <Button className=""><a href="/LoginBuyer">Buyer</a></Button>
        <Button className=""><a href="/LoginSeller">Seller</a></Button>

      </div>
    </div>
  );
};

export default Login;