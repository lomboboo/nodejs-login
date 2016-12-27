const express = require( 'express' );
const userRouter = express.Router();
const _ = require( "lodash" );
const bcrypt = require( "bcryptjs" );

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

userRouter.post( '/login', ( req, res ) => {
	var email = req.body.email;
	var password = req.body.password;
	User.login( email, password )
		.then( ( user ) => {
			res.header( 'x-auth', user.tokens[ 0 ].token ).status( 200 ).send( user );
		} )
		.catch( ( err ) => {
			res.status( 400 ).send( {
				message: "Bad credentials."
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
