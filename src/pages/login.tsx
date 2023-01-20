import { IonContent, IonButton, IonIcon, IonPage, IonTitle, IonTabs, IonTabBar, IonTabButton} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './login.css';
import { File } from '@ionic-native/file';
import logo from "../PicData/Product-_1_.svg" 
import ReactDOM from 'react-dom/client'
import React, {useEffect} from 'react'
import { Redirect, Route, NavLink, useHistory} from "react-router-dom";
const fetch = require("cross-fetch");

const LoginScreen : React.FC = () => {
const history = useHistory();
	useEffect(() => {
			console.log("hello, welcome to login page.");
		});
function AttemptSwitch()
{
	if(global.userID !== undefined && global.sessionID !== undefined)
	{
		console.log("finished login, redirecting to home");
		history.push('/home');
	}
}

function switchToSignup()
{
	history.push('/signup');
}
	return <IonPage>
		<IonContent fullscreen>
		<div className="space"></div>
		<form id="login">
			<div className="container" id="div">
				<label>Username : </label>
				<br></br>	 
				<input type="text" className="inputClass" placeholder="Enter Username" name="name" required></input>
				 <br></br>
				 <label>Password : </label>
				 <br></br>	 
				<input type="password" className="inputClass" placeholder="Enter Password" name="pass" required></input>
				<br></br>

				<button className="submitButton" type="submit" onClick={()=>{setTimeout(AttemptSwitch, 30)}}>Login</button>	 
				<p>or</p>
				<button className="signupButton" onClick={()=>{switchToSignup();}}>create an account</button> 
			</div>	 
		</form>

		</IonContent>
	</IonPage>
};


setTimeout(addFormListener, 15);

function addFormListener()
{
	const form = document.getElementById("login");
	if(form !== null)
		form.addEventListener('submit', handleSubmit);
}


function handleSubmit(event : any){
	if(event.submitter.innerHTML === "Login")
	{	
		event.preventDefault();
		const formData = new FormData(event.target);
		let asString = new URLSearchParams(formData as any).toString();
		console.log(asString);
		asString = asString.replace("&",",").replace("name=","").replace("pass=","").replace("%21","!").replace("%20"," ");
		if(asString !== "undefined=undefined")
		{
			console.log(asString);
		}
		fetch("https://192.168.68.107/login" + asString).then(
			function(response:any)
			{
				response.text().then(
					function(responseString: any)
					{ 
						console.log(responseString);
						if(responseString.includes("logged in, needed info is ") === true)
						{
							console.log("logged in");
							global.loggedInEvent = new Event('loggedIn');
							console.log(responseString);
							responseString = responseString.replace("logged in, needed info is ","");
							let data = responseString.split(",");
							console.log("session id : " + data[0] + " user id : " + data[1]);
							global.sessionID = data[0];
							global.userID = data[1];
							console.log("session id : " + global.sessionID + " user id : " + global.userID);
							console.log(typeof global.loggedInEvent);
							global.dispatchEvent(global.loggedInEvent);
						}	

					}	
				);
			}
		);
	}
}



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

export default LoginScreen;