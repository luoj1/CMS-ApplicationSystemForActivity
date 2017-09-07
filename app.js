const express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var content =  require('./model/content.js');
var crypto = require('crypto');
var load = require('./model/load.js');
const app = express();
var path = require('path');
var token = require('./model/token.js');
var checkapplication = require('./model/checkapplication.js');
var applicationquestion = require('./model/applicationquestion.js');
var applicationgroup = require('./model/applicationgroup.js');
var userlogin = require('./model/useraccount.js');
var userinfo = require('./model/userinfo.js');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var thresholdofstoplog = 20;
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //
var jwt    = require('jsonwebtoken');
var config = require('./model/config.js');
content.connect();

app.engine('ejs', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.set('superSecret', config.jwtsecret);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');


var transporter = nodemailer.createTransport({
  service: config.emailProvider,
  auth: {
    user: config.eaddress,
    pass: config.emailpw
  }
});

 var mailOptions = {
  from: '',
  to: '',
  subject: 'test',
  text: "test"
};
/*transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        return console.log(error);
    }
   console.log("email sent");
});*/




app.get('/blog',function(req,res){
	res.render('blog');
})

app.get('/', function (req, res) {
	console.log("get/");
	console.log(req.body.idn);
	if( req.body.idn != null){
	load.searchone(req.body.idn,function(result){
	res.render('expand',{title: result.title,name:result.name,time:result.time,content:result.content});
	});
	}else{
	res.render('index');
	}
});

app.get('/login',function(req,res){
		res.render('userlogin');
})
app.get('/create',function(req,res){
	res.render('createnewuser',{reason: undefined});
});
app.get('/forget',function(req,res){
	res.render('forgetpw',{reason:undefined});
});

app.post('/dashboard',function(req,res){
	if(req.body.em != null && req.body.pw != null &&req.body.pw != undefined&&req.body.em != undefined){
		if(validateEmail(req.body.em)==false){
		res.redirect('/login');
		}else{
			var pass = crypto.createHash('md5').update(req.body.pw).digest("hex");
			userlogin.verificationOfEmailAndPw(req.body.em,pass,function(boo){
			if(boo ==2){
				token.settoken(req.body.em,makeid(50),function(e,o){
				res.render('dashboard',{email: req.body.em,poke:maketoken(req.body.em,o)});
				});
			}else if(boo==1){
				userlogin.sendcode(req.body.em,function(){
			res.render("activation",{user: req.body.em, reason:""});
			return;
			});
			}else{
				res.redirect('/login');
			}
			});
		}
	}else if(req.body.poke!=null&&req.body.poke!=undefined&&req.body.poke!=""){
		verifypokeforsession(req.body.poke,function(pokeresult,pokeuser){

		if(req.body.exit=="back" && pokeresult==true){
			token.settoken(pokeuser,makeid(50),function(e,o){
			res.render('dashboard',{email:pokeuser,poke:maketoken(e,o)});
						});
		}else if(req.body.personalemail != null && req.body.personalemail != undefined && pokeresult ==true ){//check personal profile field
		var check = [checkform(req.body.username),checkform(req.body.gender),checkform(req.body.birthday),checkform(req.body.experience),
		checkform(req.body.phone),checkform(req.body.address),checkform(req.body.school),checkform(req.body.grade)];
		for(var i = 0;i <check.length;i++){
			if(check[i]==false){
				token.settoken(pokeuser,makeid(50),function(e,o){
				res.render('personal',{reason:"fill everything",user: pokeuser,poke:maketoken(e,o)});
				});
				return;
			}
		}
				var obj = {email:pokeuser,username:req.body.username,gender:req.body.gender,birthday:req.body.birthday,
				experience:req.body.experience,phone:req.body.phone,
				address:req.body.address,school:req.body.school,grade:req.body.grade};

				userinfo.searchone(pokeuser,function(result){
					if(result.length==1){
						//update
						userinfo.updateuser(obj,pokeuser,function(){
						token.settoken(pokeuser,makeid(50),function(e,o){
						res.render('dashboard',{email:pokeuser,poke:maketoken(e,o)});
						});
					});
					}else{
						//write in new
						userinfo.createuser(obj,function(){
							token.settoken(pokeuser,makeid(50),function(e,o){
							res.render('dashboard',{email:pokeuser,poke:maketoken(e,o)});
							})
							});
					}
				});


	}else if(req.body.submission == "submit" || req.body.submission == "save" ){
		if(pokeresult==true){
		applicationgroup.checkapp(pokeuser,function(r){
			console.log("checkapp"+r);
			if(r!=1){
		if(req.body.submission == "save"){
			var property = {email: pokeuser, question:[],content:[],submitted: 0};
			var order = 0;
			var q = req.body["id"+0];
			console.log("q is"+q);
			console.log("q is"+req.body["content"+0]);
			if(q==undefined||q==null){
				res.redirect('/');
				return;
			}
			while(q != null && q!= undefined&& q!=""){
				property.question.push(req.body["id"+order]);
				property.content.push(req.body["content"+order]);
			order += 1;
			q = req.body["id"+order];
			}
			console.log("property content"+property.content[0]);
			applicationgroup.deleteapp(pokeuser,function(){
			applicationgroup.addapp(property,function(p){
				token.settoken(pokeuser,makeid(50),function(e,o){
							res.render('dashboard',{email:pokeuser,poke:maketoken(e,o)});
							})
			});
		})
		}else{
			var shouldsubmit = true;
			var property = {email: pokeuser, question:[],content:[],submitted:0};
			var order = 0;
			var q = req.body["id"+order];
			while(q != null && q!= undefined&& q!=""){
				property.question[order] = req.body["id"+order];
				property.content[order]= req.body["content"+order];
				if(req.body["content"+order] ==null ||req.body["content"+order] ==undefined ||req.body["content"+order]+"a" =="a" ){
					shouldsubmit =false;
				}
			order += 1;
			q = req.body["id"+order];
			}

			applicationgroup.deleteapp(pokeuser,function(){
			applicationgroup.addapp(property,function(p){
				if(shouldsubmit ==true){
				userinfo.searchone(pokeuser,function(personal){

					if(personal.length==1){
						applicationgroup.submission(pokeuser,function(){
					res.redirect('/login');
					});
				//res.render('pay',{email:req.body.email});
					}else{
						token.settoken(pokeuser,makeid(50),function(e,o){
				res.render('application',{reason:"go back to fill out personal info. Your application is saved already",user:pokeuser,purpose:pokeuser,poke:maketoken(e,o)});
						})
					}
				});
				return;
			}else{
				token.settoken(pokeuser,makeid(50),function(e,o){
				res.render('application',{reason:"please fill out everything",user:pokeuser,purpose:pokeuser,poke:maketoken(e,o)});
				})
			}
			});
			});

		}
			}

			});
	}
	}else{
		res.redirect("/login");
	}
		});
}else{
	res.redirect("/login");
}
})

app.post('/searchuserinfo',function(req,res){
	if(req.body.poke!=undefined&&req.body.poke!=null){
		readtoken(req.body.poke,function(r){
		if(r!=false){
		token.checktokenforinfo(r.eee,r.ppp,function(j){
		if(j==true){
		userinfo.searchone(r.eee,function(result){
			res.json(result[0]);
		});
		}else{
		res.redirect('/login');
		}
		})
		}else{
		res.redirect('/login');
		}
		})
	}

})

app.post('/create',function(req,res){
	if(req.body.newem != null && req.body.newpw != null &&req.body.newpw2 != null){
		if(req.body.newem != undefined && req.body.newpw != undefined &&req.body.newpw2 != undefined){
			if(validateEmail(req.body.newem)==false){
				res.render('createnewuser',{reason: "enterin email"});
				return;
			}else if(req.body.newpw[7] == undefined){
				res.render('createnewuser',{reason: "password should be equal to or more than 7 legal character"});
				return;
			}else if(req.body.newpw != req.body.newpw2){
				res.render('createnewuser',{reason: "two passwords should be the same"});
				return;
			}else{
				userlogin.emailcheck(req.body.newem,function(boo,mes){
					if(mes==1){
						var pass = crypto.createHash('md5').update(req.body.newpw).digest("hex");
						userlogin.addaccount(req.body.newem,pass,function(email){
						userlogin.sendcode(req.body.newem,function(){
						res.render('activation',{user:email,reason:undefined});
						return;
						});
						});
					}else{
						res.render('createnewuser',{reason: "email already exists"});
				return;
					}
					});

			}
		}else{
			res.render('createnewuser',{reason: "no blank"});
			return;
		}
	}
})
app.post('/countdown',function(req,res){
if(req.body.second =="second"){
		console.log(req.body.em.toString());
		userlogin.getsecond(req.body.em.toString(),function(s){
		console.log(s+"second in activation");
		res.json({second:(60-s)});
		});

	}
	});

app.post('/sendnew',function(req,res){
	if(req.body.sendcode == "sendcode"){
		userlogin.sendcode(req.body.em,function(){
			userlogin.getsecond(req.body.em.toString(),function(s){
		console.log(s+"second in activation");
		res.json({second:(60-s)});
		});
			});

}

})

app.post('/activation',function(req,res){

	userlogin.checkverificationcode(req.body.emcode,req.body.code,new Date().getTime(),function(boo,mes,email){
		if(boo==true){
			userlogin.activation(email, function(){
			res.redirect("/login");
			return;
		});
		}else if(mes==0){
			userlogin.sendcode(email,function(){
			res.render("activation",{user: email, reason:"overtime. a new pw is sent"});
			return;
			});
		}else if(mes==1){
			res.render("activation",{user: email, reason:"wrong code"});
			return;
		}
	});
})

app.post('/forget',function(req,res){
	userlogin.emailcheck(req.body.em,function(boo,mes){
		if(boo==true){
			userlogin.sendcode(req.body.em,function(){

			res.render("verifyuser",{user: req.body.em, reason:undefined});
			return;

			});
		}else{
			res.render("forgetpw",{reason: "no such email"});
			return;
		}
	});
})
app.post('/reset',function(req,res){

	if(req.body.emcode != undefined && req.body.emcode != null){
	if(req.body.code != undefined&&req.body.code !=null){
		userlogin.checkverificationcode(req.body.emcode,req.body.code,new Date().getTime(),function(boo,mes,email){
		if(boo==true){
			token.settoken(req.body.emcode,makeid(50),function(e,o){
			res.render("pwreset",{user: req.body.emcode,reason:undefined,poke:maketoken(e,o)});
			})
			return;
		}else if(mes==0){
			userlogin.sendcode(email,function(){
			res.render("verifyuser",{user: req.body.emcode, reason:"overtime. a new pw is sent"});
			return;
			});
		}else if(mes==1){
			res.render("verifyuser",{user: req.body.emcode, reason:"wrong code"});
			return;
		}
	});
	}else{
		res.render("verifyuser",{user: req.body.emcode, reason:"no blank"});
			return;
	}
	}else{
	verifypokeforsession(req.body.poke,function(pokeresult,pokeuser){
		if(pokeresult==true){
	if(req.body.newpw != undefined&&req.body.newpw !=null&&req.body.newpw2 != undefined&&req.body.newpw2 !=null ){
		if(req.body.newpw[7] == undefined){
			token.settoken(req.body.emcode,makeid(50),function(e,o){
				res.render('pwreset',{user:pokeuser,reason:"password should be equal to or more than 7 legal character",poke:maketoken(e,o)});
			})
				return;
			}else if(req.body.newpw != req.body.newpw2){
				token.settoken(req.body.emcode,makeid(50),function(e,o){
				res.render('pwreset',{user: pokeuser,reason: "two passwords should be the same",poke:maketoken(e,o)});
				})
				return;
			}else{
				var pass = crypto.createHash('md5').update(req.body.newpw).digest("hex");
				userlogin.setpassword(pokeuser, pass,function(){
				res.redirect('/login');
				});
			}
	}else{
		token.settoken(req.body.emcode,makeid(50),function(e,o){
		res.render('pwreset',{user: req.body.em,reason: "no blank"});
		})
	}
		}else{
			res.redirect('/login');
		}
	})
	}
})

app.post('/editOrnew',function(req,res){
	verifypokeforinfo(req.body.poke,function(pokeresult,pokeuser){
	if(req.body.edit=="new"&&pokeresult==true){
		applicationgroup.loadapp(pokeuser,function(x){
			if(x[0]!=undefined && x!= false && x[0].submitted==1){
				res.json({new:true});
				return;
			}else{
				res.json({new:false});
				return;
			}
		});
	}else{
	res.redirect('login');
	}
})
})
app.post('/application',function(req,res){
	verifypokeforsession(req.body.poke,function(pokeresult,pokeuser){
		if(pokeresult == true){
	if(req.body.create != null && req.body.create != undefined){
		token.settoken(pokeuser,makeid(50),function(e,o){
			res.render('application',{reason:"",user:pokeuser,purpose:"new",poke:maketoken(e,o)});
		});
	}else if(req.body.application != null ||req.body.application != undefined){
		var purpose = "xxx";
		applicationgroup.loadapp(pokeuser,function(x){
			if(x[0] != undefined && x!= false && x[0].submitted==1){
				res.render("dashboard",{email: pokeuser});
				return;
			}
			else if(x==false){
				purpose = "new";
			}else{
				purpose = pokeuser;
			}
			token.settoken(pokeuser,makeid(50),function(e,o){
			res.render('application',{reason:"",user:pokeuser,purpose:purpose,poke:maketoken(e,o)});
		});
		});
	}else{
		res.redirect("/login");
	}
	}else{
		res.redirect("/login");
	}
	})
});

app.post('/loadapplication',function(req,res){
	verifypokeforinfo(req.body.poke,function(pokeresult,pokeuser){
		if(pokeresult==true){
	if(req.body.purpose=="new"){
		applicationquestion.makenewapplication(function(obj){
		res.json(obj);
		});
	}else if(validateEmail(req.body.purpose)){
		applicationgroup.editapp(pokeuser,function(o){
		res.json(o);
		});

	}
		}else{
			res.redirect('/login');
		}
	})
})
app.post('/profile',function(req,res){
	verifypokeforsession(req.body.poke,function(pokeresult,pokeuser){
		if(pokeresult==true){
	if(req.body.profile != null ||req.body.profile != undefined){
		token.settoken(pokeuser,makeid(50),function(e,o){
		res.render('personal',{reason:"",user:pokeuser,poke:maketoken(e,o)});
		})

	}else{res.redirect('/login');}
		}else{res.redirect('/login');}
})
})
app.post('/expand',function(req,res){
	load.searchone(req.body.idn,function(result){
	res.render('expand',{title: result.title,name:result.name,time:result.time,content:result.content});
	});
});
app.post('/indexContent', function(req, res){
	console.log("acquiring json");
	load.displayContent(function(show){res.json(show);});
})
app.get('/log', function(req,res){
	res.sendfile(__dirname+'/views/login.html');
});

app.post('/write',function(req, res){
	if(req.body.em !=null && req.body.pw){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	var editorname =  req.body.editor;
	var articletitle = req.body.title;
	var stuff = req.body.content;
	var useremail = logger;
	if(useremail==undefined){
		res.sendfile(__dirname+'/views/login.html');
		return;
	}
	if(editorname==undefined||articletitle==undefined||stuff==undefined){

		res.render('new',{user: logger, reason:"fill out everything", id: undefined, editor: editorname, time: undefined, title: articletitle, content: stuff, place:"/write"});
		return;
	}
	console.log("write stuff into mongo");
	console.log("total blog"+load.countblogs());
	load.writein(editorname, articletitle, stuff, useremail,function(){
		res.render('edit',{user: logger});
	});
			}
	})
	}else{
	res.render('logforverification4',{place:"/write",intent:"editor",thing:req.body.editor,intent2:"title",thing2:req.body.title,intent3:"content",thing3:req.body.content,intent4:"email",thing4:req.body.email});
	}
});

app.post('/update',function(req,res){
	if(req.body.em !=null && req.body.pw){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	var editorname =  req.body.editor;
	var articletitle = req.body.title;
	var stuff = req.body.content;
	var useremail = req.body.email;
	var timefirst = req.body.time;
	var idn = req.body.id;
	if(useremail==undefined||timefirst==undefined||idn==undefined){
		res.sendfile(__dirname+'/views/login.html');
		return;
	}
	if(editorname==undefined||articletitle==undefined||stuff==undefined){
		res.render('new',{user: useremail, reason:"never leave blank before submitting edit", id:idn, time:timefirst, editor: editorname, title: articletitle, content: stuff,place:"/update"});
		return;
	}
	load.updateblog(idn,editorname,articletitle,stuff,useremail,timefirst,function(){res.render('edit',{user: logger});});
			}
			})
			}else{
res.render('logforverification6',{place:"/update",intent:"editor",thing:req.body.editor,intent2:"title",thing2:req.body.title,intent3:"content",thing3:req.body.content,intent4:"email",thing4:req.body.email,intent5:"id",thing5:req.body.id,intent6:"time",thing6:req.body.time});
			}

});

app.post('/edit', function(req,res){
	if(req.body.em !=null && req.body.pw!=null){
	verifylog(res,req,function(logger){
		if(validateEmail(logger)){
	if(validateEmail(req.body.back)){
		res.render('edit',{user: logger});
		return;
	}else if( req.body.del != undefined && req.body.del != null){
	console.log("going to delete stuff"+req.body.del);
	load.deleteblog(req.body.del,function(){res.render('edit',{user:logger});});
	//return;
	}else if(req.body.edit != undefined && req.body.edit != null){

	load.searchone(req.body.edit,function(result){
	res.render('new',{user:logger, id:req.body.edit, reason:"please update", time: result.time, editor: result.name.toString(), title: result.title, content: result.content, place:"/update"});
	});
	}else if(req.body.new != undefined && req.body.new != null){

		res.render('new',{user: logger, reason:"", id:undefined, time:undefined, editor: undefined, title: undefined, content: undefined,place:"/write"});
		return;

	}else{
	/*if(req.body.x == 'email'){
		res.json({u:user});
		return;
	}*/
	res.render("edit",{user:logger});
	}
		}else{
		res.render("/log");
		}
})
	}else{
		if(validateEmail(req.body.back)){
		res.render('logforverification',{intent:"back",thing:req.body.back,place:"/edit"});
		return;
	}else if( req.body.del != undefined && req.body.del != null){
	console.log("going to delete stuff"+req.body.del);
	res.render('logforverification',{intent:"del",thing:req.body.del,place:"/edit"});
	return;
	}else if(req.body.edit != undefined && req.body.edit != null){

	res.render('logforverification',{intent:"edit",thing:req.body.edit,place:"/edit"});
	return;
	}else if(req.body.new != undefined && req.body.new != null){
		res.render('logforverification',{intent:"new",thing:req.body.edit,place:"/edit"});
		return;

	}else{
	/*if(req.body.x == 'email'){
		res.json({u:user});
		return;
	}*/
	res.redirect("/");
	}
	}
});

app.post("/questionlist",function(req,res){
	if(req.body.em!=null&&req.body.pw!=null){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	if(req.body.questionlist != null &&req.body.questionlist !=undefined){
		token.settoken("admin",makeid(100),function(e,o){
		res.render("questions",{user: logger,poke:maketoken(e,o)})
	});
	}
			}
	})
	}else{
		res.render("logforverification",{intent:"questionlist",place:"/questionlist",thing:req.body.questionlist})
	}
});
app.post("/getallquestions",function(req,res){
	verifypokeforsession(req.body.poke,function(pokeresult,pokeuser){
		if(pokeresult==true&&pokeuser=="admin"){
	if(req.body.get=="questions"){
		applicationquestion.getallquestions(function(obj){
			res.json(obj);
		});
	}
		}
	})
})

app.post("/updatequestions",function(req,res){
	if(req.body.em!=null && req.body.pw!=null){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	if(req.body.id !=null &&req.body.id !=undefined){
		var property = {content:req.body.content,status:req.body.status,editor:req.body.editor};
	applicationquestion.updatequestion(req.body.id,property,function(){
		token.settoken("admin",makeid(100),function(e,o){
		res.render("questions",{user: logger,poke:maketoken(e,o)})
	});
	});
	}
	}
	})
	}else{
		res.render('logforverification4',{place:"/updatequestions",intent:"editor",thing:req.body.editor,intent2:"status",thing2:req.body.status,intent3:"content",thing3:req.body.content,intent4:"id",thing4:req.body.id});
	}
});
app.post("/deletequestion",function(req,res){
	if(req.body.em!=null && req.body.pw!=null){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	if(req.body.id != null && req.body.id != undefined){
		applicationquestion.deletequestion(req.body.id,function(){
		token.settoken("admin",makeid(100),function(e,o){
		res.render("questions",{user: logger,poke:maketoken(e,o)})
	});
		});
	}
	}
	})
	}else{
		res.render('logforverification',{place:"/deletequestion",intent:"id",thing:req.body.id});
	}

});
app.post("/addquestion",function(req,res){

	if(req.body.em!=null && req.body.pw!=null){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	if(req.body.content != null && req.body.content != undefined){
		var property = {content:req.body.content,status:req.body.status,editor:req.body.editor};
		applicationquestion.createquestion(property,function(r){
			token.settoken("admin",makeid(100),function(e,o){
		res.render("questions",{user: logger,poke:maketoken(e,o)})
	});
		});
	}
			}
	})
	}else{
		res.render('logforverification4',{place:"/addquestion",intent:"editor",thing:req.body.editor,intent2:"status",thing2:req.body.status,intent3:"content",thing3:req.body.content,intent4:"no",thing4:""});
	}
});
app.post("/checkapp",function(req,res){
	if(req.body.em != null && req.body.pw != null){
	verifylog(res,req,function(logger){
		if(validateEmail(logger)){
	if(validateEmail(req.body.checkapp)){
		token.settoken("admin",makeid(100),function(e,o){
		res.render("checkapp",{em:logger,poke:maketoken(e,o)});
		})
	}
		}else{
		res.redirect("/");
		}
	})
	}else{
		res.render("logforverification",{intent:"checkapp",thing:req.body.checkapp,place:"/checkapp"});
	}

})
app.post("/getsubmitted",function(req,res){
	verifypokeforsession(req.body.poke,function(pokeresult,pokeuser){
		if(pokeresult==true&&pokeuser=="admin"){
	var output = {};//{applicaiton:[{l@g:}],user:{l@g:{}},123456:fdsgfdsg,...}
	if(req.body.submitted =="submitted"){
		applicationgroup.getsubmitted(function(r){
			userinfo.searchmany(r[r.length-1],function(userstuff){
				output["user"] = userstuff;
			applicationquestion.getallquestions(function(q){
				for(var i = 0; i < q.id.length;i++){
					output[q.id[i]] =q.content[i];
				}
				r.pop();
				console.log("r"+r.length);
				output["application"] = r;
				console.log("oal"+output.application.length);
				res.json(output);
			});
			});
		});
	}
		}
	})
});
app.post("/appstatus",function(req,res){
	verifypokeforinfo(req.body.poke,function(pokeresult,pokeuser){
			if(pokeresult==true){
	checkapplication.checkapplicationstatus(pokeuser,function(x){
		res.json({answer:x});
	});
			}else{
				res.redirect("/login");
			}
	})
});
app.post("/changeappstatus",function(req,res){
	if(req.body.em!=null&&req.body.pw!=null){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	checkapplication.includeapplication(req.body.email,req.body.status,function(x){
		token.settoken("admin",makeid(100),function(e,o){
		res.render('checkapp',{em: logger, poke:maketoken(e,o)});
	});
	});
			}
	})
	}else{
		res.render("logforverification2",{intent:"email",thing:req.body.email,intent2:"status",thing2:req.body.status,place:"/changeappstatus"})
	}
});
app.post("/checkedapp",function(req,res){
	if(req.body.em!=null&&req.body.pw!=null){
		verifylog(res,req,function(logger){
			if(validateEmail(logger)){
	if(req.body.checkedapp != undefined ){
		token.settoken("admin",makeid(100),function(e,o){
		res.render('checkedapp',{poke:maketoken(e,o),em:logger});
		})
	}
			}
	})
	}else{
		res.render("logforverification",{intent:"checkedapp",thing:req.body.checkedapp,place:"/checkedapp"})
	}
})
app.post("/getallchecked",function(req,res){
	verifypokeforsession(req.body.poke,function(pokeresult,pokeuser){
		if(pokeresult==true&&pokeuser=="admin"){
	if(req.body.checked =="checked" ){
		checkapplication.geteverything(function(r){
			res.json({answer:r});
		})
	}
	}
	})
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//-----------------------------------------------------------method------------------------------------------------------
function checkform(req){
	if(req != null && req != undefined &&req != ""){
		return true;
	}else{
		return false;
	}
}

function makeid(l) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < l; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function verifypokeforinfo(poke,cb){
	if(poke != undefined && poke!=null){
		readtoken(poke,function(r){
		if(r == false){
			cb(false,false);
		}else{
			token.checktokenforinfo(r.eee,r.ppp,function(j){
			if(j==false){
				cb(false,false);
			}else{
				cb(true,r.eee);
			}
			})
		}
		})

	}else{
	cb(false,false);
	}
}
function verifypokeforsession(poke,cb){
	if(poke != undefined && poke!=null){
		readtoken(poke,function(r){
		if(r == false){
			cb(false,false);
		}else{
			token.checktokenforsession(r.eee,r.ppp,function(j){
			if(j==false){
				cb(false,false);
			}else{
				cb(true,r.eee);
			}
			})
		}
		})

	}else{
	cb(false,false);
	}
}

function maketoken(e,p){
	return jwt.sign({eee:e,ppp:p}, app.get('superSecret'), {
        });
}

function readtoken(token,cb){
	jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        console.log(err);
		cb(false);
      } else {
        // if everything is good, save to request for use in other routes
		cb(decoded);
      }
    });
}

function verifylog(res,req,cb){
	var em = req.body.em;
	var pw = req.body.pw;
	if(!validateEmail(em)){
	res.redirect("/log");
	return;
	}
	var pw = crypto.createHash('md5').update(pw).digest("hex");
	content.getWrong(function(w){
		if(w > thresholdofstoplog){
			res.redirect("/log");
		}else{
	content.verificationOfEmail(em, function(c){
		if(c==false){
			res.redirect('/');
			return;
		}else{

			var pwVerified=content.verificationOfPw(pw,function(c){
			if(c == false){
			content.recordWrong(function(){
			res.redirect("/log");
			return;
			})
			}else{
			cb(em);
			return;
			//content.closeDB();
			}
		});
		}
	});
		}
})
}
