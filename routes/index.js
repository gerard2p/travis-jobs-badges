"use strict";
const path = require('path');
const request = require('request-promise');
const utils = require('koaton/bin/utils');
const send = require('koaton/node_modules/koa-send');
module.exports=(router)=>{
	router.public.get('/:user/:repo/:branch.svg',function *(next){
		this.layout="";
		 var options = {
		    url: `https://api.travis-ci.org/repos/${this.params.user}/${this.params.repo}/branches/${this.params.branch}`,
		    headers: {
		         'Accept': 'application/vnd.travis-ci.2+json'
		       },
		       json: true
		   };
		   let trim = 10;
		   let travis = yield request(options);
		   let svgdir = yield utils.mkdir(path.join(process.cwd(),"badages",this.params.user,this.params.repo,this.params.branch),-1);
		   let svgfile = path.join(svgdir,`${travis.branch.id}.svg`);
		   if(utils.canAccess(svgfile)){
		   	 yield send(this, path.join("badages",this.params.user,this.params.repo,this.params.branch,`${travis.branch.id}.svg`),{gzip:true});
		   	//let data = yield utils.read(svgfile,'utf-8');
		   	//	this.body = data;
		   		return;
		   }

		   options.url = `https://api.travis-ci.org/builds/${travis.branch.id}`;
		   let jobs = yield request(options);
		   let elements = jobs.build.job_ids.length+1;
		   let titlelenn = `Branch ${this.params.branch}`.length;
		   let width = titlelenn*5.5+10*2;

		   let text = "";
		   let pills= "";
		   for(let index in jobs.jobs){
		   		let job=jobs.jobs[index];
		   		let label = job.config.env.match(/BITSUN_TRAVIS=(.*)/)[1];
		   		label = label?label:`Build ${job.id}`;
		   		if(titlelenn<label.length){
		   			titlelenn = label.length;
		   		}
		   		pills+=`<rect x="${trim/2}" y="${(parseInt(index)+1)*20-1}" rx="3" width="${width-trim}" height="16" fill="${job.state==="passed"?"#4c1":"#db4545"}"/>`;
		   		text +=`<text x="${width/2}" y="${(parseInt(index)+1)*20+11}" fill="#010101" fill-opacity=".3">${label}</text>
		   		<text x="${width/2}" y="${(parseInt(index)+1)*20+10}">${label}</text>`;
		   	}

		   let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${20*elements}">
		   	<linearGradient id="a" x2="0" y2="100%">
		   		<stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
		   		<stop offset="1" stop-opacity=".1"/>
		   	</linearGradient>
		   	<rect rx="3" width="${width}" height="${20*elements}" fill="#555" ry="3"></rect>
		   	${pills}
		   	<rect rx="3" width="${width}" height="${20*elements}" fill="url(#a)"/>
		   	<g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
		   		<text x="${width/2}" y="15" fill="#010101" fill-opacity=".3">Branch ${this.params.branch}</text>
		   		<text x="${width/2}" y="14">Branch ${this.params.branch}</text>${text}
		   	</g>
		   	</svg>`.replace(/\t/igm,' ').replace(/\n|\r/igm,' ').replace(/ +/igm,' ').replace(/> /igm,'>').replace(/ </igm,'<');
		   	yield utils.write(svgfile,svg);
		   this.body=svg;
	});
};
