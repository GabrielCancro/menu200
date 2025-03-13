import * as fireutils from "../libs/fireutils.js";
import * as fdb from "../libs/firebase_realtime_basedata.js";
import * as main from "../js/main.js";

export async function initPage(){ 
	var info = await get_user_info();
	$(".tx_username").html(info.gamename);
    $(".tx_mail").html(info.email);	
    $("#btn_logout").click(async (e)=>{
        $("#btn_logout").addClass("inProgress");
        await fireutils.logout();  
        main.changePage("login");      
    });
    /*$("#btn_bbc").click(()=>{
    	main.changePage("bbcProjects"); 
    });*/
}

async function get_user_info(){
	var info = fireutils.getUser();
	var users = await fdb.read_db("users");
	for (var i in users) {
		if (users[i].mail == info.email){
			info["gamename"] = users[i].name;
			break;
		}
	}
	return info;
}