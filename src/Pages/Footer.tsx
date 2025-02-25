import React from 'react'

function Footer () {
  return (
    <>
        <footer className="h-[350px] bg-myColor flex flex-col justify-between items-center">
            <div className="ml-4">
                <img
                    src=""
                    alt=""
                    className="" 
                />
                <h1>LOGO</h1>
            </div>
            <div className="flex justify-between w-1/2">

                <div className="">
                    <h1 className="font-primary text-xl font-semibold">Resources</h1>
                    <ul className="flex mt-5 flex-col gap-3 w-0">

                        <a href=""><li className="font-secondary">FAQ's</li></a>
                        <a href=""><li className="font-secondary">Contact</li></a>
                        <a href=""><li className="font-secondary"></li></a>

                    </ul>
                </div>

                <div>
                    <h1 className="font-primary text-xl font-semibold">Connect</h1>

                    <ul className="flex mt-5 flex-col gap-3 w-0">

                        <a href=""><li className="font-secondary">Instagram</li></a>
                        <a href=""><li className="font-secondary">Twitter</li></a>
                        <a href=""><li className="font-secondary">LinkedIn</li></a>

                    </ul>
                </div> 

                <div>
                    <h1 className="font-primary text-xl font-semibold">Explore</h1>

                    <ul className="flex mt-5 flex-col gap-3 w-0">

                        <a href=""><li className="font-secondary">About</li></a>
                        <a href=""><li className=""></li></a>
                        <a href=""><li className=""></li></a>

                    </ul>
                </div> 

            </div>
            <p></p>
        </footer>
    </>
  )
}

export default Footer;