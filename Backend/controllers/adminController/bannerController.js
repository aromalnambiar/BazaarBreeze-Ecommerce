const Banner=require('../../models/Banner');

const addBanner = async (req, res) => {
    try {
        console.log("Req body : ",req.body);
        console.log("Req file : ",req.file);
        const { title, description, imageUrl, link, startDate, endDate, isActive } = req.body;

        const newBanner = new Banner({
            title,
            description,
            imageUrl:req.file.filename,
            link,
            startDate,
            endDate,
            isActive,
        });

        const savedBanner = await newBanner.save();

        res.status(201).json(savedBanner);
    } catch (error) {
        console.error('Error adding banner:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editBanner = async (req, res) => {
    try {
        const bannerId  = req.params.id; 
        const { title, description, imageUrl, link, startDate, endDate, isActive } = req.body;

        const existingBanner = await Banner.findById(bannerId);

        if (!existingBanner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        existingBanner.title = title;
        existingBanner.description = description;
        existingBanner.imageUrl = imageUrl;
        existingBanner.link = link;
        existingBanner.startDate = startDate;
        existingBanner.endDate = endDate;
        existingBanner.isActive = isActive;

        const updatedBanner = await existingBanner.save();

        res.json(updatedBanner);
    } catch (error) {
        console.error('Error editing banner:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const viewBanners=async(req,res)=>{
    try {
        const banners=await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        console.log("Error : ",error);
    }
}

const getBanner=async(req,res)=>{
    try {
        const {bannerId}=req.params;
        const result=await findById(bannerId);
        res.status(200).json(result);
    } catch (error) {
        console.log("error : ",error);
    }
}
module.exports={
    addBanner,
    editBanner,
    viewBanners,
    getBanner
}