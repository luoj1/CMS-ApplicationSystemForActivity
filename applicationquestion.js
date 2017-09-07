var mongodb= require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/ppdb";

exports.createapplicationquestion = function(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("question",function(err,collection){
	if (err) throw err;
console.log("insert appquestion");
  });
});
}

exports.createquestion = function(property,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").insert(property,function(err,res){
	  if(err){throw err;}
	  console.log("insertedid"+ res.ops[0]._id);
	cb(res.ops[0]);

	});
  });


}

exports.updatequestion = function(id,property,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").updateOne({ _id: new mongodb.ObjectID(id)},
  { $set: {  content: property.content, status: property.status, editor: property.editor }},function(err,result){
	cb();
  });
  });
}

exports.deletequestion = function(id,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").remove({ _id: new mongodb.ObjectID(id)},function(err,result){
  cb();
  });
  });

}

exports.getquestion = function(id,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").find({ _id: new mongodb.ObjectID(id)}).toArray(function(err,result){
		if(result.length !=1){
		cb(false);
		}else{
  cb(result[0]);
		}
  });
  });


}

exports.getmanyquestions = function(id,cb){
		getmanyquestionsextra(0,{question:[],id:[]},id,function(x){
			cb(x);
		});
}

function getmanyquestionsextra(l,res,id,cb){
	if(l!=id.length){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").find({ _id: new mongodb.ObjectID(id[l])}).toArray(function(err,result){
		if(result.length ==1){
		res.question.push(result[0].content);
		res.id.push(result[0]._id);
		}
		getmanyquestionsextra(l+1,res,id,cb);
  });
  });
	}else{
		cb(res);
	}

}

exports.getallquestions = function(cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").find().toArray(function(err,result){
  var obj = {content:[],id:[],status:[],editor:[]};
	for(var i = 0; i < result.length;i++){
		obj.content[i] = result[i].content;
		obj.id[i] = result[i]._id;
		obj.status[i] = result[i].status;
		obj.editor[i] = result[i].editor;
	}
	cb(obj);
  });
  });

}

exports.findquestionsforedit = function(id,cb){
	var find = [];
	var obj = {id:[]};
	console.log("find"+id[0]);
	if(id[0]!=null &&id[0]!=''){
	for(var i = 0; i< id.length;i++){
		find.push({_id:new mongodb.ObjectID(id[i])});
	}
	MongoClient.connect(url, function(err, db) {
	db.collection("question").find({$or:find}).toArray(function(err,result){
	for(var i = 0;i<result.length;i++){
	obj.id[i] = result[i]._id;
	obj[result[i]._id] = result[i].content;
	console.log(result[i]._id+result[i].content);
	}

  cb(obj);
  });
  });
	}else{
		cb(obj)
	}
}

exports.makenewapplication = function(cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").find({$or:[{status:"1"},{status:"2"}]}).toArray(function(err,result){
	var obj = {content:[],id:[]};
	for(var i = 0; i < result.length;i++){
		obj.content[i] = result[i].content;
		obj.id[i] = result[i]._id;
	}
	console.log("make new app"+result[0]._id);
  cb(obj);
  });
  });

}

exports.addition = function(cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("question").find({status:"2"}).toArray(function(err,result){
	var obj = {id:[]};
	for(var i = 0; i < result.length;i++){
		obj.id[i] = result[i]._id;
	}

  cb(obj);
  });
  });

}
