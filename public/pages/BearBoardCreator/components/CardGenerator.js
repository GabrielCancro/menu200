var CURRENT_CARD_ID = null;
var cardData;

export function createCard(_cardData,cardId){
    cardData = _cardData;
    CURRENT_CARD_ID = cardId;
    var div = $('<div id="card_space" class="card_print"></div>');
    div.css('width',cardData.size_x);
    div.css('height',cardData.size_y);
    for(var id in cardData.nodes) create_node(div,id);
    return div;
}

function create_node(div,id){
    var data = cardData.nodes[id];
    data.id = id;
    var child = $('<div id="'+data.id+'" class="node"/>');
    apply_css(child,data);
    if(data.parent) $('#'+data.parent).append(child);
    else div.append(child);
    //CARDS OVERRIDERS
    if(
        cardData.cards[CURRENT_CARD_ID] 
        && cardData.cards[CURRENT_CARD_ID][id]
    ) apply_css(child,cardData.cards[CURRENT_CARD_ID][id]);
}

function apply_css(node,data){
    node.css(data);
    if(data.content) node.html(data.content);
    if(data.image) node.css('backgroundImage','url("'+data.image+'")');
}