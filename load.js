var mongodb= require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/ppdb";

exports.displayContent = function(cb){
	var show = {id:[],name:[],time:[],title:[],content:[],editor:[]};
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!2");
  db.collection("contents").find().toArray(function(err, result){
	if (err) throw err;
    console.log("get in2");

	for(var i =0; i<result.length;i++){
	show.id[i] = result[i]._id;
	show.name[i]=result[i].name;
	show.time[i]=result[i].time;
	show.title[i]=result[i].title;
	show.content[i] =result[i].content;
	show.editor[i] = result[i].editor;
  }
	cb(show);
});
//db.close();

});


}

exports.dropTest = function(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("drop test");
  db.collection("contents").drop();

});
}

exports.createNewContents = function(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("create new contents");
  db.createCollection("contents");

});
}

exports.countblogs = function(){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("count");
  db.collection("contents").find().toArray(function(err,result){
  var totalblogs = result.length;
  return totalblogs;
  });
});
}

exports.writein = function(name,title,content,user,after){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("writein");
  console.log("user:"+user);
  var d = new Date();
  var myobj = { name: name, time: d.getTime(), title: title, content: content, editor: user };
  db.collection("contents").insertOne(myobj,function(err,res){
	  if(err){throw err;}
after();
  });
});
}

exports.searchone=function(id,next){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("contents").find({ _id: new mongodb.ObjectID(id)}).toArray(function(err,result){
	console.log(result[0].name);
  next(result[0]);
  result= undefined;
  });
});
}

exports.updateblog=function(id,editorname,articletitle,stuff,useremail,timefirst,next){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("contents").updateOne({ _id: new mongodb.ObjectID(id)},
  { $set: {  name: editorname, time: timefirst, title: articletitle, content: stuff, editor: useremail }},function(err,result){
	 next();
  }
  );

  });
}

exports.deleteblog = function(id,next){
MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var myquery = { _id: new mongodb.ObjectID(id) };
    db.collection("contents").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
	next();
  });
});
}
