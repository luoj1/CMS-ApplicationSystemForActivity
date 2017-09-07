var mysql = require('mysql');
var crypto = require('crypto');
var config = require('./config.js');
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: config.mysqluser,
  password: config.mysqlpw,
  database: config.database
});


exports.clearalloutdatedtokens= function(cb){
	var time = new Date().getTime()-600000;
	var query= 'DELETE FROM token WHERE time < '+time;
	con.query(query ,function (err, result) {
		cb();
	});
}

exports.settoken = function(email,random, cb){
	var original = random;
	random = hashgenerator(random);
	console.log("make hash "+random);
	
	var query = "insert into token(em,tk,time) values (\'"+email+"\',\'"+random+"\',\'"+new Date().getTime()+"\')";
	con.query(query ,function (err, result) {
    cb(email,original)
  });
	
}

exports.deletealltoken = function(email,cb){
	var query= 'delete FROM token WHERE em = \"' + email.toString() +'\"';
	con.query(query ,function (err, result) {
		console.log("delete all hash");
		cb();
	});
}

exports.deletetoken = function(email,token,cb){
	var query= 'delete FROM token WHERE em = \"' + email.toString() +'\" And tk = \"'+ token.toString()+'\"';
	con.query(query ,function (err, result) {
		console.log("delete hash");
		cb();
	});
}

exports.checktokenforinfo = function(email,pass,cb){
	pass = hashgenerator(pass);
	var query= 'SELECT * FROM token WHERE em = \"' + email.toString() +'\" And tk = \"'+ pass.toString()+'\"';
	con.query(query ,function (err, result) {
    if(result.length>0){
		if(new Date().getTime()-result[0].time>600000){
			
			exports.deletetoken(result[0].em,result[0].tk,function(){
			cb(false);
		})
		}else{
		
			cb(true);
		
		}
	}else{
			cb(false);
	}
  });
}

exports.checktokenforsession = function(email,pass,cb){
	pass = hashgenerator(pass);
	var query= 'SELECT * FROM token WHERE em = \"' + email.toString() +'\" And tk = \"'+ pass.toString()+'\"';
	con.query(query ,function (err, result) {
    if(result.length>0){
		if(new Date().getTime()-result[0].time>1800000){
			
			exports.deletetoken(result[0].em,result[0].tk,function(){
			cb(false);
		})
		}else{
			exports.deletetoken(result[0].em,result[0].tk,function(){
			cb(true);
		})
		}
	}else{
			cb(false);
	}
  });
}

function hashgenerator(r){
	r = r.substring(20,30);
	var salt = "bae" + r;
	var saltbae
	var hash = crypto.createHmac('sha256', salt)
                   .update(r)
                   .digest('hex');	
	var num=hash.charAt(28);
	if(num=='a'||num=='b'||num=='c'||num=='d'||num=='e'||num=='f'){
		num = 11;
	}else{
		num =parseInt(num); 
	}
	hash = hash.substring(13+num,45+num);
	
	return hash;
	
}