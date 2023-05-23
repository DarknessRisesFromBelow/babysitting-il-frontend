import { IonContent,IonButton, IonDatetime, IonIcon, IonPage, IonTitle, IonFabButton, IonFab} from '@ionic/react';
import React, {useRef, useEffect} from 'react'
//import ExploreContainer from '../components/ExploreContainer';
import './tab4.css';
import {add, send, calendar} from 'ionicons/icons';
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
				<IonButton onClick={()=>{createEventPage();}}><IonIcon icon={add}><p>add new Event object</p></IonIcon></IonButton>
				<div className='paddedPage' id="eventPage"></div>
			</IonContent>
			<IonFab vertical="bottom" horizontal="end">
		</IonFab> 
		</IonPage>
		);
};

createEventPage();

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createEventPage()
{
	let elements:any[] = []
	await fetch("https://" + global.ip + "/GetEvents" + global.userID).then(function(response:any) {
	response.text().then(async function(responseString: any) 
	{
		let dates = responseString.split("||");
		for(let i = 0; i < dates.length; i++)
		{
			let responseElements = dates[i].split("--");
			console.log(responseElements);
			elements[i] = createEventObject(responseElements[0], +(responseElements[1]));
			console.log("added element [" + responseElements[0] + ", " + +(responseElements[1]) + " ] to elements array")
		}
	})});
	await sleep(200); 
	let rootElement = document.getElementById("eventPage");
	if(rootElement !== null)
	{
		console.log("elements were " + elements);
		let root = ReactDOM.createRoot(rootElement);
		root.render(elements);
	}
}

function createEventObject(startDate:string, eventLength:number)
{
	console.log("startDate : " + startDate + ", eventLength : " + eventLength);
	return React.createElement(EventObject, {startDate:startDate.replace(" ", "+"), eventLength:eventLength}); 
}

function EventObject(data:{startDate:string, eventLength:number})
{
	let dateObject = new Date(data.startDate);
	let dateBackup = new Date(dateObject);
	let DBStr = dateBackup.toString().substring(0, dateBackup.toString().indexOf("GMT")).substring(0, dateBackup.toString().indexOf("GMT") - 9);
	dateObject.setHours(dateObject.getHours() + data.eventLength);
	return <div><div className="timeClass"><p> From : <br></br>{DBStr}<br></br>{dateBackup.toString().substring(dateBackup.toString().indexOf("GMT") - 9, dateBackup.toString().indexOf("GMT"))}</p><p>Until : <br></br>{dateObject.toString().substring(0, dateObject.toString().indexOf("GMT") - 9)}<br></br>{dateObject.toString().substring(dateObject.toString().indexOf("GMT") - 9, dateObject.toString().indexOf("GMT"))}</p></div></div>
}

export default Tab4