import { 
	getDatabase, 
	ref, child, get, update,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

var user_list;

export async function read_db(url){
	console.log("reading db! ",url);
	const dbRef = ref(getDatabase());
	var snapshot = await get( child(dbRef, url) );
	return snapshot.val();
}

export async function write_db(url,key,data){
	console.log("writing db! ",url);
	const dbRef = ref(getDatabase());
	var upd = {};
	upd[url+"/"+key] = data;
	var res = await update( dbRef, upd );
	console.log("writing result",res);
  	return res; 
}
