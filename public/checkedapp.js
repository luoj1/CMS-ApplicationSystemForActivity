$(document).ready(function(){
	$.post("getallchecked",{checked:"checked",poke:$("#poke").val()},function(data,sta){
		var tempa= "->";
		var tempw= "->";
		var tempr = "->";
		if(data.answer!=undefined){
		for(var i = 0; i<data.answer.length;i++){
			if(data.answer[i].status == "reject"){
				tempr+=data.answer[i].email+" "+data.answer[i].status+"<br>";
			}else if(data.answer[i].status == "admitted"){
				tempa+=data.answer[i].email+" "+data.answer[i].status+"<br>";
			}else{
				tempw+=data.answer[i].email+" "+data.answer[i].status+"<br>";
			}
			
		}
		
		}
		document.getElementById("displayapp").innerHTML = tempa+"<br>"+tempw+"<br>"+tempr;
		
	},'json');


})