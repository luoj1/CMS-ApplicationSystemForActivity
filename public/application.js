$(document).ready(function(){
	//alert("load");
	$.post("/loadapplication",{purpose:$("#purpose").val(),poke:$("#poke").val()},function(data,status){
		//alert($("#purpose").val());
		var purpose = $("#purpose").val();
		if(purpose == "new"){
			for(var i = 0; i< data.id.length; i++){
				//alert(data.id[i]);
				createlayout(data.id[i],data.content[i],"",i);
			}
		}else{
			for(var i = 0; i< data.id.length; i++){
				//alert(data.content[i]);
				createlayout(data.id[i],data.question[i],data.content[i],i);
			}
		}
		//var submit = document.createElement("button");
		var submit = document.getElementById("submitapp");
		submit.id = "submit";
		submit.innerHTML = "submit";
		submit.onclick = function(){
			submission("submit");
		}
		submit.disabled = false;
		//var save = document.createElement("button");
		var save = document.getElementById("saveapp");
		save.id = "save";
		save.innerHTML = "save&exit";
		save.onclick = function(){
			submission("save");
		}
		var newapp = document.getElementById("newapp");
		newapp.onclick = function(){
			document.getElementById("new").submit();
		}
		
	/*document.getElementById("application").appendChild(submit);
	document.getElementById("application").appendChild(save);*/
	},'json');
	
});
function submission(p){
	$("#do").val(p);
	document.getElementById("application").submit();
}
function createlayout(id,question,content,order){
	var container = document.createElement("div");
	container.className = "container";
	document.getElementById("application").appendChild(container);
	var questionholder = document.createElement("p");
	questionholder.id = "question"+id;
	questionholder.innerHTML = question;
	container.appendChild(questionholder);
	/*var idholder = document.createElement("input");
	idholder.id = "idname"+id;
	//idholder.setAttribute("name","id"+order.toString());
	idholder.name  ="idnumber"+order.toString();
	//$("#id"+id).attr("name","id"+order.toString());
	$('#idname'+id).val("dsfdssdfds");
	idholder.setAttribute("type","hidden");
	document.getElementById("application").appendChild(idholder);*/
	var idholder = document.createElement("div");
	var idholdername = "id"+order.toString();
	idholder.innerHTML = "<input type=\"hidden\" name=\""+idholdername+"\" value=\""+id+"\" >"
	document.getElementById("application").appendChild(idholder);
	var textarea = document.createElement("textarea");
	textarea.id="textarea"+id;
	//textarea.className = "form-control";
	textarea.name = "content"+order.toString();
	//$("#"+"textarea"+id).attr("name","content"+order.toString());
	$("#"+"textarea"+id).attr("rows","10");
	//$("#"+"textarea"+id).val(content);
	textarea.value  =content;
	container.appendChild(textarea);
}
