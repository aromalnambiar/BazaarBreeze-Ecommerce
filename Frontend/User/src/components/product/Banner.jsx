import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BASE_URL } from "../../../config";

function Banner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/user/banner`);
        setBanners(result.data);
        console.log("result : ", result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Set the autoplay interval in milliseconds (5 seconds in this example)
  };

  return (
    <Slider {...settings} className="w-[94%] mx-auto  sm:w-full h-[350px] my-10 md:px-4">
      {banners.map((item, index) => (
        <div key={index} className="relative h-[350px] rounded-lg over">
          <img src={`${BASE_URL}/uploads/${item.imageUrl}`} alt="Banner" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="text-center z-10">
              <h2 className="text-4xl font-bold text-white mb-2">{item.title}</h2>
              <p className="text-lg text-white">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}

export default Banner;
