import image from "../../assets/images/Image.png";

function ShopWithCategories() {
  return (
    <>
      <div className="max-w-[1020px] mx-auto ">
        <h1 className="text-center my-20 text-xl text-[#191C1F] font-bold">Shop with categories</h1>
        <div className="md:max-w-[1020px] whitespace-nowrap overflow-x-scroll no-scrollbar">
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
          <div className="inline-block">
            <img src={image} alt="" srcSet="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ShopWithCategories;
