const path 			= require('path');
const mode 			= process.env.NODE_ENV || 'development';

let envVar = path.resolve(process.cwd(), '.env');

if(mode == 'production'){
	envVar = path.resolve(process.cwd(), 'production.env');	
}

require('dotenv').config({path: envVar});

// You'll want to set these with either `CLIENT_ID=abc zapier test` or `zapier env 1.0.0 CLIENT_ID abc`
process.env.BASE_URL = process.env.BASE_URL || 'https://taskunify.com';
process.env.API_BASE_URL = process.env.API_BASE_URL || 'https://api.taskunify.com';
process.env.CLIENT_ID = process.env.CLIENT_ID || '1049805300775-3uam0bulfploheib8681njqdbhh5h5g9.task-unify-oa2-client.com';
process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || 'MTA0OTgwNTMwMDc3NS0zdWFtMGJ1bGZwbG9oZWliODY4MW5qcWRiaGg1aDVnOS50YXNrLXVuaWZ5LW9hMi1jbGllbnQuY29t';


const authentication = require('./authentication');
const recipe = require('./triggers/recipe')

// To include the Authorization header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeBearerToken = (request, z, bundle) => {
	if (bundle.authData.access_token) {
    	request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  	}
  	return request;
};

const App = {
	// This is just shorthand to reference the installed dependencies you have. Zapier will
	// need to know these before we can upload
	version: require('./package.json').version,
	platformVersion: require('zapier-platform-core').version,

	authentication: authentication,

	beforeRequest: [includeBearerToken],

	afterResponse: [],

	resources: {},

	// If you want your trigger to show up, you better include it here!
	triggers: {
		[recipe.key]: recipe
	},

	// If you want your searches to show up, you better include it here!
	searches: {},

	// If you want your creates to show up, you better include it here!
	creates: {}
};

// Finally, export the app.
module.exports = App;
