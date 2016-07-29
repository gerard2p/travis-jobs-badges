"use strict";
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var port = process.env.port || 62626;
var host = 'http://localhost' + (port != 80 ? ':' + port : '');

var DEBUG = env !== 'production'

module.exports = {
	//http://koajs.com/#application
	name: "koaton",
	keys: ['9184f115438655076a7675827bbfa1d98745217f'],
	env: env,
	port: port,
	//https://github.com/koajs/static#options
	static: {
		directory: path.resolve(__dirname, '../public')
	},
	//https://github.com/koajs/body-parser#options
	bodyparser: {},
	//https://github.com/koajs/generic-session#options
	session: {
		maxAge: 1000 * 60 * 60 * 24,
		key:"543a32d30b4f6d83ba1934e86e67f5abc9dd98e9552b1ab7429849f352f35b8a6d2929d46a8fcb1e1e603d581e4b6322"
	},
	//https://github.com/rkusa/koa-passport
	auth: {
		//https://github.com/jaredhanson/passport-facebook
		facebook: {
			clientID: 'your-client-id',
			clientSecret: 'your-secret',
			callbackURL: host + '/auth/facebook/callback'
		},
	},
	//https://github.com/koajs/ejs
	view: {
		map: {
			html: 'handlebars'
		}
		//cache: DEBUG ? false : 'memory',
		//locals: require('./view-locals'),
		//filters: require('./view-filters'),
		//layout: 'layouts/main',
	},
	error: {
		view: 'error/error',
		layout: 'layouts/error',
		custom: {
			401: 'error/401',
			403: 'error/403',
			404: 'error/404',
		},
	},
}
