const puppeteer = require('puppeteer');
const request = require('request');
require('dotenv').config()


const url = 'https://www.instagram.com/accounts/login/?source=auth_switcher'
const profile = (handle)=>{
	return `https://www.instagram.com/${handle}/`
}


let instagram = {
	browser: null,
	page: null,

	initialize: async ()=>{
		instagram.browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
		instagram.page = await instagram.browser.newPage();
	},

	login: async ()=>{
		await instagram.page.goto(url, {waitUntil: 'networkidle2'});
		await instagram.page.waitFor("input[name='username']");

		// Login to the account
		await instagram.page.type("input[name='username']", process.env.USERNAME, {delay: 100});
		await instagram.page.type("input[name='password']", process.env.PASSWORD, {delay: 100});
		await instagram.page.click("button[type='submit']");
		await instagram.page.waitFor(3000);
	},
	scrapePublicProfile: async (handle, limit)=>{
		profilePage = profile(handle);
		// console.log(profilePage);
		let result = [];
		let count = 0;
		let len_over_time = [];
		await instagram.page.goto(profilePage, {waitUntil: 'networkidle2'});
		await instagram.page.waitFor('a>div>div.KL4Bh', {waitFor: 2000})
		let flag = true;
		while(count<limit && flag){
			const nodes = await instagram.page.$$("a>div>div.KL4Bh")
			if(nodes.length==0){
				return [];
			}
			for(let i=0;i<nodes.length;i++){
				res = await instagram.page.evaluate(el => el.firstChild.src, nodes[i]);
				if(!result.includes(res)){
					result.push(res);
					console.log(res);
					count+=1;
				}
				result = result.slice(-100);
			}
			len_over_time.push(result.length);
			if(len_over_time.length>50){
				if(new Set(len_over_time.slice(-50)).size === 1){
					return result;
					// await instagram.login();
					// flag = false;
				}
			}
			await instagram.page.evaluate(_ => {
				window.scrollBy(0, window.innerHeight);
			});
			await instagram.page.waitFor(3000);
		}
		return result;
	},
	// use this function only when the flask server is up and running on your local machine
	download: async (urls, handle)=>{
		await request({
				uri: "http://localhost:5000/downloadImages",
				method: "POST",
				body: {
					nprocs: 8,
					urls: urls,
					handle: handle
				},
				json: true,
				}, function(error, response, body) {
				console.log("Success");
			});
	},
	close: async ()=>{
		await instagram.browser.close();
	},
}

module.exports = instagram;