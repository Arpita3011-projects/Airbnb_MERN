
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
       type: String,
       required:true              // we are not writing username because, passport-local-mongoose automatically adds username, salt and hash,just import passwordlocalmongoose as plugin
 }                                // this also has methods to autheticate user registration , so we dont  have to do it from scratch

});
userSchema.plugin(passportLocalMongoose.default); //uses pbkdf2 hashing algorithm
module.exports=mongoose.model('User',userSchema);
