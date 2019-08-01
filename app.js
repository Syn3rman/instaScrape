const puppeteer = require('puppeteer');
const creds = require('./creds');

const url = 'https://www.instagram.com/accounts/login/?source=auth_switcher'
const profile = (handle)=>{
	return `https://www.instagram.com/${handle}/`
}


let instagram = {
	browser: null,
	page: null,

	initialize: async ()=>{
		instagram.browser = await puppeteer.launch({headless: false});
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
	scrapeProfile: async (handle)=>{
		profilePage = profile(handle);	
		console.log(profilePage);
		result = []
		count = 0 
		await instagram.page.goto(profilePage, {waitUntil: 'networkidle2'});
		await instagram.page.waitFor('a>div>div.KL4Bh');
		while(count<100){
			console.log(result.length, count);
			const nodes = await instagram.page.$$("a>div>div.KL4Bh");
			console.log('Selected nodes: ', nodes.length);
			// console.log(Object.keys(nodes[0]));
			for(let i=0;i<nodes.length;i++){
				// console.log(typeof nodes[i]);
				res = await instagram.page.evaluate(el => el.firstChild.src, nodes[i]);
				if(!result.includes(res)){
					result.push(res);
					count+=1;
				} 
			}
			await instagram.page.evaluate(_ => {
				window.scrollBy(0, window.innerHeight);
			  });
			await instagram.page.waitFor(3000);
			}
			console.log(result);
	},
	close: async ()=>{
		await instagram.browser.close();
	},
}

module.exports = instagram;
