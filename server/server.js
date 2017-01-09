const express = require( 'express' );
const app = express();
const path = require( 'path' );
const bodyParser = require( 'body-parser' );
const mailer = require( 'express-mailer' );

const { config } = require( '../config/server/default' );
const { parameters } = require( '../config/server/parameters' );
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
/*app.all( '*', ( req, res ) => {
	res.redirect( "/" );
} );*/

/***********************************************/
                /* SERVER */
/***********************************************/

app.listen( process.env.PORT, () => {
  console.log( `SERVER is running on port ${process.env.PORT}` );
} );

module.exports = { app };