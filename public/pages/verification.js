import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

var i=0;
var verify_interval;
export async function initPage(){ 
	verify_interval = setInterval(checkVerification, 2000);
	$("#tx_useremail").html(fireutils.getUser().email);	
	$("#btn_resend_mail").click(btn_resend_mail_click);
	$("#btn_logout").click(btn_logout_click);
}

async function checkVerification(){
	var user = await fireutils.refreshUser();	
	if(user.emailVerified){
		clearInterval(verify_interval);
		main.changePage("home");		
	}
}

async function btn_logout_click(e){
	$(e.target).addClass("inProgress");
	await fireutils.logout();  
	clearInterval(verify_interval);
	main.changePage("login"); 
}

async function btn_resend_mail_click(e){
	$(e.target).addClass("inProgress");
	var res = await fireutils.sendVerificationEmail();
	if(res)	$(e.target).html("MAIL ENVIADO!");
	else $(e.target).html("INTENTA MAS TARDE!");
}