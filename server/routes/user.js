const express = require( 'express' );
const userRouter = express.Router();
const _ = require( "lodash" );
const bcrypt = require( "bcryptjs" );
const app = express();
const mailer = require( 'express-mailer' );
const { parameters } = require( '../../config/server/parameters' );

app.set( 'views', `${__dirname}/../mailerViews` );
app.set( 'view engine', 'jade' );
/***********************************************/
/* MAILER */
/***********************************************/

mailer.extend( app, {
	from: 'rejestracja@testme.pl',
	host: 'mail.geekbrain.pl', // hostname
	secureConnection: true, // use SSL
	port: 465, // port for secure SMTP
	transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
	auth: {
		user: parameters.mailerUsername,
		pass: parameters.mailerPassword
	}
} );

const { User } = require( '../models/user' );
const { Authenticate } = require( '../middleware/authenticate' );

userRouter.post( '/', ( req, res, next ) => {
	var user = new User( _.pick( req.body, [ "email", "firstName", "lastName", "password" ] ) );

	user.save()
		.then( ( newUser ) => newUser.generateEmailToken() )
		.then( ( token ) => {
			app.mailer.send(
				{
					template: 'email',
					from: "Testme <testme@testme.pl>"
				},
				{
					to: user.email,
					subject: 'Potwierdź rejestracje',
					emailToken: token
				},
				( err ) => {
					if ( err ) {
						console.log( err );
						res.send( 'There was an error sending the email' );
						return;
					}
					res.send( 'Email Sent' );
				} );
		} )
		.catch( ( err ) => {
		res.status( 500 ).send( {
			message: err
		} );
	} );
} );

userRouter.get( '/confirm', ( req, res, next ) => {
	var emailToken = req.query.emailToken;

	User.findByEmailToken( emailToken )
		.then( ( user ) => user.generateAuthToken() )
		.then( ( result ) => {
			res.header( 'x-auth', result.token ).status( 200 ).send( { _id: result.user._id, email: result.user.email } );
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
