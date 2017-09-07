var mysql = require('mysql');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var config = require('./config.js');
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: config.mysqluser,
  password: config.mysqlpw,
  database: config.database
});
var transporter = nodemailer.createTransport({
  service: config.serviceProvider,
  auth: {
    user: config.eaddress,
    pass: config.emailpw
  }
});

exports.verificationOfEmailAndPw = function (e, p, cb){

  var query = 'SELECT * FROM useraccount WHERE em = \"' + e.toString() +'\" And pw = \"'+ p.toString()+'\"';
  con.query(query ,function (err, result) {
    if(result.length==1&&result[0].status == 1 ){
	cb(2);
	}else if(result.length==1&&result[0].status != 1){
	cb(1);
	}else{
	cb(0);
	}

  });
}



exports.addaccount = function (e,p,cb){
	var email = e.toString();
	var pw = p.toString();

  var sql = 'INSERT INTO useraccount (em,pw,code,time) VALUES (\''+email+'\',\''+pw+'\',\''+crypto.createHash('md5').update(makeid(8)).digest("hex")+'\','+new Date().getTime()+')';

  con.query(sql, function (err, result) {
    if (err) {
	 console.error(err.stack);
	}
    console.log("1 useraccount record inserted");
	cb(email);
  });

}

exports.sendcode = function(email,cb){
	var code = makeid(8);
	var hash = crypto.createHash('md5').update(code).digest("hex");
	var begintime = new Date().getTime();
	var mailOptions = {
  from: '',
  to: email,
  subject: 'verification code',
  text: code
};
	var sql = "update useraccount set code = \'"+hash+"\' , time = "+begintime+" where em = \'"+email+"\'";//alter statement
	con.query(sql, function (err, result) {
    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    cb();
  }
});

  });
}
exports.setpassword = function (em,pw,cb){
	var sql = "update useraccount set pw = \'"+pw+"\' where em = \'"+em+"\'";//an alter statement
	con.query(sql, function (err, result) {
    cb();
  });

}
exports.checkverificationcode = function(email,code,time,cb){
	var sql = "select * from useraccount where em = \'"+email+"\'";
	 con.query(sql, function (err, result) {
    if((time-result[0].time)> 60000){
		cb(false,0,email);
	}else{
		if(result[0].code != crypto.createHash('md5').update(code).digest("hex")){
			cb(false,1,email);
		}else{
			cb(true,"true code",email);
		}
	}
  });
}
exports.emailcheck = function(email,cb){
	var sql = "select * from useraccount where em = \'"+email+"\'";
	con.query(sql, function (err, result) {
    if(result.length ==1){
		if(result[0].status==1){
		cb(true,0);
		}else{
		cb(false,0);
		}
	}else{
		cb(false, 1);
	}
  });
}
exports.getsecond = function(email,cb){
	var sql = "select * from useraccount where em = \'"+email+"\'";
	con.query(sql, function (err, result) {
		var t = new Date().getTime()
		var timediff =Math.trunc((t-result[0].time)/1000);
    cb(timediff);
  });

}
exports.activation = function(email,cb){
	var sql = "update useraccount set status = "+1+" where em = \'"+email+"\'";//an alter statement
	con.query(sql, function (err, result) {
		if(err) throw err;
    cb();
  });

}
exports.deletetrashaccount= function(cb){
	var date = new Date().getTime();
	var threshold = date-1800000;
	var sql = "remove * from useraccount where time < "+threshold;
	con.query(sql, function (err, result) {
		if(err) throw err;
    cb();
  });
}
exports.checkactivation = function(email,cb){
	var sql = "select * from useraccount where em = \'"+email+"\'";
	con.query(sql, function (err, result) {
		if(err) throw err;
    if(result[0].status == 1){
		cb(true);
	}else{
		cb(false);
	}
  });
}
function makeid(l) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < l; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
