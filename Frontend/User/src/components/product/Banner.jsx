import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosInstance from "../../utils/axiosConfig";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axiosInstance.get(`/user/banner`);
        setBanners(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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
    autoplaySpeed: 2000,
  };

  return (
    <div className="w-[94%] mx-auto sm:w-full h-[350px] my-10 md:px-4">
      {loading ? (
        <Skeleton height={350} width="100%" />
      ) : (
        <Slider {...settings}>
          {banners.map((item, index) => (
            <div key={index} className="relative h-[350px] rounded-lg">
              <img
                src={`${item.publicId}`}
                alt="Banner"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center z-10">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {item.title}
                  </h2>
                  <p className="text-lg text-white">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default Banner;
