const chai = require( 'chai' );
const expect = chai.expect;
const chaiHttp = require( 'chai-http' );

const { app } = require( '../server/server' );
const { User } = require( '../server/models/user' );

chai.use( chaiHttp );

beforeEach( ( done ) => {
	User.remove( {} ).then( () => done() );
} );

describe( "/POST User", () => {
	it( "Should save User in database", ( done ) => {
		var user = {
			"email": "test@mail.ru",
			"firstName": "Test",
			"lastName": "Tester"
		};
		chai.request( app )
			.post( '/user' )
			.send( user )
			.end( ( err, res ) => {
				if ( err ) {
					throw err;
				}
				expect( res.body.email ).to.equal( user.email );
				expect( res.body.firstName ).to.equal( user.firstName );
				expect( res.body.lastName ).to.equal( user.lastName );

				User.find( {} ).then( ( docs ) => {
					expect( docs ).to.have.length( 1 );
					done();
				} ).catch( ( e ) => done( e ) );

			} );

	} );

	it( "Should not save User with invalid data", ( done ) => {
		var user = {
			"email": "",
			"firstName": "Test",
			"lastName": "Tester"
		};
		chai.request( app )
			.post( '/user' )
			.send( user )
			.end( ( err, res ) => {
				expect( res.status ).to.equal( 500 );
				User.find( {} ).then( ( docs ) => {
					expect( docs ).to.have.length( 0 );
					done();
				} ).catch( ( e ) => done( e ) );

			} );

	} );

} );