import header_img from "../assets/header_img.png";
import hand_wave from "../assets/hand_wave.png";
import { useApp } from "../Context/AppContext";

const Header = () => {
  const {userDetails} = useApp();
  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">
      <img
        src={header_img}
        alt="Header"
        className="w-36 h-36 rounded-full mb-4"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userDetails?.name || "Developer"} !{" "}
        <img src={hand_wave} alt="Hand Emoji" className="w-6 aspect-square" />
      </h1>
      <h2 className="font-semibold text-3xl sm:text-5xl mb-4">
        Welcome to our app
      </h2>
      <p className="mb-8 max-w-md ">
        Let's start with a quick product tour and we will have you up and
        running in no time!
      </p>
      <button className="border border-gray-600 px-8 py-2.5 rounded-full hover:bg-gray-100 hover:cursor-pointer transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
