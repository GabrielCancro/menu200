import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

//$(document).ready(initPage);

export async function initPage(){ 
    $("#btn_login").click(btn_login_click);
    //$("#btn_login_google").click(btn_login_google_click);
    
    $("#btn_new_account").click(btn_new_account_click);
    $("#btn_forgot_pass").click(btn_forgot_pass_click);
}

async function btn_login_click(e){
    $(e.target).addClass("inProgress");
    $("#tx_error").html("precessing..");
    let email = $("#inp_email").val();
    let pass = $("#inp_pass").val();
    let res = await fireutils.login(email,pass);
    if(res.success){
        await main.changePage("home");
    }else{
        $("#tx_error").html("ERROR: "+res.error);
    }        
    $("#btn_login").removeClass("inProgress");
}

async function btn_login_google_click(e){
    $(e.target).addClass("inProgress");
    $("#tx_error").html("precessing..");
    let email = $("#inp_email").val();
    let pass = $("#inp_pass").val();
    let res = await fireutils.loginWithGoogle();
    console.log("loginWithGoogle ",res);
    $("#btn_login").removeClass("inProgress");
}

async function btn_new_account_click(e){
    console.log("btn_new_account_click",e);
    $(e.target).addClass("inProgress");    
    await main.changePage("newAccount");
}

function btn_forgot_pass_click(e){
    main.changePage("resetPassword");
}

