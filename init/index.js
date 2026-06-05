const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


const MONGO_URL='mongodb://127.0.0.1:27017/wonderlust';

async function main(){
   await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
   try {
      await Listing.deleteMany({});
      console.log('Deleting old documents');
      console.log('Inserting', initData.data.length, 'items');
      await Listing.insertMany(initData.data);
      console.log('data was initialized');
   } catch (err) {
      console.error('initDB error:', err);
   }
};

main()
  .then(async ()=>{
    console.log('connected to database');
    await initDB();
    process.exit(0);
  })
  .catch((err)=>{
    console.error('Mongo connect error:', err);
    process.exit(1);
  });