import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";
import * as cardGen from "./components/CardGenerator.js";
//import * as jspdf from "./components/jspdf.min.js";
import * as main from "/js/main.js";



export var pageRoot = "pages/BearBoardCreator";
var cardData;
var CNT_CARDS;

export async function initPage(){ 
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/styles.css'}); 
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/print_styles.css'}); 
    //$('<link>').appendTo('head').attr({type: 'application/javascript',href: 'pages/BearBoardCreator/components/html2pdf.bundle.min'}); 
    cardData = window.CARD_DATA_TO_PRINT;
    createAllCards();
    $("#btn_print").click(async ()=>{
        window.print();
    }); 
    $("#btn_pdf").click(async ()=>{
        var element = document.getElementById('print_work_space');
        var worker = html2pdf().from(element).save();
    }); 
    $("#btn_back").click(async ()=>{
        main.changePage("bearBoardCreator");
    }); 
    $("#btn_config").click(async ()=>{
        $("#config_page_bg").removeClass("hidden");        
        $("#cnf_page_w").val(cardData.page_size_x);
        $("#cnf_page_h").val(cardData.page_size_y);
        $("#cnf_int_margin").val(cardData.internal_margin);
    }); 
    $("#btn_close_config_page").click(async ()=>{
        $("#config_page_bg").addClass("hidden");        
        apply_config();
    }); 
}

function createAllCards(){
  $('#print_work_space').html('');  
  CNT_CARDS = 0;
	for( let c in cardData.cards){
        let amount = 1;
        if(cardData.cards[c] && cardData.cards[c].amount) amount = cardData.cards[c].amount
        for (let i=0; i<amount; i++) {
            CNT_CARDS += 1;
            let div = cardGen.createCard(cardData,c);
		    $('#print_work_space').append(div);
        }		
	}
  apply_css_page();
}

async function apply_config(){
    var sx = $("#cnf_page_w").val();
    if(sx!=""){
      cardData.page_size_x = sx;      
      $("#cnf_page_w").val('');
    } 
    var sy = $("#cnf_page_h").val();
    if(sy!=""){ 
      cardData.page_size_y = sy;
      $("#cnf_page_h").val('');
    }
    var im = $("#cnf_int_margin").val();
    if(im!=""){ 
      cardData.internal_margin = im;
      $("#cnf_int_margin").val('');
    }
    apply_css_page();
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    await fdb.write_db("bear_board_creator/"+save_mail+"/projects",cardData.projectName,cardData);
}

function apply_css_page(){
  if(!cardData.page_size_x) cardData.page_size_x = '21cm';
  if(!cardData.page_size_y) cardData.page_size_y = '29.7cm';
  if(!cardData.internal_margin) cardData.internal_margin = "0.02cm";
  $('.card_print').css('margin-bottom',cardData.internal_margin);
  $('.card_print').css('margin-right',cardData.internal_margin);

  //calculate start paddings
  var c = {}
  c.intMarg = parseFloat(cardData.internal_margin.replace('cm',''));

  c.pageW = parseFloat(cardData.page_size_x.replace('cm',''))-2;
  c.cardW = parseFloat(cardData.size_x.replace('cm',''));  
  c.cntX = Math.floor( (c.pageW)/(c.cardW+c.intMarg) );
  c.cardsW = c.cntX*(c.cardW+c.intMarg);
  c.padX = (c.pageW-c.cardsW+c.intMarg)/2;  
  $('#print_paper').css('width',(c.pageW)+'cm');
  $('#print_work_space').css('padding-left',c.padX+'cm');
  $('#print_work_space').css('width',(c.pageW-c.padX)+'cm');
  $('#print_paper').css('width',(c.pageW)+'cm');

  c.pageH = parseFloat(cardData.page_size_y.replace('cm',''))-2;
  c.cardH = parseFloat(cardData.size_y.replace('cm',''));  
  c.cntY = Math.floor( (c.pageH)/(c.cardH+c.intMarg) );
  c.cardsH = c.cntY*(c.cardH+c.intMarg);
  c.padY = (c.pageH-c.cardsH+c.intMarg)/2;  
  $('#print_paper').css('height',(c.pageH)+'cm');
  $('#print_work_space').css('padding-top',c.padY+'cm');
  $('#print_work_space').css('height',(c.pageH-c.padY)+'cm');
  $('#print_paper').css('height',(c.pageH)+'cm');
  
  var cards_array = $('.card_print');
  for (let i = 0; i < cards_array.length; i++) {
    console.log('-'+i)
    if(i>c.cntX*c.cntY-1) $(cards_array[i]).addClass('hidden');
    else $(cards_array[i]).removeClass('hidden');
  }
  $('#btn_page').html((c.cntX*c.cntY)+' / '+CNT_CARDS);
  //console.log( c );
}