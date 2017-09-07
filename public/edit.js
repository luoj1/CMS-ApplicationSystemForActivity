$(document).ready(function() {
	var everything;
	
	/*$.post( '/edit',{ x: 'email'} ,function( data,status ) {
	console.log("output");
	var output = '';
	$("#x").text('welcome '+data.u.toString());
	  }, 'json'); 
	  */
	  
	$.post('/indexContent',function(data,status){
		everything = data;
		for(var i =0; i<data.id.length;i++){
			createSection(data.id[i],data.title[i],data.time[i],data.content[i],data.name[i]);
		}
	},'json')
	
	
	
})

function createSection(id,title,date,content,editor){
	var panel = document.createElement("div");
	panel.id = id;
	panel.className = "panel panel-default";
	$("#panelboard").append(panel);
	var titlehead = document.createElement("div");
	titlehead.id = "title"+id;
	titlehead.className = "panel-heading col-sm-10";
	titlehead.innerHTML=title;
	var datehead = document.createElement("div");
	datehead.id = "date"+id;
	datehead.className = "panel-heading col-sm-2";
	datehead.innerHTML = date;
	panel.appendChild(titlehead);
	panel.appendChild(datehead);
	var bodypart = document.createElement("div");
	bodypart.className= "panel-body";
	$('.panel-body').css("max-height",300);
	panel.appendChild(bodypart);
	var buttongroup = document.createElement("div");
	buttongroup.className = "btn-group"
	bodypart.appendChild(buttongroup);
	var formgroup = document.createElement("form");
	formgroup.setAttribute("action","/edit");
	formgroup.setAttribute("method","post");
	formgroup.innerHTML = '<button name=\"del\" value='+'\"'+id+'\"'+'>delete</button>'+'<button name=\"edit\" value=\"'+id+'\">edit</button>'+'<input type=\"hidden\" name=\"e\" value=\"'+document.getElementById("useremail").className+'\" >';	

	/*
	var deletebutton = document.createElement("button"); 	
	deletebutton.id = "delete"+id;
	deletebutton.className = "btn btn-primary";
	//deletebutton.setAttribute("type", "submit");
	deletebutton.name= "del";
	deletebutton.value = id;
	deletebutton.innerHTML = "delete";
	//formgroup.appendChild(deletebutton);
	*/
	/*
	var editbutton = document.createElement("button");
 	editbutton.id = "edit"+id;
	editbutton.innerHTML = "edit";
	editbutton.className = "btn btn-primary";
	//editbutton.setAttribute("type", "button");
	deletebutton.setAttribute("name", "edit");
	deletebutton.setAttribute("value",id);
	//formgroup.appendChild(editbutton);
	*/
	buttongroup.appendChild(formgroup);
	var bodycontent = document.createElement("div");
	bodycontent.id = "body"+id;
	bodycontent.innerHTML = content;
	bodypart.appendChild(bodycontent);
	var footer = document.createElement("div")
	footer.id="footer"+id
	footer.className = "panel-footer"
	footer.innerHTML = editor;
	panel.appendChild(footer);
	/*$("#"+deletebutton.id).click(function(){
	panelboard.removeChild(panel);
	});*/
}