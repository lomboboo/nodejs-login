const express = require( 'express' );
const app = express();
const path = require( 'path' );
const bodyParser = require( 'body-parser' );

const { config } = require( '../config/server/default' );
const publicPath = path.join( __dirname, '../frontend' );
const { userRouter } = require( './routes/user' );

/***********************************************/
                /* MIDDLEWARE */
/***********************************************/
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