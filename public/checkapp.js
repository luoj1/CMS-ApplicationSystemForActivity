$(document).ready(function(){
	
	$.post("/getsubmitted",{submitted:"submitted",poke:$("#poke").val()},function(data,sta){
		//alert("start");
		//alert(data.user[data.application[0].email].username);
		for(var i = 0; i < data.application.length;i++){
			if(data.application[i]!='a'){
				//alert("start2");
				
				var em = data.application[i].email;
			//alert(em);
			var  div = document.createElement("div");
			var dropclick = document.createElement("button");
			dropclick.id = "drop"+i;
			dropclick.innerHTML = em;
			dropclick.className = "btn btn-info";
			//dropclick.href = "#div"+em.toString();
			dropclick.setAttribute("type","button");
			dropclick.setAttribute("data-toggle","collapse");
			dropclick.setAttribute("data-target","#div"+i);
			div.id = "div"+i;
			div.className = "collapse panel-body";
			dropclick.setAttribute("type","button");
			document.getElementById("displayapp").appendChild(dropclick);
			document.getElementById("displayapp").appendChild(div);
			
			/*$("#drop"+em.toString()).click(function(){
			$("#div"+em.toString()).collapse();
			});*/
			
			var userstuff = document.createElement("p");
			div.appendChild(userstuff);
			var temp = data.user[data.application[i].email];
			userstuff.innerHTML = "<strong>Name:</strong> "+temp.username+"<br><strong>Birthday:</strong> "+temp.birthday+"<br><strong>Gender:</strong> "+temp.gender+"<br><strong>MT experience? </strong>"+temp.experience+"<br><strong>phone number:</strong> "+temp.phone+"<br><strong>Address:</strong> "+temp.address+"<br><strong>School: </strong>"+temp.school+"<br><strong>Grade:</strong> "+temp.grade+"<br>"; 
			var article = document.createElement("p");
			temp="";
			for(var ii = 0; ii< data.application[i].question.length;ii++){
				temp += "<strong>"+data[data.application[i].question[ii]]+"</strong><br>"+data.application[i].content[ii]+"<br>"+"<br>";
			}
			article.innerHTML = temp;
			div.appendChild(article);
			
			var form = document.createElement("form");
			form.setAttribute("action","/changeappstatus");
			form.setAttribute("method","post");
			form.id = "form"+ data.application[i].email;
			div.appendChild(form);
			/*var form = document.createElement("form");
			form.setAttribute("action","/changeappstatus");
			form.setAttribute("method","post");
			form.id = "form";
			document.getElementById("displayapp").appendChild(form);*/
			form.innerHTML = 'reject<input type="radio" name="status" value="reject">'+
			'waitlist<input type="radio" name="status" value="waitlist" checked>'+
			'admit<input type="radio" name="status" value="admitted" >'+
			'<input type="hidden" name="email" value='+em+' >'+
			'<input type="submit" >';
			
			/*$("#"+"form"+ data.application[i].email).bind('ajax:complete', function() {
			document.getElementById("displayapp").removeChild(div);
			});*/
			}
			
		}
		
	},'json');
	
});