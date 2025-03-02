import React from 'react'

function Footer () {
  return (
    <>
        <footer className="h-auto bg-gray-800 text-white flex flex-col justify-between items-center p-6">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold">LOGO</h1>
            </div>
            <div className="flex flex-col items-center w-full">

                <div className="mb-6 text-center">
                    <h1 className="font-primary text-xl font-semibold">Resources</h1>
                    <ul className="flex mt-4 flex-col gap-2">

                        <a href="" className="hover:underline"><li className="font-secondary">FAQ's</li></a>
                        <a href="" className="hover:underline"><li className="font-secondary">Contact</li></a>
                        <a href="" className="hover:underline"><li className="font-secondary">Support</li></a>

                    </ul>
                </div>

                <div className="mb-6 text-center">
                    <h1 className="font-primary text-xl font-semibold">Connect</h1>

                    <ul className="flex mt-4 flex-col gap-2">

                        <a href="" className="hover:underline"><li className="font-secondary">Instagram</li></a>
                        <a href="" className="hover:underline"><li className="font-secondary">Twitter</li></a>
                        <a href="" className="hover:underline"><li className="font-secondary">LinkedIn</li></a>

                    </ul>
                </div> 

                <div className="mb-6 text-center">
                    <h1 className="font-primary text-xl font-semibold">Explore</h1>

                    <ul className="flex mt-4 flex-col gap-2">

                        <a href="" className="hover:underline"><li className="font-secondary">About</li></a>
                        <a href="" className="hover:underline"><li className="font-secondary">Blog</li></a>
                        <a href="" className="hover:underline"><li className="font-secondary">Careers</li></a>

                    </ul>
                </div> 

            </div>
            <p className="mt-6 text-sm">&copy; 2023 Your Company. All rights reserved.</p>
        </footer>
    </>
  )
}

export default Footer;