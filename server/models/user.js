const bcrypt = require( 'bcryptjs' );
const jwt = require( "jsonwebtoken" );
const _ = require( "lodash" );

const { mongoose } = require( '../../config/server/default' );
const { parameters } = require( '../../config/server/parameters' );
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: [ true, "This field is required" ],
			trim: true,
			unique: [ true, "This email is already in use" ],
			match: [ /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email is not valid" ]
		},
		firstName: {
			type: String,
			required: [ true, "This field is required" ],
			minlength: [ 1, "First name can't have 1 symbol" ],
			maxlength: [ 20, "First name is too big" ]
		},
		lastName: {
			type: String,
			required: [ true, "This field is required" ],
			minlength: [ 3, "Last name can't have 1 symbol" ],
			maxlength: [ 30, "Last name is too big" ]
		},
		password: {
			type: String,
			required: [ true, "This field is required" ],
			minlength: [ 6, "Your password should have at least 6 characters" ],
			validate: [
				{
					validator( password ) {
						return password.search( /\d/ ) !== -1;
					},
					message: "Your password should contain at least 1 number"
				},
				{
					validator( password ) {
						return password.search( /[A-Z]/ ) !== -1;
					},
					message: "Your password should contain at least 1 capital letter"
				}
			]
		},
		tokens: [
			{
				access: {
					type: String,
					required: [ true, "Access property is required" ]
				},
				token: {
					type: String,
					required: [ true, "Token property is required" ]
				}
			}
		]
	}
);

UserSchema.statics.findByToken = function( token ) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify( token, process.env.JWT_SECRET || parameters.secret );
	} catch ( err ) {
		return Promise.reject();
	}
	return User.findOne( {
		_id: decoded._id,
		"tokens.token": token,
		"tokens.access": 'auth'
	} );
};

UserSchema.statics.login = function( email, password ) {
	var User = this;
	return User.findOne( { email } )
		.then( ( user ) => {
			if ( !user ) {
				return Promise.reject();
			}
			return bcrypt.compare( password, user.password ).then( ( matched ) => {
				if ( !matched ) {
					return Promise.reject();
				}
				return user;
			} );
		} );
};

UserSchema.methods.toJSON = function() {
	var user = this;
	return _.pick( user, [ "_id", "firstName", "lastName", "email" ] );
};

UserSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = 'auth';
	var token = jwt.sign( { _id: user._id.toHexString(), access }, process.env.JWT_SECRET || parameters.secret );
	user.tokens.push( { access, token } );
	return user.save().then( () => token );
};

UserSchema.pre( 'save', function( next ) {
	var user = this;
	if ( user.isModified( 'password' ) ) {
		bcrypt.genSalt( 10, ( err, salt ) => {
			if ( err ) {
				throw err;
			}
			bcrypt.hash( user.password, salt, ( err, hash ) => {
				user.password = hash;
				next();
			} );
		} );
	} else {
		next();
	}
} );

const User = mongoose.model( 'User', UserSchema );

module.exports = { User };