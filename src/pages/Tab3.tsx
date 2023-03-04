import { IonContent,IonButton, IonIcon, IonPage, IonTitle, IonFabButton, IonFab} from '@ionic/react';
import './Tab3.css';
import { Redirect, Route, NavLink } from "react-router-dom";
import {chatbubbleEllipses, pencil} from 'ionicons/icons'
import logo from "../PicData/Product-_1_.svg" 
import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import {withRouter} from 'react-router';
const Tab3: React.FC = () => {
	useEffect(() => {
			setTimeout(getUserInfo,15);
		});
	return (
	<IonPage>
	{global.userID == undefined ? <Redirect to="/login" /> : null}
		<IonContent fullscreen>
		<div className="editProfileButton"><IonButton onClick={()=>{editProfilePage()}}><IonIcon icon={pencil}></IonIcon></IonButton></div>
		<div id="pfpPage"></div>
		</IonContent>
	</IonPage>
	);
};

async function getUserInfo()
{
	if("" + global.userID !== "undefined")
	{
		var url : string = "https://" + global.ip + "/GetUserData" + global.userID;
		console.log(url);
		var res = "meow";
			fetch(url).then(
			function(response:any)
			{
					response.text().then(
					function(responseString: any)
					{ 
							console.log(responseString);
							responseString = responseString.replace("Got User Info. <br>", "");
							var usersData = responseString.split(",");
							var usrs = [];
							console.log(usersData);
							usrs.push(React.createElement(UserProfile, {name:usersData[0].toLowerCase(),bio:usersData[3],pfpURL:usersData[2], stars:usersData[1], rate: usersData[4]},null));
							var page = document.getElementById("pfpPage");
							if(page != null)
							{
							console.log("rendering users");
							var root = ReactDOM.createRoot(page);
							root.render(usrs);
							}
					}
				);
				}
			);
	}
}

function UserProfile(data:{name:string,bio:string,pfpURL:string,stars:number,rate:number})
{
	var Name = "";
	if(data.name.length > 10)
	{
		Name = data.name.slice(0, 10).concat('...');
		Name = Name.toLowerCase();
	}
	else
	{
		Name = data.name.toLowerCase();
	}
	return (
	<div >
		<img className="image" src = {data.pfpURL} draggable="false"></img>
		<p className="username">{Name}</p>
		<div className="otherInfo">
			<p>bio:</p>
			<p className="bio">{data.bio}</p>
			<br></br>
			<p>rate : {data.rate}₪</p>
			<p>rating : {data.stars} *</p>
		</div>
	</div>
	);
}

function editProfilePage()
{
	// TODO:  do everything, not only comments of it
	alert("started editing the profile");
	alert("opened profile page editing page");
	alert("button to close editing clicked, closing editing tab and starting data sending");
	alert("sent data and finished editing process.");
}

function sendData(data:{userPFP:string, userRate:string, bio:string})
{
	var url : string = "https://" + global.ip + "/setPfp" + data.userPFP;
	fetch(url);
	url = "https://" + global.ip + "/setRate" + data.userRate;
	fetch(url);
	url = "https://" + global.ip + "/setBio" + data.bio;
	fetch(url);
}

export default Tab3;
