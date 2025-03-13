import { 
	getFirestore, 
	setDoc, getDocs, doc, getDoc, 
	collection, query, where 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

export async function writeFirebase(coll_name,data){
	if (!data.id){
		console.log("ERROR: Falta el campo <id> en ",data);
		return
	}
	try {
	  const docRef = await setDoc(doc(db, coll_name, data.id), data);
	  console.log("Document written with ID: ", data.id);
	} catch (e) {
	  console.error("Error adding document: ", e);
	}
}

export async function readFirebase(coll_name,id=null){
	try {
		if(!id){
			const querySnapshot = await getDocs(collection(db, coll_name));
			querySnapshot.forEach((doc) => {
			  console.log(doc.id,"=>",doc.data());
			});
			return _docsToObject(querySnapshot);
		}else{
			const docRef = doc(db, coll_name, id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
			  console.log("Document data:", docSnap.data());
			  return _docsToObject(docSnap);
			} else {
			  // doc.data() will be undefined in this case
			  console.log("No such document!");
			}
		}	
		return null;		
	} catch (error) {
		console.warn("@@@@ERROR",error);
		return null;
	}	
}

export async function readWhereFirebase(coll_name,paramA,opp,paramB){
	try {
		const querry = query(collection(db, coll_name), where(paramA, opp, paramB));
		const querySnapshot = await getDocs(querry);
		querySnapshot.forEach((doc) => {
		console.log(doc.id, " => ", doc.data());
		return _docsToObject(querySnapshot);
		});
	} catch (error) {
		console.warn("@@@@ERROR",error);
		return null;
	}		
	
}

function _docsToObject(docs){
	var result = {};
	docs.forEach((doc) => {
		result[doc.id] = doc.data();
	});
	return result;
}