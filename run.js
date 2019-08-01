const ig = require('./app');

(async ()=>{
	await ig.initialize();
	// await ig.login();
	await ig.scrapeProfile('9gag');
	await ig.close();
})();
