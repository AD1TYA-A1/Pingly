"use client";
import React from "react";
import { useState } from "react";
import "./components/Particles.css";

import Particles from "./components/lightbg";
import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();
  const [isHidden, setisHidden] = useState(false);
  console.log(isHidden);

  return (
    <div className=" w-screen h-screen bg-black  ">
      <div className="absolute inset-0">   {/* ← wrap Particles */}
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={2000}
          particleSpread={15}
          speed={0.2}
          particleBaseSize={150}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white lg:text-[100px] sm:text-[55px] text-[35px] font-bold">
        Admin-Chats
        <div className="  about   flex flex-col items-center justify-center  lg:bottom-[25%] text-center left-0 w-full lg:text-[20px] sm:text-[18px] text-[16px] p-4  ">
          Conqueror of the Chats
          <div
            onClick={() => {
              setisHidden(true);
              console.log(isHidden);
              setTimeout(() => {
                router.push("/logIn");
              }, 1000);
            }}
            className={`${isHidden ? "hidden" : ""
              } bg-amber-400 w-32 mt-10 text-black hover:w-54 h-10 flex items-center justify-center text-[23px] hover:h-12 hover:text-[25px] rounded-2xl hover:rounded-3xl cursor-pointer transition-all ease-in-out duration-[400ms] `}
          >
            Enroll
          </div>
          <div className={`  mt-10 ${isHidden ? "" : "hidden"}  three-body  `}>
            <div
              className={` mt-10 ${isHidden ? "" : "hidden"} three-body__dot`}
            ></div>
            <div
              className={` mt-10 ${isHidden ? "" : "hidden"} three-body__dot`}
            ></div>
            <div
              className={` mt-10 ${isHidden ? "" : "hidden"} three-body__dot`}
            ></div>
          </div>
        </div>
      </div>

      {/* <button
        className=" md:w-32 w-16 md:h-10 h-5 cursor-pointer bg-yellow-300 font-bold hover:bg-yellow-500 text-black hover:md:w-42 hover:w-21 transition-all duration-300 ease-in-out md:text-[30px] text-[15px]"
      >
        Submit
      </button> */}
    </div>
  );
};

export default page;
