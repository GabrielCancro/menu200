import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";
import * as main from "/js/main.js";

export var pageRoot = "pages/BearBoardCreator";

var PROJECTS = []
export async function initPage(){     
    console.log("CURRENT USER",fireutils.getUser());
    loadProjectsList();
}

async function loadProjectsList(){
    $("#project_list").html("");
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    var data = await fdb.read_db("bear_board_creator/"+save_mail+"/projects");
    PROJECTS = data;
    for(var projectName in PROJECTS){
        var btn = $('<div class="ds_btn">'+projectName+'</div>');
        btn.click( (e)=>{
            console.log( "CLICK EN ",$(e.target).html() );
            window.CURRENT_BBC_PROJECT_SELECTED = $(e.target).html();
            main.changePage("bearBoardCreator");
        })
        $("#project_list").append(btn);
    }

    $("#btn_new_project").click( async (e)=>{
        var name = $("#inp_new_project").val();        
        if(Object.keys(PROJECTS).length>=5){
            main.showfloatText("No puedes tener mas de cinco proyectos a la vez.");
            return;
        }
        if(name==""){
            main.showfloatText("Debes ingresar un nombre para tu proyecto.");
            return;
        } 
        for(var projectName in PROJECTS){
            if(projectName==name){
                main.showfloatText("Ya tienes un proyecto con ese nombre, elige otro..");
                return;
            }
        }

        $("#inp_new_project").val('');
        $("#project_list").html("");
        var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
        var data = {
            projectName:name,
            size_x:"4cm", size_y:"6cm",
        }
        await fdb.write_db("bear_board_creator/"+save_mail+"/projects",name,data);

        loadProjectsList();
    });

    $("#btn_del_project").click( async (e)=>{
        if( $("#inp_del_project").hasClass("hidden") ){
            $("#inp_del_project").removeClass("hidden");
            return;
        }
        var name = $("#inp_del_project").val();
        if(!PROJECTS[name]){
            main.showfloatText("Debes ingresar el nombre del proyecto que deseas eliminar.");
            return;
        }
        $("#inp_del_project").val('');
        $("#inp_del_project").addClass("hidden");
        $("#project_list").html("");
        var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
        await fdb.write_db("bear_board_creator/"+save_mail+"/projects",name,null);

        loadProjectsList();
    });
}