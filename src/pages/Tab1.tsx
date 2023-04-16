import { IonContent, IonButton, IonIcon, IonPage, IonTitle} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import {chatbubbleEllipses, chatbox, calendar, exit, send} from 'ionicons/icons'
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
							usrs.push(React.createElement(User, {name:USR[0].toLowerCase(),ranking:USR[1],pfpURL:USR[2],id:USR[USR.length-1]},null));
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

function createCommentPage(id:string, userdata:any)
{
	var url = "https://" + global.ip + "/GetUserData" + id;
	fetch(url).then(function(response:any){response.text().then(function(responseString:any)
	{
		responseString = responseString.replace("Got User Info. <br>", "")
		var element = document.getElementById("CloseablePopup");
		if(element !== undefined && element !== null)
		{
			var responseData = responseString.split(',');
			console.log(responseData[0]);
			var root = ReactDOM.createRoot(element);
			var newlyCreatedElement = React.createElement(CommentPage, {username:responseData[0], userid: id , userdata}, null);
			root.render(newlyCreatedElement);
		}
	})});
	url = "https://" + global.ip + "/getComments" + id;
	fetch(url).then(function(response:any){response.text().then(function(responseString:any)
	{
		console.log("response string : " + responseString);
		responseString = responseString.replace("---REVIEWS-START---", "").replace("---REVIEWS-END---", "").replace("\n", "");
		console.log("fixed response string : " + responseString);
		var comments = responseString.split("|||");
		var commentElements = []
		for(var i = 0; i < comments.length; i++)
		{
			if(comments[i]!= "")
			{
				var commentData = comments[i].split(",");
				if(commentData.length !== 5)
				{
					var text = "";
					for(var o = 4; o < commentData.length; o++)
					{
						text += commentData[o];
						if(o != commentData.length - 1)
						{
							text += ",";
						}
					}
					var newElement = React.createElement(Comment, {fromUsername: commentData[1], rating: commentData[3], text: text}, null);	
					commentElements.push(newElement);
				}
				else
				{
					var commentData = comments[i].split(",");
					var newElement = React.createElement(Comment, {fromUsername: commentData[1], rating: commentData[3], text: commentData[4]}, null);	
					commentElements.push(newElement);
				}
			}
		}
		var element = document.getElementById("CommentPage");
		if(element !== null && element !== undefined)
		{
			var root = ReactDOM.createRoot(element);
			root.render(commentElements);
		}
	})});
	
}

function closeCommentPage(userdata:any)
{
	var element = document.getElementById("CloseablePopup");
	if(element !== undefined && element !== null)
	{
		var root = ReactDOM.createRoot(element)
		//var newlyCreatedElement = React.createElement(CommentPage, {username:"thisisthelongestusernameIcanthinkofrightnow"}, null);
		root.render(userdata);
	}
}

function Comment(data:{fromUsername:string, rating:string, text:string})
{
	return <div className="commentBox">
		<div className="commentHeader">
			<h4>{data.fromUsername}</h4>
			<p>{data.rating} כוכבים</p>
		</div>
		<div className="commentContent"><p>{data.text}</p></div>
	</div>
}

function CommentPage(data:{username:string, userid:string, userdata:any})
{
	var Name = "";
	if(data.username.length > 11)
	{
		Name = data.username.slice(0, 11).concat('...');
		Name = Name.toLowerCase();
	}
	else
	{
		Name = data.username.toLowerCase();
	}
	return <div id="commentWrapper" className="CommentPageWrapper"> 
			<div id="CommentPageHeader" className="CommentPageHeader">
				<h3>{Name}</h3>
				<IonButton className="CommentPageExitButton" onClick = {()=>{closeCommentPage(data.userdata);}}>
					<IonIcon icon={exit}/>
				</IonButton>
			</div>
			<hr></hr>
			<div className = "DivWithBlackBackground" id="CommentPage">
			</div>
			<div className="inputCommentPageDiv">
				<input id="commentTextInput" autoComplete="off" className="commentTextInput" placeholder="comment: "></input>
				<IonButton onClick={()=>{let element =(document.getElementById("commentTextInput") as HTMLInputElement); if(element !== null && element !== undefined){OnSendReviewButtonClicked(data.userid, element.value, data.userdata);}}}><IonIcon icon={send}/></IonButton>
			</div>
		</div>
}

function closeRBPage()
{
	var roor = document.getElementById("DivHolder");
	if(roor !== undefined && roor !== null)
	{
		var root = ReactDOM.createRoot(roor);
		root.render(null);
	}
}

function reserveBabysitterPage(data:{id:string, rate:number})
{
	return <div className="RBPage">
		<IonButton className="RBPageExitButton" onClick = {()=>{closeRBPage();}}>
			<IonIcon icon={exit}/>
		</IonButton>
		<p>id: {data.id}</p>
		<br/>
		<p> rate : {data.rate}₪</p>
		<IonButton className="RBPageButton" onClick={()=>{fetch("https://" + global.ip + "/PayUser" + global.userID + "," + data.id + "," + "1" + "," + global.sessionID);}}><p>pay {data.rate} ₪</p></IonButton>		
	</div>
}

function PfPage(data:{name:string,ranking:string,pfpURL:string, rate:number, id:string})
{
	var userdata:any = 	<div><div id="DivHolder"></div><IonButton className="ExitButton" onClick = {()=>{ClosePopup();}}><IonIcon icon={exit}/></IonButton>
	<IonButton className="CommentPageButton" onClick = {()=>{createCommentPage(data.id, userdata);}}><IonIcon icon={chatbubbleEllipses} ></IonIcon></IonButton>
	<img width={70} height={70} src={data.pfpURL} className = "circleForPFP"></img>
	<p>{data.name}</p>
	<br></br>
	<br></br>
	<p>rank : {data.ranking}*</p>
	<p>rate : {data.rate}₪</p>
	<div className="interactibleRow">
		<IonButton className="boxButton" onClick={()=>{OnReserveButtonClicked(data.id, data.rate);}}><IonIcon icon={calendar} size="large" /></IonButton>
		<IonButton className="secondBoxButton" onClick={()=>{OnMessageButtonClicked(data.id);}}><IonIcon icon={chatbox} size="large" /></IonButton>
	</div>
	</div>

	return <div className = "boxTest" id="CloseablePopup">
	<div id="DivHolder"></div>
	<IonButton className="ExitButton" onClick = {()=>{ClosePopup();}}><IonIcon icon={exit} /></IonButton>
	<IonButton className="CommentPageButton" onClick = {()=>{createCommentPage(data.id, userdata);}}><IonIcon icon={chatbubbleEllipses}></IonIcon></IonButton>
	<img width={70} height={70} src={data.pfpURL} className = "circleForPFP"></img>
	<p>{data.name}</p>
	<br></br>
	<br></br>
	<p>rank : {data.ranking}*</p>
	<p>rate : {data.rate}₪</p>
	<div className="interactibleRow">
		<IonButton className="boxButton" onClick={()=>{OnReserveButtonClicked(data.id, data.rate);}}><IonIcon icon={calendar} size="large" /></IonButton>
		<IonButton className="secondBoxButton" onClick={()=>{OnMessageButtonClicked(data.id);}}><IonIcon icon={chatbox} size="large" /></IonButton>
	</div>
	</div>
}

function OnReserveButtonClicked(id:string, rate:number)
{
	var roor = document.getElementById("DivHolder");
	if(roor !== undefined && roor !== null)
	{
		var element = React.createElement(reserveBabysitterPage, {id, rate}, null);
		var root = ReactDOM.createRoot(roor);
		root.render(element);
	}
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


function OnSendReviewButtonClicked(data:string, message:string, userdata:any)
{
	if(message !== "")
	{
		fetch("https://" + global.ip + "/AddReview"  + (+data) + "," + global.userID + "," + message + "," + 5);
		let element = (document.getElementById("commentTextInput") as HTMLInputElement);
		if(element !== null && element !== undefined)
			element.value = "";
	}
	createCommentPage(data, userdata);
}

function OnMessageButtonClicked(data:string)
{
	fetch("https://" + global.ip + "/MessageUser" + global.userID + "," + data + "," + "hello from babysittingIL,"+ global.sessionID);
}



function OnUserClicked(data:string, id:string)
{
	//alert("clicked on "+ data);
	var url : string = "https://" + global.ip + "/GetUserData" + id;
	fetch(url).then(
		async function(response:any)
		{
			response.text().then(
				async function(responseString: any)
				{ 
					console.log(responseString);
					var usersData = responseString.split(",");
					var element = document.getElementById("page");
					if(element !== undefined && element !== null)
					{
						var root = ReactDOM.createRoot(element);
						const myElement = <PfPage name={data} ranking={usersData[1]} pfpURL={usersData[2]} rate={usersData[usersData.length - 2]} id={id}></PfPage>
						var usrs = global.usrs;
						var elements = [usrs, myElement];
						root.render(elements);
					}
				}
			)
		}
	);
}

