export var FONTS = {
    VeryYou: {family:"Very You", cdn: 'https://fonts.cdnfonts.com/css/very-you'},
    MedievalScribish: {family:"Very You", cdn: 'https://fonts.cdnfonts.com/css/medieval-scribish'},
    Amagro: {family:"Very You", cdn: 'https://fonts.cdnfonts.com/css/amagro'}
}

export function loadAllFonts(){
    for (let f in FONTS){
        $('<link>').appendTo('head').attr({rel: 'stylesheet',href: FONTS[f].cdn});
        console.log(f)
    }
}