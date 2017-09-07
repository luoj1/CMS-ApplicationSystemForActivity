var mongodb= require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/ppdb";

exports.createcheckapplication = function(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("checkapplication",function(err,collection){
	if (err) throw err;
console.log("insert checkappquestion");
  });
});
}

exports.includeapplication = function(email,status,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("checkapplication").insert({email:email,status:status},function(err,res){
	  if(err){throw err;}
	cb();

	});
  });


}

exports.manualdeleteapplication = function(x){
	MongoClient.connect(url, function(err, db) {
	db.collection("checkapplication").remove({email:x},function(err,res){
	  if(err){throw err;}
	console.log("remove submission");

	});
  });
}

exports.getall = function(cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("checkapplication").find().toArray(function(err,res){
	  if(err){throw err;}
	  var obj = {};
	  for(var i = 0; i< res.length;i++){
		  obj[res[i].email] = "yes";
	  }
	cb(obj);
	});
  });

}

exports.geteverything= function(cb){
MongoClient.connect(url, function(err, db) {
	db.collection("checkapplication").find().toArray(function(err,res){

	cb(res);
	});
  });
}
exports.checkapplicationstatus = function(email,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("checkapplication").find({ email: email}).toArray(function(err,result){
		if(result.length!=0){
			if(result[0].status == "reject"){
				cb("reject");
			}else if(result[0].status =="admitted"){
				cb("admitted");
			}else{
				cb("waitlist");
			}
		}else{
			cb("nothing");
		}
	});
  });


}
