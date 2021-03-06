const mongoose = require('mongoose');
const { Schema } = mongoose;
var userSchema = new mongoose.Schema({
    _id:   {    
        type:String,
        lowercase:true,
        required:true
    },
    name:  {    
        type:String,
        required:true
    },
    email: {    
        type:String,
        required:true
    },
    password: {    
        type:String,
        required:true
    },
    vaccinations:{  malaria: {type:Boolean, default:false},
                    hepatitisA:{type:Boolean, default:false},
                    hepatitisB:{type:Boolean, default:false},
                    yellowFever:{type:Boolean, default:false},
                    tyfoid:{type:Boolean, default:false},
                    dtp:{type:Boolean, default:false},
                    cholera:{type:Boolean, default:false}
    },
    languages: {
        type:[String],
        default:[]
    }
});

module.exports = mongoose.model(
     'user', userSchema, 'users' );


