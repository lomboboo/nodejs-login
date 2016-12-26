const { User } = require( '../models/user' );

var Authenticate = ( req, res, next ) => {
	var token = req.header( 'x-auth' );

	User.findByToken( token )
		.then( ( user ) => {
			if ( !user ) {
				return Promise.reject();
			}
			req.user = user;
			req.token = token;
			next();
		} )
		.catch( ( err ) => {
			res.status( 401 ).send( {
					message: "Token is invalid or is not provided"
				} );
		} );
};

module.exports = { Authenticate };