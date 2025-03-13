import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";
import JsonEditor from "./components/JsonEditor.js";
import * as fontLoader from "./components/FontLoader.js";
import * as main from "/js/main.js";
import * as cardGen from "./components/CardGenerator.js";

export var pageRoot = "pages/BearBoardCreator";
export async function initPage(){ 
    console.log("https://sites.google.com/view/usefulweb-devtips/home");
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/styles.css'});
    EDITOR_JSON = new JsonEditor("json_editor"); 
    if(!window.CURRENT_BBC_PROJECT_SELECTED) window.CURRENT_BBC_PROJECT_SELECTED = "chozadepts";
    await loadFile(window.CURRENT_BBC_PROJECT_SELECTED);
    loadCardList();
    set_header_actions();
    fontLoader.loadAllFonts();
}

var EDITOR_JSON;
var CURRENT_NODE_ID = null;
var CURRENT_CARD_ID = null;
var CURRENT_MODE = "DESIGN"; // DESIGN-CARDS

async function set_header_actions(){
    $("#btn_project").click(()=>{
        main.changePage("bbcProjects");
    });
    $("#btn_apply").click(async ()=>{
        //console.log("CARD DATA",cardData);
        if(!CURRENT_NODE_ID){
            updateCard(true);
            await saveFile(cardData,"nodesData.json");
            return;
        }
        $("#btn_apply").html('WAIT..');
        try{
            if(CURRENT_MODE=="DESIGN") cardData.nodes[CURRENT_NODE_ID] = EDITOR_JSON.getData();
            if(CURRENT_MODE=="CARDS") cardData.cards[CURRENT_CARD_ID][CURRENT_NODE_ID] = EDITOR_JSON.getData();
            if($('#size_card_x').val()) cardData.size_x = $('#size_card_x').val();
            if($('#size_card_y').val()) cardData.size_y = $('#size_card_y').val();
            $('#size_card_x').val('');
            $('#size_card_y').val('');
            updateCard(false);            
            await saveFile(cardData,"nodesData.json");
            $("#btn_apply").html('APPLY');
        }catch(e){
            //console.log(e);
            $("#btn_apply").html('ERROR');            
        }        
    });    
    $("#btn_print").click(async ()=>{
        window.CARD_DATA_TO_PRINT = cardData;
        main.changePage("printCards");
    });  
    $("#delete_node").click(async ()=>{
        delete cardData.nodes[CURRENT_NODE_ID];
        updateCard();
        await saveFile(cardData,"nodesData.json");
    });
    $("#btn_add_text").click(async ()=>{
        cardData.idNewNodes += 1;         
        cardData.nodes["n"+cardData.idNewNodes] = { 
            type: "text",
            content:"TEXTO", textAlign:"left", fontSize:"12pt", fontFamily:"Arial",
            fontStyle: "normal",fontWeight: "normal",zIndex:"auto",
            width:"100%",height:"auto",position:"absolute",top:0,left:0 
        };
        updateCard();
        await saveFile(cardData,"nodesData.json");
    });
    $("#btn_add_img").click(async ()=>{        
        cardData.idNewNodes += 1;       
        cardData.nodes["n"+cardData.idNewNodes] = { 
            type: "image",
            image:'https://source.unsplash.com/random/200x200?sig=1', 
            backgroundSize:"100% 100%", zIndex:"auto",
            width:"50%",height:"50%",position:"absolute",top:0,left:0 
        };
        updateCard();
        await saveFile(cardData,"nodesData.json");
    });    
    $("#amount_card").change(async ()=>{ 
        var val = parseInt($("#amount_card").val());
        if(val==undefined) return;
        if(!CURRENT_CARD_ID) return;
        cardData.cards[CURRENT_CARD_ID].amount = val;
        await saveFile(cardData,"nodesData.json");
    });  
    $("#name_card").change(async ()=>{ 
        if(!CURRENT_CARD_ID) return;
        cardData.cards[CURRENT_CARD_ID].cardName = $("#name_card").val();
        loadCardList();
        await saveFile(cardData,"nodesData.json");
    });
    $("#delete_card").click(async ()=>{
        $("#delete_card").html('DELETING..');
        console.log(cardData.cards[CURRENT_CARD_ID])
        delete cardData.cards[CURRENT_CARD_ID];
        var index = $("#slc_cards").prop('selectedIndex')
        loadCardList();
        await saveFile(cardData,"nodesData.json");
        $("#delete_card").html('DELETE CARD');        
        $("#slc_cards").prop('selectedIndex',index-1);
        $("#slc_cards").change();
    });  
    
}

function loadCardList(){
    var slcElem = $("#slc_cards").html('<option selected value="DESIGN"> # DISEÑO # </option>');
    for(var card in cardData.cards){
        let cardName = card;
        resetCardName(card);
        if(cardData.cards[card].cardName) cardName = cardData.cards[card].cardName;        
        slcElem.append( $('<option value="'+card+'">'+cardName+'</option>') );  
    }
    slcElem.append( $('<option value="ADD">+AGREGAR+</option>') ); 
    slcElem.change( async (e)=>{         
        var opt = slcElem.find("option:selected");        
        if (opt.val()=="DESIGN"){
            CURRENT_MODE="DESIGN"
            CURRENT_CARD_ID = null;           
        }else if (opt.val()=="ADD"){            
            cardData.idNewCards += 1;
            let newId = "c"+cardData['idNewCards'];
            cardData.cards[newId] = { cardName:"NewCard" };
            //console.log( "@@@",slcElem.val() )
            loadCardList();
            let size = Object.keys(cardData.cards).length;            
            slcElem.prop('selectedIndex',size);
            slcElem.change();            
        }else{
            CURRENT_MODE="CARDS"
            CURRENT_CARD_ID = opt.val();
        }
        updateCard();
    });
}

function updateCard(deselectNodes = true){
    if(deselectNodes) deselect_node();
    $('#card_space').remove();
    let div = cardGen.createCard(cardData,CURRENT_CARD_ID);    
    div.click(select_node); 
    $('#design_work_space').append(div);
    recalculateCardScale();
    set_selector_node();
    updateNodeList();
    updateInterface();     
}

function resetCardName(cardId){
    if(!cardData.cards[cardId]) return;
    for(let n in cardData.nodes){
        if(cardData.nodes[n].isTitle!="true") continue;
        if(!cardData.cards[cardId][n].content) continue;
        cardData.cards[cardId].cardName = cardData.cards[cardId][n].content;
        console.log(cardId+" > "+n+" :: "+cardData.cards[cardId].cardName); 
    }
}

function updateNodeList(){
    $('#nodes_list').html('');
    for(let n of Object.keys(cardData.nodes)){
        var btn = $("<span class='nodeListButton'>"+n+"</span>");
        btn.click( ()=>{
            select_node({target:$("#"+n)});
        });
        $('#nodes_list').append(btn);
    }    
}

function updateInterface(){
    if(CURRENT_MODE=="DESIGN"){
        $("#add_node_panel").removeClass("hidden");        
        if(CURRENT_NODE_ID) $('#delete_node').removeClass("hidden");
        else $('#delete_node').addClass("hidden");
        $('#amount_card').addClass("hidden");
        $('#name_card').addClass("hidden");
        $('#delete_card').addClass("hidden");
        $('#size_card_x').removeClass("hidden");        
        $('#size_card_x').val(cardData.size_x);
        $('#size_card_y').removeClass("hidden");        
        $('#size_card_y').val(cardData.size_y);
    }else{
        $("#add_node_panel").addClass("hidden");
        $('#delete_node').addClass("hidden");
        $('#amount_card').removeClass("hidden"); 
        $('#name_card').removeClass("hidden");        
        $('#delete_card').removeClass("hidden");
        $('#size_card_x').addClass("hidden");
        $('#size_card_y').addClass("hidden");
    }
    $('#btn_node_id').html(CURRENT_NODE_ID); 
    if(CURRENT_CARD_ID){
        if(!cardData.cards[CURRENT_CARD_ID].amount) cardData.cards[CURRENT_CARD_ID].amount = 1;
        $("#amount_card").val(cardData.cards[CURRENT_CARD_ID].amount);  
        $("#name_card").val(cardData.cards[CURRENT_CARD_ID].cardName);  
    }
}

function recalculateCardScale(){
    var scale = 1;
    var sw = .9*$('#design_work_space').width()/$('#card_space').width();
    var sh = .9*$('#design_work_space').height()/$('#card_space').height();
    var scale = Math.min(sw,sh);
    $('#card_space').css('transform','translate(-50%,-50%) scale('+scale+')');
}

function get_json_from_pre(idElem){
    var str = $('#'+idElem).html();
    str = str.replaceAll("<div>","");
    str = str.replaceAll("</div>","");
    str = str.replaceAll("<br>","");
    //console.log("@@@"+str);
    return JSON.parse(str);
}

function select_node(e){
    deselect_node();
    let id = $(e.target).attr('id');
    if(id=="selector_node" || id=="card_space" || CURRENT_NODE_ID==id) return;
    CURRENT_NODE_ID = id;     
    updateInterface();
    set_selector_node(CURRENT_NODE_ID);  
    if( CURRENT_MODE=="DESIGN" ){
        EDITOR_JSON.select(cardData.nodes[id]);
    }else if(cardData.cards[CURRENT_CARD_ID]){
        if(cardData.cards[CURRENT_CARD_ID][id] ){
            EDITOR_JSON.select(cardData.cards[CURRENT_CARD_ID][id]);
        } else EDITOR_JSON.select({});
    } else EDITOR_JSON.deselect();  
}

function set_selector_node(){
    var node = $("#"+CURRENT_NODE_ID);
    $('#selector_node').remove();
    if(node) node.append( $('<div id="selector_node"></div>') );   
}

function reselect_node(){
    var aux_id = CURRENT_NODE_ID;
    CURRENT_NODE_ID = null;
    select_node( {target:$("#"+aux_id)} );
}

function deselect_node(){
    CURRENT_NODE_ID = null;
    EDITOR_JSON.deselect();
    $('#selector_node').remove();
    updateInterface();
}

async function saveFile(data, filename){
    var text = JSON.stringify(data);
    /*var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();*/
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    await fdb.write_db("bear_board_creator/"+save_mail+"/projects",cardData.projectName,cardData);
}

async function loadFile(projectName){
    /*
    return new Promise(resolve=>{
        $.getJSON(filename, function(data){
            resolve(data);
        }).fail(function(){
            console.log("An error has occurred.");
            resolve(null);
        });
    });    
    */
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    var data = await fdb.read_db("bear_board_creator/"+save_mail+"/projects/"+projectName);
    if(data) cardData = data;
    if(!cardData.cards) cardData['cards']= {};
    if(!cardData.nodes) cardData['nodes']= {};
    if(!cardData.idNewNodes) cardData['idNewNodes']= Object.keys(cardData.nodes).length;
    if(!cardData.idNewCards) cardData['idNewCards']= Object.keys(cardData.cards).length;
    $("#btn_project").html(cardData.projectName);
    updateCard();
}

var cardData = {
    projectName: "defaultProject",
    size_x:"6cm",
    size_y:"10cm",
    nodes: {
        n1:{type:'text',w:'2cm',h:'2cm',style:{backgroundColor:"blue",content: 'Hola Amigo!'} },
        n2:{type:'text',w:'100%',h:'2cm',style:{backgroundColor:"yellow",padding:'.2cm',content: 'Hola Amigo!'} },
        //n3:{parent: "c1", type:'text',w:'50%',h:'2cm',tx:'sss',style:{backgroundColor:"Brawn"} },
        n4:{type:'text',w:'100%',h:'5.6cm',style:{
            background:'red  url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQV9WKkVv6rzdewQFCVj09zGHAvq5hpZzyeWFtjTWu4opj7knKshsQD6VZkmLoQb7rr0&usqp=CAU") no-repeat center',
            backgroundSize:'100% 100%',
        } },
    },
    cards:{
        c1:{ n1:{backgroundColor:"red"} },
        c2:{},
        c3:{},
        c4:{},
    }
}
