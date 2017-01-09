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
		"name": "TestTwo TesterTwo",
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
			"name": "TestTwo TesterTwo"
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
				expect( res.body.name ).to.equal( user.name );
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

describe( '/DELETE User', () => {
	it( 'should return ok if removed', ( done ) => {
		chai.request( app )
			.delete( '/user/me' )
			.set( 'x-auth', user.tokens[ 0 ].token )
			.end( ( err, res ) => {
				User.find( {} )
					.then( ( docs ) => {
						expect( docs.length ).to.equal( 1 );
					} );
				expect( res.status ).to.equal( 200 );
				expect( res.body.ok ).to.equal( 1 );
				done();
			} );
	} );
	it( 'should return 401 if not authenticated', ( done ) => {
		chai.request( app )
			.get( '/user/me' )
			.set( 'x-auth', "dasdadasas23231jh3k12j31h31" )
			.end( ( err, res ) => {
				expect( res.status ).to.equal( 401 );
				done();
			} );
	} );
} );

describe( '/POST User login', () => {
	it( 'should return user and set Token', ( done ) => {
		chai.request( app )
			.post( '/user/login' )
			.send( {
				email: user.email,
				password: user.password
			} )
			.end( ( err, res ) => {
				expect( res.status ).to.equal( 200 );
				expect( res.header[ 'x-auth' ] ).to.equal( user.tokens[ 0 ].token );
				done();
			} );
	} );
	it( 'should return 400 if bad credentials', ( done ) => {
		chai.request( app )
			.post( '/user/login' )
			.send( {
				email: "example@mail.ru",
				password: "123"
			} )
			.end( ( err, res ) => {
				expect( res.status ).to.equal( 400 );
				expect( res.body.message ).to.equal( "Bad credentials." );
				done();
			} );
	} );
} );

