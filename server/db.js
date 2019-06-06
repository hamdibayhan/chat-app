var mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_CONNECT_VARIABLE}`);