const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
		handle = req.query.handle;
		console.log(handle);
		res.json({
			'msg': 'public'
		});
});

module.exports = router;
