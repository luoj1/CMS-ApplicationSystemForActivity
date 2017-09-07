var mysql = require('mysql');
var config = require('./config.js');
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: config.mysqluser,
  password: config.mysqlpw,
  database: config.database
});

exports.connect = function (){
con.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  }
  console.log("Connected!");
  con.query('use ppcms');
});
}
 var r = {};
 var check = false;

exports.closeDB= function(){
	con.end();

}

exports.verificationOfEmail = function (e, cb){


  con.query('SELECT email FROM user', function (err, result) {
    if (err) throw err;
	r = result;
	for(var i = 0;i<r.length;i++){

    if(r[i].email.toString()==e){
	//console.log('true email');
		check = true;
	}
	}
	cb(check);
	check = false;
  });
  //JSON.stringfy(r);

}

exports.verificationOfPw = function(p,cb){

con.query('SELECT pw FROM keyword', function (err, result) {
    if (err) throw err;
	r = result;
	var cut = p.substring(0,30);
	if(r[0].pw == cut){
		check =  true;
	}else{
		check =  false;
	}
	cb(check);
	check =false;

  });

}

exports.recordWrong = function(cb){
	con.query('SELECT num FROM wrong',function(err,result){
		if (err) throw err;
		var newnum= result[0].num +1;
	con.query('UPDATE wrong set num ='+newnum+' where num='+result[0].num,function(err,result){
		if (err) throw err;
		cb();

})
})
}
exports.getWrong = function(cb){
	con.query('SELECT num FROM wrong',function(err,result){
		if (err) throw err;
		cb(result[0].num);
	})
}
