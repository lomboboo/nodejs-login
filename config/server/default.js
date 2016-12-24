const env = process.env.NODE_ENV || "development";
const mongoose = require( 'mongoose' );
const { parameters } = require( './parameters' );
mongoose.Promise = global.Promise;

if ( env === 'development' ) {
	process.env.PORT = 4000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/test-me';
} else if ( env === 'test' ) {
	process.env.PORT = 4000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/test-me-TEST';
} else {
	process.env.MONGODB_URI = parameters.mongoProductionUrl;
}

mongoose.connect( process.env.MONGODB_URI, ( err ) => {
	if ( err ) {
		console.log( 'Unable to connect to the server. Please start the server. Error:', err );
	} else {
		console.log( `Connected to Server successfully! ENV********** ${env}` );
	}
} );

module.exports = { mongoose };