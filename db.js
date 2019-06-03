var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(`mongodb://${process.env.DB_CONNECT_VARIABLE}`);