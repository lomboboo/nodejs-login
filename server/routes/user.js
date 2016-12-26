const express = require( 'express' );
const userRouter = express.Router();
const _ = require( "lodash" );

const { User } = require( '../models/user' );
const { Authenticate } = require( '../middleware/authenticate' );

userRouter.post( '/', ( req, res, next ) => {
	var user = new User( _.pick( req.body, [ "email", "firstName", "lastName", "password" ] ) );

	user.save()
		.then( ( newUser ) => user.generateAuthToken() )
		.then( ( token ) => {
			res.header( 'x-auth', token ).status( 200 ).send( { _id: user._id, email: user.email } );
		} )
		.catch( ( err ) => {
		res.status( 500 ).send( {
			message: err
		} );
	} );
} );

userRouter.get( '/me', Authenticate, ( req, res ) => {
	res.status( 200 ).send( req.user );
} );

userRouter.delete( '/me', Authenticate, ( req, res ) => {
	User.remove( { _id: req.user._id } )
		.then( ( user ) => {
			res.status( 200 ).send( user );
		} )
		.catch( ( err ) => {
			throw err;
		} );
} );

module.exports = { userRouter };
