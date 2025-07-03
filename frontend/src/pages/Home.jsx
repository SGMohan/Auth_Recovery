import { useState, useEffect } from "react";
import AppHeader from "../Components/AppHeader";
import Header from "../Components/Header";
import bg_img from "../assets/bg_img.png";
import Loading from "../Components/Loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  // Simulate loading data (replace with your actual data fetching)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false when data is ready
    }, 500); // Simulating 2 seconds loading time

    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

  return (
    <>
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg_img})` }}
        >
        {isLoading && <Loading />}
        <AppHeader />
        <Header />
      </div>
    </>
  );
};

export default Home;
