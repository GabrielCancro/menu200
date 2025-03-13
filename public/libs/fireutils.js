import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
	getAuth, signInWithEmailAndPassword,
	signOut, onAuthStateChanged,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	sendPasswordResetEmail,
	GoogleAuthProvider,
	signInWithPopup,

} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";

var current_user;

export function startFirebase(){
	
	console.log("startFirebase!");
	/*const firebaseConfig = {
	  apiKey: "AIzaSyCnXkA47QeESc34oyqwt4GF6i4urOuo-00",
	  authDomain: "sistema-escolar-gc.firebaseapp.com",
	  projectId: "sistema-escolar-gc",
	  storageBucket: "sistema-escolar-gc.appspot.com",
	  messagingSenderId: "985732582520",
	  appId: "1:985732582520:web:0c6c34d124a8b316e3718d",
	  measurementId: "G-YNNT9MJPS0"
	};*/
	const firebaseConfig = {
		apiKey: "AIzaSyAam2xvP1nE_35daMjYSTjegrw3xppY2DU",
		authDomain: "bearmolegames.firebaseapp.com",
		databaseURL: "https://bearmolegames-default-rtdb.firebaseio.com",
		projectId: "bearmolegames",
		storageBucket: "bearmolegames.appspot.com",
		messagingSenderId: "254964731747",
		appId: "1:254964731747:web:eb0ac9b48759ec73798d56",
		measurementId: "G-XDZT86HGJ7"
	};
	const app = initializeApp(firebaseConfig);
	//const analytics = getAnalytics(app);
	//db = getFirestore();
	isLogued();
	//console.log(db);
}

//USERS MANAGER
export async function login(email,password){
	const auth = getAuth();
	return await new Promise(resolve=>{
		signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			//console.log("LOGUEO",user);
			current_user = user;
			resolve({success:true,user:user});
			// ...
		})
		.catch((error) => {
			current_user = null;
			resolve({success:false,error:error.code});
		});
	});	
}

export async function isLogued(){
	const auth = getAuth();
	return await new Promise(resolve=>{
		onAuthStateChanged(auth, (user) => {
			//console.log("esta logueado",user);
			current_user = user;
			if(user) resolve(true);
			else resolve(false);
		});
	});
}

export async function logout(){
	const auth = getAuth();
	return await new Promise(resolve=>{
		signOut(auth).then(() => {
			//console.log("LOGOUT OK!");
			current_user = null;
			resolve(true);
		}).catch((error) => {
			//console.log("LOGOUT ERROR",error);
			current_user = null;
			resolve(false);
		});
	});
}

export async function createUser(email, password){
	const auth = getAuth();
	return await new Promise(resolve=>{
		createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
			const user = userCredential.user;
			current_user = user;
			resolve({success:true,user:current_user});
		})
		.catch((error) => {
			resolve({success:false,error:error.code});
		});
	});
}

export async function sendVerificationEmail(){
	const auth = getAuth();
	if(current_user){
		try{
			await sendEmailVerification(current_user);
			console.warn("SE ENVIO MAIL DE VERIFICACION A ",current_user.email);
			return true;
		}catch(e){
			console.warn("ERROR AL ENVIAR MAIL DE VERIFICACION ",e);
			return false;
		}
	}
	return false;
 }

export async function sendRestorePasswordEmail(email){
	const auth = getAuth();
	var res = await sendPasswordResetEmail(auth, email)
	console.log("SendRestorePasswordEmail->",res);
	return res;
 }

export function getUser(){
	return current_user;
}

export async function refreshUser(){
	const auth = getAuth();
	await auth.currentUser.reload();
	current_user = auth.currentUser;
	return current_user;
}

export async function loginWithGoogle(){
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	let res = await signInWithPopup(auth, provider);
	/*console.log("AUTH ",res);
	if(res){
		const credential = GoogleAuthProvider.credentialFromResult(res);
		const token = credential.accessToken;
		const user = res.user;
		console.log("AUTH OK!")
	}*/
	return res;
}