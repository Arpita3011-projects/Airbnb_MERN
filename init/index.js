const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


require("dotenv").config();

const MONGO_URL = process.env.ATLASDB_URL;

async function main(){
   await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
   try {
      await Listing.deleteMany({});
      initData.data = initData.data.map((obj)=>({
                ...obj,
                owner: new mongoose.Types.ObjectId("6a3e82d7d55e3a28a3205a38"),

      }));
   
      await Listing.insertMany(initData.data);
   } catch (err) {
      console.error('initDB error:', err);
   }
};

main()
  .then(async ()=>{
    await initDB();
    process.exit(0);
  })
  .catch((err)=>{
    console.error('Mongo connect error:',err);
    process.exit(1);
  });

