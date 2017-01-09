const ObjectID = require( "mongoose" ).Types.ObjectId;
const jwt = require( "jsonwebtoken" );

const { parameters } = require( "../../config/server/parameters" );
const { User } = require( '../../server/models/user' );

const userIDOne = new ObjectID();
const user = {
	_id: userIDOne,
	email: "test@mail.ru",
	name: "Test Tester",
	password: "ABC123",
	tokens: [
		{
			"access": "auth",
			"token": jwt.sign( { access: "auth", _id: userIDOne }, process.env.JWT_SECRET || parameters.secret )
		}
	]
};

const populateUsers = ( done ) => {
	User.remove( {} )
		.then( () => {
			var newUserOne = new User( user ).save();
			return Promise.all( [ newUserOne ] );
		} )
		.then( () => done() );
};

module.exports = { user, populateUsers };
