$(document).ready(function() {
	$.post( '/indexContent', function( data,status ) {
	//alert(data.id.length);
	if(data.id.length<4){
		var order = 4;
	for(var i =data.id.length-1; i>=0;i--){
		definepanel(order,data.id[i],data.title[i]);
		order--;
		}
		while(order!=0){
		document.getElementById("panelgroup").removeChild(document.getElementById("panel"+order));
		order--;
		}
	}else{
		var order  = 4;
		for(var i =data.id.length-1; i>=data.id.length-4;i--){
			definepanel(order,data.id[i],data.title[i]);
			order--;
		}
	}
},'json');		
	
	
})

function definepanel(order,id,title){
	$("#panel"+order+">p:eq(0)").html(title);
	$("#panel"+order).click(function(){
	//alert( id+"is clicked");
	$("#bag").val(id);
	document.forms["courier"].submit();
	});
	
}
