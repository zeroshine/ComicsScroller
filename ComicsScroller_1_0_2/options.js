
var ris=document.getElementsByName("mode");
for(var k=0;k<ris.length;++k){
	if(localStorage["mode"]==ris[k].value){
		ris[k].checked=true;
	}
	ris[k].onclick=function(){
		console.log(this.value);
		localStorage["mode"]=this.value;
	}
}