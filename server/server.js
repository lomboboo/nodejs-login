const express = require( 'express' );
const app = express();
const path = require( 'path' );
const bodyParser = require( 'body-parser' );
const morgan = require( "morgan" );

const { config } = require( '../config/server/default' );
const publicPath = path.join( __dirname, '../frontend' );
const { userRouter } = require( './routes/user' );

/***********************************************/
                /* MIDDLEWARE */
/***********************************************/
if ( process.env.NODE_ENV !== 'test' ) {
  //use morgan to log at command line
  app.use( morgan( 'combined' ) ); //'combined' outputs the Apache style LOGs
}
app.use( bodyParser.json() );
app.use( express.static( publicPath ) );

/***********************************************/
                /* ROUTES */
/***********************************************/

app.use( '/user', userRouter );

/***********************************************/
                /* SERVER */
/***********************************************/

app.listen( process.env.PORT, () => {
  console.log( `SERVER is running on port ${process.env.PORT}` );
} );

module.exports = { app };