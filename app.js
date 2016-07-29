"use strict";
var config = require('./config/server');
var koaton = require('koaton');
var logger = require('koa-logger');
/*const ks = require('koa-socket');
const io = new ks();
const locale = require('koa-locale');
const i18n = require('koa-i18n');
const passport = require('koa-passport');*/

//locale(koaton);
/*koaton.use(i18n(koaton, {
	directory: './config/locales',
	locales: ['en'],
	modes: [
        'query', //  optional detect querystring - `/?locale=en-US`
        'subdomain', //  optional detect subdomain   - `zh-CN.koajs.com`
        'cookie', //  optional detect cookie      - `Cookie: locale=zh-TW`
        'header', //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
        'url', //  optional detect url         - `/en`
        'tld' //  optional detect tld(the last domain) - `koajs.cn`
    ]
}));*/

//koaton.use(require('koa-helmet')());
koaton.use(require('koa-bodyparser')(config.bodyparser));
//koaton.use(require('koa-static')(config.static.directory, config.static));
koaton.use(require('koa-etag')());

//koaton.keys = config.keys;
//koaton.use(require('koa-session')(koaton));

/*koaton.use(passport.initialize());
koaton.use(passport.session());
if(koaton.oAuth2Server){
    koaton.use(koaton.oAuth2Server);
}*/
koaton.use(koaton.views);
//koaton.use(koaton.router.protected);
koaton.use(koaton.router.public);


//============================================
/*io.attach(koaton);
io.on('join', (ctx, data) => {
	console.log('join event fired', data)
});*/
//============================================
koaton.start(config.port);
