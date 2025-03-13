
export default class JsonEditor{
    constructor(idBaseNode) {
        this.root = $('#'+idBaseNode);
        this.root.html("JSON EDITOR!");
    }
    select(data){
        this.root.html( "" );
        for( let i in data ){
            this.root.append( this._get_json_line(i,data[i]) );
        }
        this.root.append( this._get_json_line() );
    }

    deselect(){
        this.root.html("");
    }

    getData(){
        var data = {}
        var lines = $('.json_editor_line');
        lines.each((index,elem) => {            
            let k = $(elem).find('#key').val();
            let v = $(elem).find('#value').val();
            if( k && v ) data[k] = v; 
            console.log(k+"::"+v)
        });        
        console.log("getData",data)
        return data; 
    }

    _get_json_line(k='',v=''){
        var keyDiv = '<input id="key" value="'+k+'"/>';
        var valDiv = '<input id="value" value="'+v+'"/>';
        if(k=="content") valDiv = '<textarea id="value" rows="4" cols="15">'+v+'</textarea>';
        return $('<div class="json_editor_line">'+keyDiv+':'+valDiv+'</div>');
    }

}