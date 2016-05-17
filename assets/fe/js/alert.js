function alertSuccess( txt, delay ){
	$("#alert-success").fadeIn( "fast" );
	$("#alert-success").children(".alert-text").html(txt);
	delay? delay : delay=4000;
	setTimeout(function(){
		alertSuccessHide()
	},delay)
}
function alertSuccessHide(){
	$("#alert-success").fadeOut( "slow" );
}

function alertError( txt, delay ){
	$("#alert-error").fadeIn( "fast" );
	$("#alert-error").children(".alert-text").html(txt);
	delay? delay : delay=4000;
	setTimeout(function(){
		alertErrorHide();
	},delay)
}
function alertErrorHide(){
	$("#alert-error").fadeOut( "slow" );
}
function alertClose(el){
	$(el).parent().fadeOut( "fasts" );
}