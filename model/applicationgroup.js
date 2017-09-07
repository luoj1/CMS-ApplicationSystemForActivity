var mongodb= require('mongodb');
var applicationquestion = require('./applicationquestion.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/ppdb";
var checkapplication = require('./checkapplication.js');

exports.createapplicationgroup = function(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("application",function(err,collection){
	  if(err) throw err;
	  console.log("insert appgroup");
  });
});
}
exports.manualremove = function(e,cb){
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("application").remove({email:e},function(err,res){
	  if(err) throw err;
	cb();
	});
});
}
exports.addapp = function(property,cb){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("application").insert(property,function(err,res){
	  if(err) throw err;
	  console.log("addapp");
	cb(property);
	});
});
}

exports.loadapp = function(email,cb){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("application").find({ email: email}).toArray(function(err,result){
	  if(err) throw err;
	  if(result.length!=0){
	  cb(result);
	  }else{
	  cb(false);
	  }
  });
});
}

exports.editapp = function(email,cb){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  //var x =0;
  //var y =0;
  db.collection("application").find({ email: email}).toArray(function(err,result){
	  if(err) throw err;
	  if(result.length==1){
	  var obj = {id:[],question:[],content:[]};
	  var resulttemp = {};
	  for(var i = 0;i<result[0].question.length;i++){
	resulttemp[result[0].question[i]] = result[0].content[i];
	console.log("applicationgroup content"+result[0].content[0]);
	}
	//--use or to find question
	applicationquestion.findquestionsforedit(result[0].question,function(res){
		for(var i = 0; i<res.id.length;i++){
			obj.id.push(res.id[i]);
			obj.question.push(res[res.id[i]]);
			obj.content.push(resulttemp[res.id[i]]);
		}

	//--use question[i]._id to find suitable content by match result[0].id[ii], then add question[i].content and result[0].content[ii]

	 /* for(var i = 0; i<(result[0].question.length);i++){
		applicationquestion.getquestion(result[0].question[i],function(r){
			if(r!=false){
			obj.id.push( result[0].question[i]);
			obj.question.push(r.content);

				obj.content.push(result[0].content[i]);
			}
			y=1;
		});
		while(x==0){
		x = y;
		}
		y=0;
		x=y;
	  }*/
	  var temp = [];
	  applicationquestion.addition(function(add){
	  for(var i = 0; i<add.id.length;i++){
			  var isincluded = false;
			 for(var ix = 0; ix<result[0].question.length;ix++) {
				 console.log("result[].question"+result[0].question[ix]);
				 console.log("add.id[]"+add.id[i]);
				 if(add.id[i]== result[0].question[ix]){
					 isincluded=true;
				 }
			 }
			 if(isincluded == false){
				 obj.id.push(add.id[i]);
				 obj.content.push(undefined);
				 temp.push(add.id[i]);
				 console.log("addition"+ add.id[i]);
			 }

		  }
		 applicationquestion.findquestionsforedit(temp,function(x){
			 if(x.length!=0){
			// obj.id = obj.id.concat(x.id);
			 for(var i = 0; i<x.id.length;i++){
				 obj.question.push(x[x.id[i]]);
				 //obj.content.push(undefined);
			 }
			 cb(obj);
			 }else{
			cb(obj);
			 }
		 });
	  });

	  });
	  }else{
	  cb(false);
	  }
  });
});
}

exports.checkapp = function(email,cb){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("application").find({ email: email}).toArray(function(err,result){
	  if(err) throw err;
	  if(result.length!=0){
	  cb(result[0].submitted);
	  }else{
	  cb(false);
	  }
  });
});
}

exports.deleteapp = function(email,cb){
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("application").remove({email:email},function(err,res){
	  if(err) throw err;
	cb();
	});
});

}

exports.submission = function(email,cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("application").updateOne({email:email},
  { $set: {  submitted: 1 }},function(err,result){
	cb();
  });
  });

}

exports.getsubmitted = function(cb){
	MongoClient.connect(url, function(err, db) {
	db.collection("application").find({submitted:1}).toArray(function(err,result){
		var idarray = [];
		console.log("submitted"+result.length);
		checkapplication.getall(function(o){
		for(var i = 0 ; i<result.length;i++){
			if(o[result[i].email]!="yes"){
			idarray.push(result[i].email);
			}else{
			result[i] = 'a';
			}
		}
		console.log("idarray"+idarray[0]);
		result.push(idarray);
		cb(result);
		});
	});
  });
}
