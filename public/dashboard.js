$(document).ready(function(){
	var span = ["username","birthday","gender","experience","address","phone","school","grade"];
	$.post("/searchuserinfo",{search:$("#em").val(),poke:$("#poke").val()},function(data,status){
		for(var i =0; i< span.length;i++){
			var x = "";
			eval("x = data."+span[i]+";");
			$("#"+span[i]).text(x);
		}
	},'json');
	$.post("/editOrnew",{edit:"new",application:$("#em").val(),poke:$("#poke").val()},function(data,status){
		if(data.new == false){
		/*$("#appbutton").html(	"<button name=\"application\" class=\"appbutton btn btn-primary\" value="+$("#em").val()+">send application</button>");
		$("#profilebutton").html(	"<button name=\"profile\" class=\"appbutton btn btn-primary\" value="+$("#em").val()+">personal profile</button>");*/
		$("#appdropdown").html('<a id="abutton">send application</a><a id="pbutton">personal profile</a>');
		$("#pbutton").click(function(){document.getElementById("profilebutton").submit();});
		$("#abutton").click(function(){document.getElementById("appbutton").submit();});
		}else{
		//$("#appbutton").html(	"<p>submitted</p>");
		$("#appdropdown").html('<a>app submitted</a>')
		}
		
	},'json');
	$.post("/appstatus",{email:$("#em").val(),poke:$("#poke").val()},function(data,status){
		//alert(data.answer.toString());
		if(data.answer.toString() == "nothing"){
			$("#applicationstatus").html("N/A");
		}else{
			$("#applicationstatus").html(data.answer.toString());
		}
	},'json');
});