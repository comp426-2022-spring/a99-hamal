const mongoose = require( 'mongoose' );
const { Schema } = mongoose;
var logSchema = new mongoose.Schema({
    remote_addr: String, 
    remote_user: String, 
    date: Date,
    method: String, 
    url: String, 
    protocol: String,
    http_version: String, 
    status: Number, 
    content_length: Number,
    referrer_url: String,            
    user_agent: String
});
module.exports = mongoose.model(
     'log', logSchema, 'Logs' );


