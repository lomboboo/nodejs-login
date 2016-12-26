const chai = require( 'chai' );
const expect = chai.expect;
const chaiHttp = require( 'chai-http' );
const chaiSubset = require( 'chai-subset' );

const { app } = require( '../server/server' );
const { User } = require( '../server/models/user' );
const { user, populateUsers } = require( './seed/seed' );

chai.use( chaiHttp );
chai.use( chaiSubset );

beforeEach( populateUsers );

describe( "/POST User", () => {
	var userTwo = {
		"email": "usertwo@mail.ru",
		"firstName": "TestTwo",
		"lastName": "TesterTwo",
		"password": "ABC123"
	};
	it( "Should save User in database", ( done ) => {
		chai.request( app )
			.post( '/user' )
			.send( userTwo )
			.end( ( err, res ) => {
				expect( res.status ).to.equal( 200 );
				expect( res.body ).to.be.a( "object" );
				expect( res.body ).to.have.all.keys( "_id", "email" );
				expect( res.body.email ).to.equal( userTwo.email );

				User.find( {} ).then( ( docs ) => {
					expect( docs ).to.have.length( 2 );
					done();
				} ).catch( ( e ) => done( e ) );

			} );

	} );

	it( "Should not save User with invalid data", ( done ) => {
		var userBad = {
			"email": "",
			"firstName": "TestTwo",
			"lastName": "TesterTwo"
		};
		chai.request( app )
			.post( '/user' )
			.send( userBad )
			.end( ( err, res ) => {
				User.find( {} ).then( ( docs ) => {
					expect( docs ).to.have.length( 1 );
					done();
				} ).catch( ( e ) => done( e ) );
			} );

	} );

} );

describe( '/GET User', () => {

	it( 'should return one user by token', ( done ) => {
		chai.request( app )
			.get( '/user/me' )
			.set( 'x-auth', user.tokens[ 0 ].token )
			.end( ( err, res ) => {
				expect( res.body._id ).to.equal( user._id.toHexString() );
				expect( res.body.email ).to.equal( user.email );
				expect( res.body.firstName ).to.equal( user.firstName );
				expect( res.body.lastName ).to.equal( user.lastName );
				done();
			} );
	} );
	it( 'should return 401 if not authenticated', ( done ) => {
		chai.request( app )
			.get( '/user/me' )
			.end( ( err, res ) => {
				expect( res.status ).to.equal( 401 );
				done();
			} );
	} );
} );
