import { IonContent, IonButton, IonIcon, IonPage, IonTitle} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import {chatbubbleEllipses} from 'ionicons/icons'
import './Tab1.css';
import logo from "../PicData/Product-_1_.svg" 
import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import {withRouter} from 'react-router';
import { Redirect, Route, NavLink } from "react-router-dom";
const fetch = require("cross-fetch");

const Tab1: React.FC = () => {
	useEffect(() => {
		setTimeout(getUserHome,15);
	});
	return (
		<IonPage>
		{global.userID == undefined ? <Redirect to="/login" /> : null}
		<IonContent fullscreen>
		<div className='logo' id = "logo"><IonIcon className="CustomIonicIconSize" src={logo} /></div>
		<br></br>
		<br></br>
		<br></br>
		<br></br>
		<br></br>
		<br></br>
		<div className='paddedPage' id="page">
		</div>
		</IonContent>
		</IonPage>
		);
};

global.addEventListener('loggedIn', showBar,false);
async function getUserHome()
{
	if("" + global.userID !== "undefined")
	{
		var url : string = "https://" + global.ip + "/GetUserHome" + global.userID + "," + global.sessionID;
		console.log(url);
		var res = "meow";
		fetch(url).then(
			async function(response:any)
			{
				response.text().then(
					async function(responseString: any)
					{ 
						console.log(responseString);
						var usersData = responseString.split("|||");
						var usrs = [];
						console.log(usersData);
						for(var i = 0; i < usersData.length -1; i++)
						{
							console.log("going over user");
							var usrString = usersData[i];
							var USR = usrString.split(",");
							console.log(USR);
							usrs.push(React.createElement(User, {name:USR[0].toLowerCase(),ranking:USR[1],pfpURL:USR[2],id:USR[3]},null));
						}
						var page = document.getElementById("page");
						if(page != null)
						{
							console.log("rendering users");
							var root = ReactDOM.createRoot(page);
							root.render(usrs);
							console.log("type of usrs is " + typeof usrs)
							global.usrs = usrs;
						}
					}
					);
			}
			);
	}
}


export default Tab1;
function showBar()
{
	const tabBar = document.getElementById('appTabBar');
	if (tabBar !== null) {
		tabBar.style.display = 'flex';
	}
	console.log(tabBar);	
}



function User(data:{name:string,ranking:string,pfpURL:string,id:string})
{
	var Name = "";
	var idName = "user "
	if(data.name.length > 10)
	{
		Name = data.name.slice(0, 10).concat('...');
		Name = Name.toLowerCase();
	}
	else
	{
		Name = data.name.toLowerCase();
	}
	idName += data.name;
	return <IonButton className="UserButton" color='none' onClick={(event) => {OnUserClicked(data.name, data.id); }}>
		<div className = "user" id = {idName}>
			<p className="Username" color="--ion-color-primary-contrast">{Name.toLowerCase()}</p>
			<img draggable="false" className="circle" src={data.pfpURL} width= {70} height={70}></img>
			<div className="star">
				<p>{data.ranking}</p>
				<img src="https://icons.iconarchive.com/icons/google/noto-emoji-travel-places/256/42655-star-icon.png" width= {30} height= {30}></img>
			</div>
		</div>
	</IonButton>
}

function PfPage(data:{name:string,ranking:string,pfpURL:string, rate:number, id:string})
{
	return <div className = "boxTest" id="CloseablePopup">
		<IonButton className="ExitButton" onClick = {()=>{ClosePopup();}}>X</IonButton>
		<img width={70} height={70} src={data.pfpURL}></img>
		<p>{data.name}</p>
		<br></br>
		<br></br>
		<p>rank : {data.ranking}*</p>
		<p>rate : {data.rate}₪</p>
		<IonButton className="boxButton" onClick={()=>{OnMessageButtonClicked(data.id);}}><p>message {data.name}</p></IonButton>
	</div>
}

function ClosePopup()
{
	var element = document.getElementById("page");
	if(element !== undefined && element !== null)
	{
		const root = ReactDOM.createRoot(element);
		var usrs = global.usrs;
		var elements = [usrs];
		root.render(elements);
	}
}

function OnMessageButtonClicked(data:string)
{
	alert("messaging "+data+"...");
	fetch("https://" + global.ip + "/MessageUser" + global.userID + "," + data + "," + "hello from babysittingIL,"+ global.sessionID);
}

function OnUserClicked(data:string, id:string)
{
	//alert("clicked on "+ data);
	var element = document.getElementById("page");
	if(element !== undefined && element !== null)
	{
		var root = ReactDOM.createRoot(element);
		const myElement = <PfPage name={data} ranking="4" pfpURL="https://www.law.berkeley.edu/wp-content/uploads/2015/04/Blank-profile.png" rate={6} id={id}></PfPage>
		var usrs = global.usrs;
		var elements = [usrs, myElement];
		root.render(elements);
	}
}
