//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////TODO URGENTLY//////////////////////////////////////
///////////////////////////////////TODO URGENTLY//////////////////////////////////////
///////////////////////////////////TODO URGENTLY//////////////////////////////////////
///////////////////////////////////TODO URGENTLY//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////REDO LOGIC///////////////////////////////////////
///////////////////////////////////AND ONLY SWITCH////////////////////////////////////
////////////////////////////////////////PAGE//////////////////////////////////////////
//////////////////////////////////AFTER SIGNUP DONE///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////DONE//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
import { IonContent, IonButton, IonToast, IonIcon, IonPage, IonTitle, IonTabs, IonTabBar, IonTabButton} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './designs/signup.css';
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
	history.push("/login");
}

	return <IonPage>
		<IonContent fullscreen>
		<div className="space"></div>
		<form id="signup" action="javascript:void(0);" onSubmit={(e)=>{global.addEventListener("succesfullyRegisteredEvent", switchToLogin); handleSignupSubmit(e); console.log("added the event listener");}}>
			<div className="container" id="div">
				
				<label>Username : </label>
				<br></br>	 
				<input type="text" pattern="[^,;]+" className="inputClass2" placeholder="Enter Username" name="name" required></input>
				 <br></br>
				 <label>Email : </label>
				 <br></br>	 
				<input type="email" className="inputClass2" placeholder="Enter Email" name="mail" required></input>
				<br></br>
				 <label>Password : </label>
				 <br></br>	 
				<input type="password" title="lowercase uppercase special character minimum 8 characters" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" className="inputClass2" placeholder="Enter Password" name="pass" required></input>
				<br></br>
				<br></br>
				<label>account type : </label>
				<br></br>
				<select name="type" onChange={()=>{selectChanged()}}>
					<option value="2">parent</option>
					<option value="1">babysitter</option>
					<option selected hidden> select a value </option>
				</select>
				<br></br>
				<button className="submitButton" type="submit" id="submitButtonSignupPage" disabled>Sign up</button>	 
				<p>already have an account?</p>
				<button className="loginButton" onClick={()=>{switchToLogin();}}>login</button> 
			</div>	 
		</form>
		<div id="toastArea"></div>
		</IonContent>
	</IonPage>
};

function selectChanged()
{
	addFormListener();
	var element = document.getElementById("submitButtonSignupPage") as HTMLButtonElement;
	if(element)
	{
		element.disabled = false;
	}
}


function addFormListener()
{
	const form = document.getElementById("signup");
	if(form !== null)
		form.addEventListener('submit', handleSignupSubmit);
}

global.addEventListener("UnsuccesfullyRegisteredEvent", showUnsuccessToast);

function showUnsuccessToast()
{
	var alert = document.getElementById("toastArea");
	if(alert !== null && alert !== undefined)
	{
		var newElement = <IonToast id="failToast" header="ERROR" isOpen={true} color="danger" message="could not sign up, email is probably already associated with a YMA account." duration={1000}></IonToast>
		var root = ReactDOM.createRoot(alert);
		root.render(newElement);
	}
}

function handleSignupSubmit(event: any)
{
	console.log(event.submitter.innerHTML);
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
		fetch("https://" + global.ip + "/CreateUser" + asString, {method: 'GET',headers: {"ngrok-skip-browser-warning": "69420",},}).then(function(response:any){response.text().then(function(responseString:any)
			{
				if(responseString === "Created User ")
				{
					console.log("dispatched the successful register event");
					console.log(global.succesfullyRegisteredEvent);
					global.dispatchEvent(global.succesfullyRegisteredEvent);
				}
				else
				{
					console.log("dispatched the unsuccessful register event");
					global.dispatchEvent(global.UnsuccesfullyRegisteredEvent);				
				}
			}
		)});
	}
	else
	{
		console.log("logged in?");
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