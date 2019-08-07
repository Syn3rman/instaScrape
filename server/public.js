const express = require('express');
const router = express.Router();
const ig = require('../instagram');


router.get('/',async (req,res)=>{
		handle = req.query.handle;
		if (!handle){
			res.json({
				'msg': 'No handle specified',
			});
		}
		else{
			limit = req.query.limit || 10;
			console.log(handle, limit);
			await ig.initialize();
			result = await ig.scrapePublicProfile(handle,limit);
			if(result.length>0){
				res.json({
					result,
				});
			}
			else{
				res.json({
					'msg': 'There seems to be a problem with the url',
				});
			}
			// console.log(result);
			await ig.close();
		}
});

module.exports = router;
