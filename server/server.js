const express = require( 'express' );
const { parameters } = require( '../config/server/parameters' );
const passport = require( 'passport' );
const FacebookStrategy = require( 'passport-facebook' ).Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const { User } = require( './models/user' );
/***********************************************/
/* Google Auth */
/***********************************************/
passport.use( new GoogleStrategy( {
		clientID: parameters.googleId,
		clientSecret: parameters.googleSecret,
		callbackURL: "http://localhost:4001/user/auth/google/callback",
		passReqToCallback: true
	}, ( request, accessToken, refreshToken, profile, done ) => {
		User.findByPassportToken( accessToken, "google" )
			.then( ( user ) => {
				if ( user ) {
					console.log( "A" );
					done( null, user );
				}
				const newUser = new User(
					{
						name: profile.displayName,
						email: profile.emails[ 0 ].value,
						password: User.generateRandomPassword()
					}
				);
				newUser.save()
					.then( ( usr ) => usr.generateAuthToken() )
					//.then( ( res ) => res.user.savePassportToken( accessToken, "google" ) )
					.then( ( resul ) => {
						console.log( "B" );
						done( null, resul.user );
					}, ( err ) => console.log( "ERR", err ) );
			} )
			.catch( ( err ) => {
				console.log( "CATCH", err );
			} );
	}
) );

const app = express();
const path = require( 'path' );
const bodyParser = require( 'body-parser' );
const mailer = require( 'express-mailer' );
const { config } = require( '../config/server/default' );

const publicPath = path.join( __dirname, '../frontend' );
const { userRouter } = require( './routes/user' );
/***********************************************/
                /* MIDDLEWARE */
/***********************************************/
if ( process.env.NODE_ENV === 'development' ) {
  const morgan = require( "morgan" );
  //use morgan to log at command line
  app.use( morgan( 'combined' ) ); //'combined' outputs the Apache style LOGs
}
app.use( bodyParser.json() );
app.use( express.static( publicPath ) );
app.use( passport.initialize() );

app.set( 'views', `${__dirname}/mailerViews` );
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

/***********************************************/
                /* ROUTES */
/***********************************************/

app.use( '/user', userRouter );
app.get( '/email', ( req, res, next ) => {
	app.mailer.send(
		{
			template: 'email',
			from: "Testme <testme@testme.pl>"
		},
		{
		to: 'lomboboo@gmail.com',
		subject: 'Potwierdź rejestracje'
	}, ( err ) => {
		if ( err ) {
			console.log( err );
			res.send( 'There was an error sending the email' );
			return;
		}
		res.send( 'Email Sent' );
	} );
} );

/***********************************************/
                /* SERVER */
/***********************************************/

app.listen( process.env.PORT, () => {
  console.log( `SERVER is running on port ${process.env.PORT}` );
} );

module.exports = { app };