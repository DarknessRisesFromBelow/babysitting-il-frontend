import { IonContent,IonButton, IonIcon, IonPage, IonTitle, IonFabButton, IonFab} from '@ionic/react';
import './Tab3.css';
import { Redirect, Route, NavLink } from "react-router-dom";
import {chatbubbleEllipses, pencil} from 'ionicons/icons'
import logo from "../PicData/Product-_1_.svg" 
import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import {withRouter} from 'react-router';
import './collapsableInputs.css'
const Tab3: React.FC = () => {
	useEffect(() => {
			setTimeout(getUserInfo,15);
		});
	return (
	<IonPage>
	{global.userID == undefined ? <Redirect to="/login" /> : null}
		<IonContent fullscreen>
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
							var bio = "";
							bio += usersData[3];
							for(var i = 4; i < usersData.length - 2; i++)
							{
								if(usersData.length >= 6)
								{
									bio += "," + usersData[i];
								}
							}
							usrs.push(React.createElement(UserProfile, {id:global.userID, name:usersData[0].toLowerCase(),bio:bio,pfpURL:usersData[2], stars:usersData[1], rate: usersData[usersData.length - 2]},null));
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

function UserProfile(data:{id:string,name:string,bio:string,pfpURL:string,stars:number,rate:number})
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
	<div>
	<div className="editProfileButton"><IonButton onClick={()=>{editProfilePage(data.rate, data.pfpURL, data.bio)}}><IonIcon icon={pencil}></IonIcon></IonButton></div>
	<div id="DivHolderThirdPage"></div>
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

function editProfilePage(currentPrice:number, currentPFPUrl:string, currentBio:string)
{
	// TODO:  do everything, not only comments of it
	// DONE
	var holder = document.getElementById("DivHolderThirdPage");
	if(holder !== null && holder !== undefined)
	{
		var root = ReactDOM.createRoot(holder);
		var element = React.createElement(infoEditingPage, {currentPrice,currentPFPUrl,currentBio}, null);
		root.render(element);
	}
	//alert("started editing the profile");
	//alert("opened profile page editing page");
	//alert("button to close editing clicked, closing editing tab and starting data sending");
	//alert("sent data and finished editing process.");
}

function infoEditingPage(data:{currentPrice:number, currentPFPUrl:string, currentBio:string})
{
	return <div className="infoEditingPage">
		<IonButton className="page3EditExitButton" onClick={()=>{finishEditing()}}><p>X</p></IonButton>
		<img id="pfpPreviewImg" className = "image" src={data.currentPFPUrl}></img>
		<div className = "otherInfo2">
		<p>profile picture URL : </p>
		<input className = "pfpInput" autoComplete="off" id="newPFPInput" onChange = {() =>{var img = document.getElementById("pfpPreviewImg") as HTMLImageElement; var input = document.getElementById("newPFPInput") as HTMLInputElement; img.src = input.value;}} defaultValue={data.currentPFPUrl}></input>
		<br></br>
		<br></br>
		<p>rate : </p>
		<input autoComplete="off" id="newRateInput" className="rateInput" defaultValue={data.currentPrice}></input>
		<p>we take 1.3$ and 2.9% of each TRANSACTION</p>
		<br></br>
		<p>biography : </p>
		<textarea autoComplete="off" id="newBioInput" defaultValue={data.currentBio}></textarea>
		</div>
		<div className="wrap-collabsible">
  			<input id="collapsible" hidden className="toggle" type="checkbox"/>
  			<label htmlFor="collapsible" className="lbl-toggle">More Info</label>
  			<div className="collapsible-content">
    			<div className="content-inner">
      				<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor sit amet quam id sodales. Quisque feugiat tortor aliquam erat bibendum, eget faucibus ligula pharetra. Mauris quis dui et nunc ultricies consequat at at mauris. Nunc interdum, elit quis varius vestibulum, turpis nulla maximus velit, vel suscipit nulla nibh sed justo. Nulla placerat consectetur lacus, a vulputate odio imperdiet vitae. Donec ex ex, aliquet a felis eu, fringilla tristique orci. Ut hendrerit bibendum nisi vitae consectetur. Nulla at nulla leo. Pellentesque sed est posuere, ultricies neque at, suscipit dolor. Maecenas pharetra, neque eu suscipit ornare, est dolor finibus augue, eget viverra nisi ante at tortor. Donec suscipit ligula diam, et convallis augue elementum et. Fusce nec augue urna. Cras ultrices diam sit amet dui scelerisque posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam nibh dui, faucibus non ligula id, facilisis rhoncus ante.

						Vivamus tristique mauris eget sapien posuere vehicula. Vivamus pulvinar velit eu vehicula volutpat. Morbi in ipsum quam. Suspendisse blandit lacus nisi, id porttitor sapien fringilla vitae. Vestibulum urna risus, facilisis vitae vulputate eu, ornare non massa. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus sagittis, lacus a placerat mattis, enim nunc scelerisque ligula, sed vestibulum ipsum felis vitae metus. Mauris consequat scelerisque massa id maximus. Donec at nunc nec sapien aliquet iaculis eget sed sapien. Duis et lorem sit amet augue malesuada iaculis. Vestibulum in mauris non nibh tempor bibendum. Mauris non mauris elit. Nullam vitae ullamcorper lectus. Nunc commodo felis purus, eu tempor enim vestibulum a. Ut pellentesque consectetur dui quis euismod. Etiam ultrices mauris tristique, vehicula ante vel, vehicula nisl.
      				</p>
    			</div>
  			</div>
  			<br></br><br></br><p className="ender">.</p>
		</div>
	</div>
}

function finishEditing()
{
	var price = "0";
	var pfpURL = "";
	var bioString = "";
	let element = (document.getElementById("newRateInput") as HTMLInputElement);
	if(element !== null && element !== undefined)
	{
		price = element.value;
		element.value = "";
	}
	element = (document.getElementById("newPFPInput") as HTMLInputElement);
	if(element !== null && element !== undefined)
	{
		pfpURL = element.value;
		element.value = "";
	}
	element = (document.getElementById("newBioInput") as HTMLInputElement);
	if(element !== null && element !== undefined)
	{
		bioString = element.value;
		element.value = "";
	}
	var holder = document.getElementById("DivHolderThirdPage");
	if(holder !== null && holder !== undefined)
	{
		var root = ReactDOM.createRoot(holder);
		root.render(null);
	}
	sendData(pfpURL, price, bioString);
}

//https://cdna.artstation.com/p/assets/images/images/047/678/356/large/m-anne-bailey-new-pfpo.jpg

function sendData(userPFP:string, userRate:string, bio:string)
{
	var url : string = "https://" + global.ip + "/setPfp" + global.userID + "," + userPFP;
	fetch(url);
	url = "https://" + global.ip + "/setRate" + global.userID + "," + userRate;
	fetch(url);
	url = "https://" + global.ip + "/setBio"+ global.userID + "," + bio;
	fetch(url);
	getUserInfo();
}

export default Tab3;
