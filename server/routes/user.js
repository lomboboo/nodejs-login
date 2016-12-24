const express = require( 'express' );
const userRouter = express.Router();

const { User } = require( '../models/user' );

userRouter.post( '/', ( req, res, next ) => {
	var user = new User( {
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	} );

	user.save().then( ( newUser ) => {
		res.status( 200 ).send( newUser );
	}, ( err ) => {
		res.status( 500 ).send( {
			message: err
		} );
	} );
} );

module.exports = { userRouter };
