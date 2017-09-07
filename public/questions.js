$(document).ready(function(){
	$.post("/getallquestions",{get:"questions",poke:$("#poke").val()},function(data,sta){
		for(var i = 0; i<data.id.length;i++){
			var p = {_id: data.id[i].toString(),content:data.content[i],status:data.status[i],editor:data.editor[i]};
			 displayquestion(p);
			//alert(p.content);
		}
	},'json');
	
	
	
	//---------------------------------------------------------------
	$("#addquestion").click(function(){
	var q = $("#newquestion").val();
	var editor = $("#editor").val();
	if(q != null && q!= undefined&& q!= ""){
	//alert("add question");
	
	/*$.post('/addquestion',{content:q,editor:editor,status:3},function(data,status){
	if(data.good!="no"){
		$("#newquestion").val(undefined);
		//alert("display question");
		console.log("display question"+data.id._id.toString());
		displayquestion(data.id);
}else{
alert("something empty");
}		
	},'json');*/
	$("#addcontent").val(q);
	$("#addeditor").val(editor);
	$("#addstatus").val(3);
	document.getElementById("addquestionform").submit();
	}else{
alert("something empty");
}
return;
	});
	//--------------------------------------------------------------------
	
});

function displayquestion(p){
	var div = document.createElement("div");
	div.className = "container panel panel-body";
	div.id = "panel"+p._id;
	document.getElementById("panelboard").appendChild(div);
	
	var dropclick = document.createElement("button");
	dropclick.innerHTML = "edit";
	dropclick.className = "btn btn-info";
	dropclick.id = "dropclick"+p._id;
	//$("#dropclick"+p._id).attr("data-toggle","collapse");
	var target = "drop"+p._id.toString();
	//dropclick.setAttribute("href",target);
	dropclick.setAttribute("type","button");
	div.appendChild(dropclick);
	
	var drop = document.createElement("div");
	drop.className = "collapse";
	drop.id = "drop"+p._id.toString();
	div.appendChild(drop);
	
	
	var del = document.createElement("button");
	del.id = "delete"+p._id;
	del.innerHTML = "delete";
	div.appendChild(del);
	del.setAttribute("type","button");
	$("#delete"+p._id).click(function(){
		//alert("delete");
	/*$.post("/deletequestion",{id:p._id.toString()},function(data,status){
		if(data.x!="y"){
		var panel = document.getElementById("panel"+p._id);
		document.getElementById("panelboard").removeChild(panel);
		return;
		}else{
			alert("undef");
		}
	},'json');*/
	$("#deleteid").val(p._id.toString());
	document.getElementById("deletequestionform").submit();
	return;
	});
	
	
	var input1 = document.createElement("input");
	input1.id ="input1"+p._id;
	input1.setAttribute("type","radio");
	input1.setAttribute("name","status"+p._id);
	$("#input1"+p._id).val(1);
	var input1span = document.createElement("span");
	input1span.innerHTML = "input1(make all newly created application include this question)";
	drop.appendChild(input1span);
	drop.appendChild(input1);
	var input2 = document.createElement("input");
	input2.id ="input2"+p._id;
	input2.setAttribute("type","radio");
	input2.setAttribute("name","status"+p._id);
	$("#input2"+p._id).val(2);
	var input2span = document.createElement("span");
	input2span.innerHTML = "input2(make all newly created and existing application include this question)";
	drop.appendChild(input2span);
	drop.appendChild(input2);
	var input3 = document.createElement("input");
	input3.id ="input3"+p._id;
	input3.setAttribute("type","radio");
	input3.setAttribute("name","status"+p._id);
	input3.checked = "checked";
	$("#input3"+p._id).val(3);
	var input3span = document.createElement("span");
	input3span.innerHTML = "input3(reserve it in question lib. This question is still included in existing application but not in newly created application)";
	drop.appendChild(input3span);
	drop.appendChild(input3);
	var questionhidden = document.createElement("input");
	questionhidden.setAttribute("type","hidden");
	questionhidden.id = "content"+p._id;
	questionhidden.setAttribute("name","content"+p._id);
	$("#content"+p._id).val(p.content);
	div.appendChild(questionhidden);
	var editorhidden = document.createElement("input");
	editorhidden.setAttribute("type","hidden");
	editorhidden.id = "editor"+p._id;
	editorhidden.setAttribute("name","editor"+p._id);
	$("#editor"+p._id).val(p.editor);
	div.appendChild(editorhidden);
	
	var questionp = document.createElement("p");
	questionp.id = "p"+p._id;
	questionp.innerHTML = p.content;
	div.appendChild(questionp);
	var statusp = document.createElement("p");
	statusp.id="sp"+p._id;
	statusp.innerHTML = p.status;
	div.appendChild(statusp)
	var editorp = document.createElement("p");
	editorp.id = "ep"+p._id;
	editorp.innerHTML = p.editor;
	div.appendChild(editorp);
	
	var editquestion = document.createElement("textarea");
	editquestion.id = "editquestion"+p._id;
	editquestion.className = "form-control";
	editquestion.innerHTML=p.content;
	drop.appendChild(editquestion);
	$("#"+"editquestion"+p._id).attr("rows","10");
	var sure = document.createElement("button");
	sure.id= "sure"+p._id;
	sure.setAttribute("type","button");
	sure.onclick=function(){
		//alert("sure");
		var update = $("#editquestion"+p._id).val();
		//alert(update);
	var status = 3; 
	for(var i =1; i<4;i++){
	if($("#input"+i+p._id).is(':checked')){
		status = i;
	}
	}
	//alert(status);
	if(update != "" && update != undefined){
		/*$.post("/updatequestions",{id:p._id,stuff:{content:update,editor:$("#editor").val(),status:status}},function(data,sta){
		$("#"+"ep"+p._id).html($("#editor").val());
		$("#"+"editor"+p._id).val($("#editor").val());
		$("#"+"p"+p._id).html(update);
		$("#"+"question"+p._id).val(update);
		$("#sp"+p._id).html(status);
		return;
	},'json');*/
	$("#updateeditor").val($("#editor").val());
	$("#updatestatus").val(status);
	$("#updatecontent").val(update);
	$("#updateid").val(p._id);
	document.getElementById("updatequestionform").submit();
	}else{
		//alert("nothing");
	}
	return;
	};
	sure.innerHTML = "sure";
	sure.disabled = true;
	div.appendChild(sure);
	$("#dropclick"+p._id).click(function(){
		$("#"+target).collapse('toggle');
		if($("#sure"+p._id).is(':enabled')){
			sure.disabled = true;
		}else{
			sure.disabled  =false;
		}
		return;
	});
}


