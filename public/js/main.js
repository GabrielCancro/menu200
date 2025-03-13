import * as fireutils from "../libs/fireutils.js";
import * as fdb from "../libs/firebase_realtime_basedata.js";
import * as loginPage from "../pages/login.js";
import * as homePage from "../pages/home.js";
import * as newAccountPage from "../pages/newAccount.js";
import * as verificationPage from "../pages/verification.js";
import * as resetPasswordPage from "../pages/resetPassword.js";

import * as bearBoardCreator from "../pages/BearBoardCreator/bearBoardCreator.js";
import * as bbcProjectsPage from "../pages/BearBoardCreator/bbcProjects.js";
import * as printCardsPage from "../pages/BearBoardCreator/printCards.js";

var pagesRef = {
	login: loginPage,
	home: homePage,
	newAccount: newAccountPage,
	verification: verificationPage,
	resetPassword: resetPasswordPage,
	bearBoardCreator: bearBoardCreator,
	bbcProjects: bbcProjectsPage,
	printCards: printCardsPage,
}


document.addEventListener('DOMContentLoaded', initApp);
const no_require_auth = ["login","newAccount","resetPassword"];
async function initApp(){
  	fireutils.startFirebase();

  	//var subpath = window.location.pathname.split('/')[0];
	var urlParams = new URLSearchParams(window.location.search);
	//console.log("urlParams ", urlParams)
	let subpath = urlParams.get('p')
	if (pagesRef[subpath]!=undefined) changePage(subpath);
	else changePage("home");
  	
}

export async function changePage(pageName){
	console.log("changePage ", pageName)
	let logued = await fireutils.isLogued();
	console.log("USER:",fireutils.getUser());
	if( logued == false && !no_require_auth.includes(pageName) ) pageName = "login";	
	if(logued && !fireutils.getUser().emailVerified) pageName = "verification";
	var pageURL = "pages/"+pageName+".html";
	if(pagesRef[pageName].pageRoot)	pageURL = pagesRef[pageName].pageRoot+"/"+pageName+".html";
	console.log("changePage URL",pageURL);
	$("#app").load(pageURL, ()=>{
		pagesRef[pageName].initPage();
	});
}

export async function showfloatText(msg){
	$('.floatText').remove();
	var div = $('<div class="floatText">'+msg+'</div>');
	$('body').append(div);
	return new Promise((resolve) => setTimeout(()=>{
		div.remove();
		resolve();
	}, 500+msg.length*110));
}

