const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/loginRegister",{
    useCreateIndex:true,
    useFindAndModify:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("connection established")
}).catch((e)=>{
console.log("connection unsuccessful")
});
