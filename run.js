const ig = require('./instagram');

(async ()=>{
	await ig.initialize();
	await ig.login();
	await ig.scrapePublicProfile('9gag', 1000);
	await ig.close();
})();
