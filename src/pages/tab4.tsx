import { IonContent,IonButton, IonDatetime, IonIcon, IonPage, IonTitle, IonFabButton, IonFab} from '@ionic/react';
import React, {useRef, useEffect} from 'react'
//import ExploreContainer from '../components/ExploreContainer';
import './designs/tab4.css';
import {add, send, calendar, chatbubbleEllipses} from 'ionicons/icons';
import ReactDOM from 'react-dom/client'
import image from "../PicData/messageOutlineLeft.svg"
import { Redirect, Route, NavLink } from "react-router-dom";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

const Tab4: React.FC = () => {
	return (
		<IonPage>
			{global.userID == undefined ? <Redirect to="/login" /> : null}
			<IonContent fullscreen>
				<div className="Center">
				</div>
				<center><div id="messagePageHolder"></div></center>
				<div className='paddedPage' id="eventPage"></div>
			</IonContent>
			<IonFab vertical="bottom" horizontal="end">
		</IonFab> 
		</IonPage>
		);
};

var lastElements:any[] = [];
getEvents();

function sleep(ms:number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function sortByDueDate(arr:any[]): void {
	arr.sort((a: any, b: any) => {
		return new Date(a.props.startDate).getTime() - new Date(b.props.startDate).getTime();

	});
}

async function getEvents()
{
	while(true)
	{
		createEventPage()
		await sleep(6000)
	}
}

async function createEventPage()
{
	let elements:any[] = []
	await fetch("https://" + global.ip + "/GetEvents" + global.userID, {method: 'GET',headers: {"ngrok-skip-browser-warning": "69420",},}).then(function(response:any) {
	response.text().then(async function(responseString: any) 
	{
		let dates = responseString.split("||");
		for(let i = 0; i < dates.length; i++)
		{
			let responseElements = dates[i].split("--");
			console.log(responseElements);
			elements[i] = createEventObject(responseElements[0], +(responseElements[1]), responseElements[3], responseElements[2], responseElements[4], i);
			console.log(elements[i]);
		}
	})});
	sortByDueDate(elements);
	await sleep(200); 
	let rootElement = document.getElementById("eventPage");
	if(rootElement !== null && JSON.stringify(elements) != JSON.stringify(lastElements))
	{
		let root = ReactDOM.createRoot(rootElement);
		sortByDueDate(elements);
		root.render(elements);
		lastElements = elements;
		console.log("updated events because there was a change");
	}
}

function createEventObject(startDate:string, eventLength:number, username:string, pfpURL:string, userID: number, eventID: number)
{
	if(startDate !== undefined && startDate)
		return React.createElement(EventObject, {startDate:startDate.replace(" ", "+"), eventLength:eventLength, pfpURL:pfpURL, username:username, userID: userID, eventID: eventID}, null); 
	else
		return null
}

function EventObject(data:{startDate:string, eventLength:number, pfpURL:string, username:string, userID: number, eventID: number})
{
	let dateObject = new Date(data.startDate);
	let dateBackup = new Date(dateObject);
	let DBStr = dateBackup.toString().substring(0, dateBackup.toString().indexOf("GMT")).substring(0, dateBackup.toString().indexOf("GMT") - 9);
	dateObject.setHours(dateObject.getHours() + data.eventLength, dateObject.getMinutes() + ((data.eventLength % 1) * 60));
	console.log(data.userID);
	return <button className = "EventButton" onClick = {()=>{addMessageButtonToDiv(data.userID, data.eventID)}}><div className="infoWrapper"><img width={32} height={32} src = {data.pfpURL}></img> <p>{data.username}</p></div>
	<div className="timeClass"><p> From : <br></br>{DBStr}<br></br>{dateBackup.toString().substring(dateBackup.toString().indexOf("GMT") - 9, dateBackup.toString().indexOf("GMT"))}</p><p>Until : <br></br>{dateObject.toString().substring(0, dateObject.toString().indexOf("GMT") - 9)}<br></br>{dateObject.toString().substring(dateObject.toString().indexOf("GMT") - 9, dateObject.toString().indexOf("GMT"))}</p></div><div className="divHolderForMessageButton glass" id={"divHolderForMessageButton" + data.eventID}></div></button>
}

function addMessageButtonToDiv(userID:number, eventID: number)
{
	console.log(userID);
	var root = document.getElementById("divHolderForMessageButton" + eventID);
	if(root !== undefined && root !== null)
	{
		let newRoot = ReactDOM.createRoot(root);
		let element = React.createElement(messageButton, {userID}, null);
		newRoot.render(element)
	}
}

function messagePage(data:{targetID:number})
{
	console.log(data.targetID);
	function SendMessage(targetId: number, message: string)
	{
		console.log(targetId);
		fetch("https://" + global.ip + "/MessageUser" + global.userID + "," + (+targetId) + "," + message + "," + global.sessionID, {method: 'GET',headers: {"ngrok-skip-browser-warning": "69420",},});
		
		let root = document.getElementById("messagePageHolder");

		if(root && root !== undefined)
		{
			let rootElement = ReactDOM.createRoot(root);
			rootElement.render(null);
		}
	}
	return <div className = "messagePageClass"><input id="myInputForMessageSendingInTab4" className="messageElementItem" placeholder="please enter your message : "></input><IonButton className="messageElementItem2" onClick={()=>{let msgdata = extractMessage(); msgdata !== "error with sending message." ? SendMessage(data.targetID, msgdata) : console.log("error with sending message")}}><IonIcon icon = {send}></IonIcon></IonButton></div>
}

function extractMessage()
{
	let myInput = document.getElementById("myInputForMessageSendingInTab4") as HTMLInputElement;
	console.log(myInput)
	let data:string;
	if(myInput !== null && myInput !== undefined)
	{
		data = myInput.value;
		console.error("data : " + data);
		
		myInput.value = "";
		return data;
	}
	return "error with sending message.";
}

function messageButton(data:{userID:number})
{
	console.log(data.userID);
	return <IonButton onClick={()=>{let root = document.getElementById("messagePageHolder"); if(root && root !== undefined){let rootElement = ReactDOM.createRoot(root); rootElement.render(React.createElement(messagePage, {targetID:data.userID}, null))}}}><IonIcon icon={chatbubbleEllipses}></IonIcon></IonButton>
}


export default Tab4