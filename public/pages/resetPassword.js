import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

export async function initPage(){    
    $("#btn_back").click(btn_back_click);
    $("#btn_reset_pass").click(btn_reset_pass_click);
}

async function btn_back_click(e){
    $(e.target).addClass("inProgress");
    await main.changePage("login");
    $(e.target).removeClass("inProgress");
}

async function btn_reset_pass_click(e){
    $(e.target).addClass("inProgress");
    $("#tx_error").html("precessing..");
    let email = $("#inp_email").val();
    let res = await fireutils.sendRestorePasswordEmail(email);
    $("#tx_error").html("Perfecto! Revisa tu casilla de mail..");
}