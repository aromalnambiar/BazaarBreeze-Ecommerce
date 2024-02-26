const Banner=require('../../models/Banner');

const viewBanners=async(req,res)=>{
    try {
        const banners=await Banner.find();
        res.status(200).json(banners);
    } catch (error) {

        console.log("Error : ",error);
    }
}


module.exports={
    viewBanners
}