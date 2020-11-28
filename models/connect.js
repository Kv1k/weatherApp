var mongoose = require('mongoose');
require('dotenv').config();


var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
}
mongoose.connect(`mongodb+srv://dbKv1k:${process.env.dbKey}.@cluster0.1b4uq.mongodb.net/dbKv1k?retryWrites=true&w=majority`, 

    options,         
    function(error){
      if (error) {
        console.log(error);
      } else {
        console.log("connection ok");
      }
    }
);