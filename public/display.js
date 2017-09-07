
$(document).ready(function() {
	$.post( '/indexContent', function( data,status ) {
	console.log("output");
	
	for(var i =data.id.length-1; i>=0;i--){
			createSection(data.id[i],data.title[i],data.time[i],data.content[i],data.name[i]);
		}
},'json');		
	
	
})
function createSection(id,title,date,content,editor){
	var panel = document.createElement("div");
	panel.id = id;
	panel.className = "panel panel-default";
	$("#panelboard").append(panel);
	var titlehead = document.createElement("div");
	titlehead.id = "title"+id;
	titlehead.className = "panel-heading col-sm-10 titlehead";
	titlehead.innerHTML=title;
	var datehead = document.createElement("div");
	datehead.id = "date"+id;
	datehead.className = "panel-heading col-sm-2 datehead";
	datehead.innerHTML = new Date(parseInt(date)).toString().substring(0,15);
	panel.appendChild(titlehead);
	panel.appendChild(datehead);
	var bodypart = document.createElement("div");
	bodypart.className= "panel-body";
	bodypart.id="bp"+id;
	panel.appendChild(bodypart);
	bodypart.innerHTML = content;
	$("#bp"+id).css("max-height",300);
	var bodycontent = document.createElement("div");
	bodycontent.id = "body"+id;
	bodycontent.innerHTML = content;
	
	//bodypart.appendChild(bodycontent);
	var footer = document.createElement("div")
	footer.id="footer"+id
	footer.className = "panel-footer"
	footer.innerHTML = editor;
	panel.appendChild(footer);
	$("#"+id).click(function(){
	//alert( id+"is clicked");
	$("#bag").val(id);
	document.forms["courier"].submit();
	});
}