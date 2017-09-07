$(document).ready(function(){
$("#send").prop('disabled',true);
var email = $("#em").val();
$.post('/countdown',{second:"second", em: email }, function(data,status){
var s = data.second;
var interval = setInterval(function(){
console.log(s + "second");
s = s-1;
if(s<0){
s=0;
$("#send").prop('disabled',false);
clearInterval(interval);
}
$("#t").text(s.toString());

},1000);
},'json');
$("#send").click(function(){
$("#send").prop('disabled',true);
$.post('/sendnew',{sendcode:"sendcode", em: email }, function(data,status){
var s = data.second;
var interval = setInterval(function(){
console.log(s + "second");
s = s-1;
if(s<0){
s=0;
$("#send").prop('disabled',false);
clearInterval(interval);
}
$("#t").text(s.toString());

},1000);
},'json');
});

});


