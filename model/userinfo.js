var mongodb= require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/ppdb";

exports.createuserinfo = function(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("userinfo",function(err,collection){
	  if(err) throw err;
	  console.log("insert userinfo");
  });
});
}

exports.createuser = function(property,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("userinfo").insertOne(property,function(err,res){
	  if(err){throw err;}
	  cb();
  });
	});
}

exports.updateuser =  function(property,em,cb){
	MongoClient.connect(url, function(err, db) {
	var myquery = { email: em };
    db.collection("userinfo").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    db.collection("userinfo").insertOne(property,function(err,res){
	  if(err){throw err;}
	  cb();
  });
  });
  });
	}

exports.everyone = function(cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("userinfo").find().toArray(function(err,result){
	cb(result);
	});
	});
}
exports.searchone = function(email,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("userinfo").find({ email: email}).toArray(function(err,result){
	cb(result);
	});
	});
}
exports.searchmany = function(email,cb){
	var query = [];
	for(var i= 0; i< email.length; i++){
		query.push({email:email[i].toString()});
		console.log("email in searchmany"+ email[i]);
	}

	MongoClient.connect(url, function(err, db) {
	db.collection("userinfo").find({$or:query}).toArray(function(err,result){
	var output = {};
	if(result != undefined){
	for(var i = 0; i<result.length;i++){
		output[result[i].email] = result[i];
	}
	}
	cb(output);
	});
	});
}
