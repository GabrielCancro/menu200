import * as fireutils from "../libs/fireutils.js";
import * as fdb from "../libs/firebase_realtime_basedata.js";
import * as main from "../js/main.js";

export async function initPage(){    
    $("#btn_back").click(btn_back_click);
    $("#btn_create_new_account").click(btn_create_new_account_click);
}

async function btn_back_click(e){
    $(e.target).addClass("inProgress");
    await main.changePage("login");
    $(e.target).removeClass("inProgress");
}

async function btn_create_new_account_click(e){
    console.log("btn_create_new_account_click");
    $(e.target).addClass("inProgress");
    $("#tx_error").html("precessing..");
    let email = $("#inp_email").val();
    let username = $("#inp_username").val();
    let pass = $("#inp_pass").val();  
    let isValidUser = await check_username(username); 
    if( isValidUser ){
        let res = await fireutils.createUser(email,pass);
        if(res.success){
            await fireutils.sendVerificationEmail();
            await fdb.write_db("users",username,{name:username,mail:email});
            await main.changePage("home");
        }else{  
            $("#tx_error").html("ERROR: "+res.error);
        }
    }    
    $(e.target).removeClass("inProgress");
}

async function check_username(username){
    if(username.length<1){
        $("#tx_error").html("Debes escribir un nombre de usuario.");
        return false;
    }
    if(username.length<3){
        $("#tx_error").html("Nombre de usuario demasiado corto.");
        return false;
    }
    $("#tx_error").html("Comprobando...");
    var users = await fdb.read_db("users");
    if(users && users[username]){
        $("#tx_error").html("Ese nombre de usuario ya existe.");
        return false;
    }
    return true;
}