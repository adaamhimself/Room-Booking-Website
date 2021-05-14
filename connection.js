/*const mongoString = "mongodb+srv://web322-admin:wSQC0aM8RGJHGWCv@cluster0.5yzzy.mongodb.net/test?authSource=admin&replicaSet=atlas-gdv2fb-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
var mongoose = require("mongoose");

// avoid deprecations
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const connection = mongoose.createConnection(mongoString, { useNewUrlParser: true });
mongoose.connection.on("open", () => {
    console.log("Database connection open.");
});

exports.mongoose = mongoose;
exports.connection = connection;*/