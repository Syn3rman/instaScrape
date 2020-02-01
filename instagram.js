const puppeteer = require('puppeteer');
// const creds = require('./creds');
const request = require('request');


const url = 'https://www.instagram.com/accounts/login/?source=auth_switcher'
const profile = (handle)=>{
	return `https://www.instagram.com/${handle}/`
}


let instagram = {
	browser: null,
	page: null,

	initialize: async ()=>{
		instagram.browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
		instagram.page = await instagram.browser.newPage();
	},

	login: async ()=>{
		await instagram.page.goto(url, {waitUntil: 'networkidle2'});
		await instagram.page.waitFor("input[name='username']");

		// Login to the account
		await instagram.page.type("input[name='username']", creds.username, {delay: 100});
		await instagram.page.type("input[name='password']", creds.password, {delay: 100});
		await instagram.page.click("button[type='submit']");	
	},
	scrapePublicProfile: async (handle, limit)=>{
		profilePage = profile(handle);	
		console.log(profilePage);
		result = []
		count = 0 
		// Implement feature to stop after either getting {{ limit }} posts or if no new element is selectded for say 10 iterations
		len_over_time = []
		await instagram.page.goto(profilePage, {waitUntil: 'networkidle2'});
		await instagram.page.waitFor('a>div>div.KL4Bh', {waitFor: 2000})
		.catch(()=>{
			return [];
		});
		let flag = true;
		while(count<limit && flag){
			const nodes = await instagram.page.$$("a>div>div.KL4Bh")
			.catch(()=>
			{
				return [];
			});
			if(nodes.length==0){
				return [];
			}
			console.log('Selected nodes: ', nodes.length);
			for(let i=0;i<nodes.length;i++){
				res = await instagram.page.evaluate(el => el.firstChild.src, nodes[i]);
				if(!result.includes(res)){
					result.push(res);
					count+=1;
				} 
			}
			len_over_time.push(result.length);
			if(len_over_time.length>5){
				if(new Set(len_over_time.slice(-5)).size>1){
					flag = false;
				}
			}
			console.log(len_over_time.slice(-5));
			console.log(new Set(len_over_time.slice(-5)).size>1);
			await instagram.page.evaluate(_ => {
				window.scrollBy(0, window.innerHeight);
			});
			await instagram.page.waitFor(3000);
		}
		// instagram.download(result, handle);
		return result.slice(0,limit);	
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
				console.log(body);
			});
	},
	close: async ()=>{
		await instagram.browser.close();
	},
}

module.exports = instagram;