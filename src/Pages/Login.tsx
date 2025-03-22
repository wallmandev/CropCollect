import Button from "../components/Button";

const Login = () => {


  return (

    <div className="h-screen w-full">

      <div className="h-2/3 w-full flex flex-col items-center justify-center">
        <div className="w-1/2 flex flex-col gap-12 items-center">

          <div className="w-full text-center flex flex-col gap-4">

            <h1 className="font-secondary font-semibold text-2xl">Are you a</h1>
            <Button className="">
              <a href="/LoginBuyer">Buyer</a>
            </Button>

          </div>

          <div className="w-full text-center flex flex-col gap-4">

            <h1 className="font-secondary font-semibold text-2xl w-full">Or maybe a</h1>
            <Button className="">
              <a href="/LoginSeller">Seller</a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;