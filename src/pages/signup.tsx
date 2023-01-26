import { IonContent, IonButton, IonIcon, IonPage, IonTitle, IonTabs, IonTabBar, IonTabButton} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './signup.css';
import { File } from '@ionic-native/file';
import logo from "../PicData/Product-_1_.svg" 
import ReactDOM from 'react-dom/client'
import React from 'react'
import { Redirect, Route, NavLink, useHistory} from "react-router-dom";
const fetch = require("cross-fetch");

const SignupScreen : React.FC = () => {
const history = useHistory();
function switchToLogin()
{
	console.log("switch function called!");
	history.go(-1);
}
	return <IonPage>
		<IonContent fullscreen>
		<div className="space"></div>
		<form id="signup" onSubmit={()=>{setTimeout(switchToLogin,15);}}>
			<div className="container" id="div">
				
				<label>Username : </label>
				<br></br>	 
				<input type="text" className="inputClass2" placeholder="Enter Username" name="name" required></input>
				 <br></br>
				 <label>Email : </label>
				 <br></br>	 
				<input type="email" className="inputClass2" placeholder="Enter Email" name="mail" required></input>
				<br></br>
				 <label>Password : </label>
				 <br></br>	 
				<input type="password" className="inputClass2" placeholder="Enter Password" name="pass" required></input>
				<br></br>
				<br></br>
				<label>account type : </label>
				<br></br>
				<select name="type">
      				<option value="2">parent</option>
      				<option selected value="1">babysitter</option>
    			</select>
				<br></br>
				<button className="submitButton" type="submit">Sign up</button>	 
				<p>already have an account?</p>
				<button className="loginButton" onClick={()=>{switchToLogin();}}>login</button> 
			</div>	 
		</form>

		</IonContent>
	</IonPage>
};


setTimeout(addFormListener, 15);

function addFormListener()
{
	const form = document.getElementById("signup");
	if(form !== null)
		form.addEventListener('submit', handleSignupSubmit);
}


function handleSignupSubmit(event: any)
{
	if(event.submitter.innerHTML !== "Login")
	{
		event.preventDefault();
		const formData = new FormData(event.target);
		let asString = new URLSearchParams(formData as any).toString();
		asString = asString.replace("name=","").replace("&mail=",",").replace("&pass=",",").replace("&type=","").replace("%21","!").replace("%20"," ").replace("%40","@");
		let id = asString[asString.length - 1];
		asString = asString.slice(0,asString.length-1);
		asString = id + "," + asString;
		console.log(asString + " submitted results.");
		fetch("https://" + global.ip + "/CreateUser" + asString);
	}
}

//function handleSubmit(event : any){
//	event.preventDefault();
//	const formData = new FormData(event.target);
//	let asString = new URLSearchParams(formData as any).toString();
//	console.log(asString);
//	asString = asString.replace("&",",").replace("name=","").replace("pass=","").replace("%21","!").replace("%20"," ");
//	if(asString !== "undefined=undefined")
//	{
//		console.log(asString);
//	}
//	fetch("http://" + global.ip + "/CreateUser" + asString).then(
//		function(response:any)
//		{
//			response.text().then(
//				function(responseString: any)
//				{ 
//					if(responseString.includes("Successfully logged in, needed info is ") === true)
//					{
//						global.loggedInEvent = new Event('loggedIn');
//						console.log(responseString);
//						responseString = responseString.replace("Successfully logged in, needed info is ","");
//						let data = responseString.split(",");
//						console.log("session id : " + data[0] + " user id : " + data[1]);
//						global.sessionID = data[0];
//						global.userID = data[1];
//						console.log(typeof global.loggedInEvent);
//						global.dispatchEvent(global.loggedInEvent);
//					}	
//
//				});
//		});
//}



setTimeout(removeBar, 14);
function test()
{
	console.log(global.sessionID +"," + global.userID);
}
function removeBar()
{
	const tabBar = document.getElementById('appTabBar');
	if (tabBar !== null) {
		tabBar.style.display = 'none';
	}
	console.log(tabBar);		
}

export default SignupScreen;