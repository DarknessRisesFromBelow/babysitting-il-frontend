import { IonContent, IonButton, IonIcon, IonPage, IonTitle, IonTabs, IonTabBar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './designs/login.css';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import logo from "../PicData/Product-_1_.svg" 
import ReactDOM from 'react-dom/client'
import React, {useEffect} from 'react'
import { Redirect, Route, NavLink, useHistory} from "react-router-dom";
import { personCircle,chatbubbleEllipses, home } from 'ionicons/icons';
import { IonApp, IonLabel, IonToast, IonRouterOutlet, IonTabButton, setupIonicReact } from '@ionic/react';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Capacitor } from "@capacitor/core";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import OneSignal from 'onesignal-cordova-plugin';
const fetch = require("cross-fetch");

//const secondButton = <IonTabButton tab="tab2" href="/messages">
//			<IonIcon icon={chatbubbleEllipses} />
//			<IonLabel>Messages</IonLabel>
//			</IonTabButton>
//
//const thirdButton	= <IonTabButton tab="tab3" href="/profile">
//			<IonIcon icon={personCircle} />
//			<IonLabel>Profile</IonLabel>
//			</IonTabButton>
//
//
//const firstButton = <IonTabButton tab="tab1" href="/home" >
//			<IonIcon icon={home}/>
//			<IonLabel>Home</IonLabel>
//			</IonTabButton>
//
//
//const babysitterTabs = [secondButton, thirdButton]
//const parentTabs = [firstButton, secondButton, thirdButton]

global.ip = "arriving-strictly-halibut.ngrok-free.app";
global.loggedInEvent = new Event('loggedIn');
global.succesfullyRegisteredEvent = new Event("succesfullyRegisteredEvent");
global.UnsuccesfullyRegisteredEvent = new Event("UnsuccesfullyRegisteredEvent");

// not how you write successfully but I do not care. 
global.UnseccesfullyLoggedInEvent = new Event("UnseccesfullyLoggedInEvent");
global.recivedMessageEvent = new Event("recivedMessageEvent");

global.googlePayPaymentAccepted = new Event("googlePayPaymentAccepted");



const LoginScreen : React.FC = () => {
	const history = useHistory();
	useEffect(() => {

		try
		{
			Filesystem.readFile({path: "data/account/login/" + 'login.dat', directory: Directory.Library, encoding: Encoding.UTF8, }).then(text=>
			{
				console.log("read text. content was");
				console.log(text.data);
				let elements = text.data.split("|||")
				global.userID = elements[0];
				global.sessionID =elements[1];
				global.userType = +elements[2];
				AttemptSwitch();
			});
		}
		catch
		{
			console.log("user has no login info saved, showing login screen.");
		}

		console.log("hello, welcome to login page.");
//			Geolocation.requestPermissions();
		ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT);
	});
	function AttemptSwitch()
	{
		if(global.userID !== undefined && global.sessionID !== undefined)
		{

			try
			{
				OneSignal.setExternalUserId(global.userID);
				console.log("successfully set external user id to " + global.userID);
			}
			catch(e)
			{
				console.log("error occured while setting userID");
				console.log(e);
			}
			var stringToWrite = '' + global.userID + '|||' + global.sessionID + '|||' + global.userType;
			Filesystem.writeFile({path: 'data/account/login/login.dat', data: stringToWrite, directory: Directory.Library, encoding: Encoding.UTF8, recursive: true});
			console.log("finished login, redirecting to home");

			if(global.userType == 0)
			{
				const tabBar = document.getElementById('tab-button-tab3');
				if (tabBar !== null) 
				{
					tabBar.hidden = true;
					console.log("parent logged in.");
				}
			}
			else
			{
				const tabBar = document.getElementById('tab-button-tab1');
				if (tabBar !== null) 
				{
					tabBar.hidden = true;
					console.log("babysitter logged in.");
				}
			}
			global.dispatchEvent(global.loggedInEvent);
			const position = Geolocation.getCurrentPosition();
			position.then(function(response:any){fetch("https://" + global.ip + "/setGeolocation" + global.userID + "," + response.coords.latitude + "," + response.coords.longitude + "," + global.sessionID, {method: 'GET',headers: {"ngrok-skip-browser-warning": "69420",},});})
			if(global.userType == 0)
				history.push('/home');
			else
				history.push('/profile');
		}
	}

	function switchToSignup()
	{
		history.push('/signup');
	}
	return <IonPage>
	<IonContent fullscreen>
	<div className="space"></div>
	<form action="javascript:void(0);" id="login">
	<div className="container" id="div">
	<label>Username : </label>
	<br></br>	 
	<input pattern="[^,;]+" type="text" className="inputClass" placeholder="Enter Username" name="name" required></input>
	<br></br>
	<label>Password : </label>
	<br></br>	 
	<input type="password" className="inputClass" placeholder="Enter Password" name="pass" required></input>
	<br></br>

	<button className="submitButton" type="submit" onClick={()=>{global.addEventListener('recivedMessageEvent', AttemptSwitch)}}>Login</button>	 
	<p>or</p>
	<button className="signupButton" onClick={()=>{switchToSignup();}}>create an account</button> 
	</div>	 
	</form>
	<div id="toastArea"></div>
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


global.addEventListener("UnseccesfullyLoggedInEvent", showUnsuccessLoginToast);
function showUnsuccessLoginToast()
{
	//alert("could not log in, either username or password are incorrect.");
	var alert = document.getElementById("toastArea");
	if(alert !== null && alert !== undefined)
	{
		var newElement = <IonToast id="failToast" header="ERROR" isOpen={true} color="danger" message="could not log in, either username or password are incorrect." duration={1000}></IonToast>
		var root = ReactDOM.createRoot(alert);
		root.render(newElement);
	}
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
		fetch("https://" + global.ip + "/login" + asString, {method: 'GET',headers: {"ngrok-skip-browser-warning": "69420", },}).then(
			function(response:any)
			{
				response.text().then(
					function(responseString: any)
					{ 
						console.log(responseString);
						if(responseString.includes("logged in, needed info is ") === true)
						{
							console.log("logged in");
							const position = Geolocation.getCurrentPosition();
							position.then(function(response:any){fetch("https://" + global.ip + "/setGeolocation" + data[1] + "," + response.coords.latitude + "," + response.coords.longitude + "," + data[0], {method: 'GET',headers: {"ngrok-skip-browser-warning": "69420",},});})
							global.loggedInEvent = new Event('loggedIn');
							console.log(responseString);
							responseString = responseString.replace("logged in, needed info is ","");
							let data = responseString.split(",");
							console.log("session id : " + data[0] + " user id : " + data[1]);
							global.sessionID = data[0];
							global.userID = data[1];
							global.userType = data[data.length - 1];
							global.dispatchEvent(global.recivedMessageEvent);
							console.log("session id : " + global.sessionID + " user id : " + global.userID);
							console.log(typeof global.loggedInEvent);
							global.dispatchEvent(global.loggedInEvent);
						}
						else
						{
							global.dispatchEvent(global.recivedMessageEvent);
							global.dispatchEvent(global.UnseccesfullyLoggedInEvent);
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