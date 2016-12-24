const { mongoose } = require( '../../config/server/default' );

const User = mongoose.model( 'User', {
	email: {
		type: String,
		required: [ true, "email is required" ],
		trim: true,
		unique: [ true, "This email is already in use" ],
		match: [ /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email is not valid" ]
	},
	firstName: {
		type: String,
		required: true,
		minlength: [ 1, "First name can't have 1 symbol" ],
		maxlength: [ 20, "First name is too big" ]
	},
	lastName: {
		type: String,
		required: true,
		minlength: [ 3, "Last name can't have 1 symbol" ],
		maxlength: [ 30, "Last name is too big" ]
	}
} );

module.exports = { User };