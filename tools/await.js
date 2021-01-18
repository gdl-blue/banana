const deasync = require('deasync');

function await(promise) {
	var ret, err;
	promise.then(retval => ret = retval).catch(e => err = e);
	
	while(ret === undefined && err === undefined) deasync.sleep(100);
	
	if(err) throw err;
	else return ret;
}

module.exports = await;