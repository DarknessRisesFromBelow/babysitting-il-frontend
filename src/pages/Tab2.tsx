import { IonContent,IonButton, IonDatetime, IonIcon, IonPage, IonTitle, IonFabButton, IonFab} from '@ionic/react';
import React, {useRef, useEffect} from 'react'
//import ExploreContainer from '../components/ExploreContainer';
import './designs/Tab2.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import GooglePayButton from '@google-pay/button-react'
import {add, send, calendar, exit} from 'ionicons/icons';
import ReactDOM from 'react-dom/client'
import image from "../PicData/messageOutlineLeft.svg"
import { Redirect, Route, NavLink } from "react-router-dom";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';


var startDate = "";

function PreUserLoad()
{
	fetch("http://" + global.ip + "/CreateUser%221,meow,Yairmedina356@gmail.com,1234rtyu%22");
	fetch("http://" + global.ip + "/CreateUser%221,meow1,spam.me.please.do.it@gmail.com,1234rtyu%22");
	fetch("http://" + global.ip + "/MessageUser0,2,helo!");	
}

const fetch = require("cross-fetch");
//const scrollToBottom = () => { let list = document.querySelector("ion-content"); return list && list.scrollToBottom(); };
var currentChatID = 0;
var messagesText:string = "";
//const response = getOutput();
//console.log(response);
//var MessageText = useRef(null);
//let messages = request.text();
const Tab2: React.FC = () => {
	useEffect(() => {
		currentChatID = -15;
		updateMessagesPageInterval(4000);
		getLocation();
		getOutput();
		});
	function getLocation()
	{
		const position = Geolocation.getCurrentPosition();
		position.then(function(response:any){fetch("https://" + global.ip + "/setGeolocation" + global.userID + "," + response.coords.latitude + "," + response.coords.longitude + "," + global.sessionID);})
	}
	return (
		<IonPage>
			{global.userID == undefined ? <Redirect to="/login" /> : null}
			<IonContent fullscreen>
				<div className="Center">
					<p></p>
				</div>
				<div className='paddedPage' id="messagePage"></div>
			</IonContent>
			<IonFab vertical="bottom" horizontal="end">
		</IonFab> 
		</IonPage>
		);
};

async function getRate(userID:string)
{
	var rate:number = 0;
	await fetch("https://" + global.ip + "/GetUserData" + userID).then(async function(response:any)
	{
		await response.text().then(async function(responseString: any){
			rate = responseString.split(",")[responseString.split(",").length - 2];
		}) 

	});
	await console.log("returned rate was "+ rate);
	return rate;
}

async function awaitEvent(eventName:string) {
  return new Promise(function(resolve, reject) {
	global.addEventListener(eventName, function(e:any) {
	  resolve(e.data); // done
	});
  });
}

function ChatMessageElement(data:{direction : string, imgURL : string , messageText : string})
{
	return <div className = "chatMessageElementStyle">
		<img src={data.imgURL} className="circleMessageTab"></img><p className = {data.direction === "left" ? "ChatMessageLeft" : "ChatMessageRight"}>{data.messageText}</p>
	</div>
}

async function scrollToBottom(id:string)
{
	var element = document.getElementById(id);
	if(element !== null && element !== undefined)
	{
		sleep(1000);
		if(element.scrollHeight > window.screen.height)
			element.scrollTop = element.scrollHeight;
	}
}

function getUpdatedMessages() : string
{
	var res = "meow";
	console.log("meow!");
	fetch("https://" + global.ip + "/GetAllMessages" + global.userID	+ "," + global.sessionID).then(function(response:any) {
		response.text().then(async function(responseString: any) { 
			res = responseString.slice(0,responseString.length - 2).replace("Messages : ", "").replace("Messages ","");
			messagesText = res;
			return responseString;
		});
	});
	return res;
}

var previousMessages: any[] = [];
function getOutput() : string
{
	var res = "meow";
	console.log("meow!");
	fetch("https://" + global.ip + "/GetAllMessages" + global.userID	+ "," + global.sessionID).then(function(response:any) {
		response.text().then(async function(responseString: any) { 
//		console.log(responseString);
			res = responseString.slice(0,responseString.length - 2).replace("Messages : ", "").replace("Messages ","");
			console.log(res);
			messagesText = res;
			var data = res.split("||");
			var msgs = [];
			var pfpURLstring:string = "";
			var renderedIds:string[] = [];
			for(var i = 0; i < data.length; i++)
			{
				var temp = data[i].split(" : ");
				if(temp[0] != " "&&temp[0] != "")
				{
					var exists=false;
					for(var o = 0; o < msgs.length;o++)
					{
						if(temp[0]==msgs[o].props.name)
							exists = true;
					}
					if(!exists)
					{
						pfpURLstring = temp[6];
						console.log(pfpURLstring);
						if(!renderedIds.includes(temp[0]))
						{
							await msgs.push(React.createElement(message, {name:"",id:temp[0],messages:res,pfpURL:pfpURLstring,lastMessage:temp[1]},null));
							renderedIds.push(temp[0]);
						}
					}
				}
			}
			global.msgs = msgs;
			var page = document.getElementById("messagePage");
			if(page != null && JSON.stringify(previousMessages) != JSON.stringify(msgs))
			{
				console.log("rendering messages");
				var root = ReactDOM.createRoot(page);
				root.render(msgs);
				previousMessages = msgs;
			}
			return responseString;
		});
	});
	return res;
}



function TextingPage(data:{name:string,id:string,messages:string})
{
	var usersName = "";
	var messagesArr = data.messages.split("||");
	currentChatID = +(data.id);
	updateMessagesInterval(4000, +(data.id));
	
	for(var i = 0; i < messagesArr.length; i++)
	{
		var newMessage = messagesArr[i].split(" : ");
		if(newMessage[0] == data.id)
		{
			usersName = newMessage[2];
		}
	}
	setTimeout(()=>{loadConversation(messagesArr,data.id)},15);
	return <div className = "boxTest2" id="CloseablePopup">
		<IonButton className="ExitButton2" onClick = {()=>{ClosePopup();}}>X</IonButton>
		<p className="Title">{usersName}</p>
		<IonButton className = {global.userType != 1 ? "reserveButtonClass" : "hide"} onClick = {()=>{createReservationPage(data.id)}}><IonIcon icon={calendar} size="large"/></IonButton>
		<br></br>
		<div id = "DivHolder" className = "divHolderClass"></div>
		<div id="textPosition" className="chatPageMessagesSubdiary"><div id="messagesEnd"></div></div>
		<br></br>
		<div>
			<input type='text' autoComplete="off" className="messageInput" id="messageTextInput" />
			<IonButton className="boxButton2" onClick={()=>{let element =(document.getElementById("messageTextInput") as HTMLInputElement); if(element !== null && element !== undefined){OnMessageButtonClicked(data.id, element.value);}}}><IonIcon icon={send} size="large"></IonIcon></IonButton>
		</div>
	</div>
}



function loadConversation(messagesArr:any[], id: string)
{
	console.log("loadConversation called with messageArr being " + messagesArr);
	var msgsUpdated = []; 
	for(var i = 0; i < messagesArr.length; i++)
	{
		var newMessage = messagesArr[i].split(" : ");
		if(newMessage[0] == id || newMessage[0] == global.userID)
		{
			console.log(newMessage[1]);
			
			msgsUpdated.push(React.createElement(ChatMessageElement, {direction:newMessage[3].includes("0") ? "left" : "right", imgURL:newMessage[5],messageText: newMessage[1]}, null));
		}
	}
	let element = document.getElementById("textPosition");
	if(element!== null)
	{
		console.log("rendering elements");
		var root = ReactDOM.createRoot(element);
		root.render(msgsUpdated);
	}
}

async function createReservationPage(id:string)
{
	let rate:number = await getRate(id);
	console.log("rate: " + rate);
	let element = React.createElement(reservation, {id:id, rate:rate}, null);
	let rootElement = document.getElementById("DivHolder");
	if(rootElement !== null)
	{
		let root = ReactDOM.createRoot(rootElement);
		root.render(element);
	}
}

function reservation(data:{id:string, rate:number})
{
	return <div className="RBPage">
	<IonButton className="RBPageExitButton" onClick = {()=>{closeRBPage();}}>
		<IonIcon icon={exit}/>
	</IonButton>
	<IonDatetime className="calendarClass" min={new Date().toISOString()} hourCycle="h23" size="fixed"></IonDatetime>
	<div id ="RBPage"></div>
	<p>id: {data.id}</p>
	<br/>
	<div id="google-pay-button-holder" className="googlePayButtonHolder"></div>
	<p> rate : {data.rate}₪</p>
	<IonButton className="RBPageButton RBPageButtonContinue" id = "calendarObject" onClick={()=>{extractDate()}}><p>continue</p></IonButton>		
	<IonButton className="RBPageButton" onClick={()=>{finishReservation(data.id, data.rate);}}><p>pay</p></IonButton>
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


function finishReservationPage(dataFromOtherFunctions:{amount:number, rate:number})
{
	console.log(dataFromOtherFunctions.amount * dataFromOtherFunctions.rate);
	const num: number = dataFromOtherFunctions.amount * dataFromOtherFunctions.rate;
	const with2Decimals: string = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)![0]!;
	return <div>
		<div className="pageBlock"></div>
		<div className="finishRBPage">
			<PayPalScriptProvider options={{ clientId: "ATZQQdt69hweenR4LXQYXuguFrYhtb0_myIzDFu8650D3bYebeKkkxPW3EcxH6L7kz3fyo9GS-wPpqrF", currency: "ILS" }}>
            	<PayPalButtons style={{ layout: "vertical", label : "pay", shape : "pill"}} className="buttonLayout" createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: "ILS",
                                        value: "" + (dataFromOtherFunctions.amount * dataFromOtherFunctions.rate),
                                    },
                                },
                            ],
                        })
                        .then((orderId) => {
                            // Your code here after create the order
                            return orderId;
                        });
                }} onApprove={function (data, actions:any) {if(actions.order){return actions.order.capture().then(function (){dispatchEvent(global.googlePayPaymentAccepted); console.log("payment successful. proceeding...");});}}}/>
        	</PayPalScriptProvider>
			{false ? <GooglePayButton className="gpayButton" buttonSizeMode="fill" environment="TEST" paymentRequest={{apiVersion: 2, apiVersionMinor: 0, callbackIntents: ['PAYMENT_AUTHORIZATION'], allowedPaymentMethods: [{type: 'CARD',parameters: {allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],allowedCardNetworks: ['MASTERCARD', 'VISA'],},tokenizationSpecification: {type: 'PAYMENT_GATEWAY',parameters: {gateway: 'mpgs',gatewayMerchantId: 'exampleGatewayMerchantId',},},},],merchantInfo: {merchantId: '12345678901234567890',merchantName: 'Demo Merchant',},transactionInfo: {totalPriceStatus: 'FINAL',totalPriceLabel: 'Total',totalPrice: ""+(dataFromOtherFunctions.rate * dataFromOtherFunctions.amount),currencyCode: 'ILS',countryCode: 'IL',},}}    onPaymentAuthorized={async () => {dispatchEvent(global.googlePayPaymentAccepted); console.log("something happened"); return { transactionState: 'SUCCESS' };}}/> : null}
		</div>
	</div>		
}

async function finishReservation(id:any, rate:number)
{
	let endDate = "";
	let time = 0;
	const el = document.querySelector(".secondElement") as HTMLInputElement;
	if(el !== null)
	{
		if(el.value !== undefined)
			endDate = el.value;
	}
	startDate = startDate.replace(" ", "+");
	if(endDate !== "" && startDate !== "")
	{
		let endDateObject = new Date(endDate);
		let startDateObject = new Date(startDate);
		time = (((endDateObject.getTime() - startDateObject.getTime())/1000)/60)/60;
		
		let element = document.getElementById('google-pay-button-holder');
		if(element)
		{
			let root = ReactDOM.createRoot(element);
			let newElement = React.createElement(finishReservationPage, {amount:time, rate:rate}, null)
			root.render(newElement);
		}

		await awaitEvent("googlePayPaymentAccepted");

		fetch("https://" + global.ip + "/ReserveBabysitter" + id + "," + startDate.replace(" ", "+") + "," + time + "," + global.userID + "," + global.sessionID);
		fetch("https://" + global.ip + "/PayUser" + global.userID + "," + id + "," + Math.ceil(time) + "," + global.sessionID);	

		let holder = document.getElementById("DivHolder");
		if(holder !== null)
		{
			let root = ReactDOM.createRoot(holder);
			root.render(null);
		}

	}
}

function sleep(ms:number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractDate()
{ 
	const el = document.querySelector(".calendarClass") as HTMLInputElement;
	sleep(200);
	if(el !== null)
	{
		if(el.value !== undefined)
			startDate = el.value.replace(" ", "+");
	}
	sleep(200);
	if(startDate !== "")
	{
		el.remove();
		let element = document.getElementById("calendarObject");
		element?.remove();
		let parent =  document.getElementById("RBPage");
		if(parent !== null)
		{
			let root = ReactDOM.createRoot(parent);
			let newElement = <IonDatetime className="secondElement" min={startDate} hourCycle="h23" size="fixed"></IonDatetime>; 
			root.render(newElement);
		}
	}
}


function message(data:{name:string,id:string,messages:string,pfpURL:string,lastMessage:string})
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
	return(
	<IonButton className="messageRowButton" color='none' onClick={(event) => {onMessageRowButtonClicked(data.name,data.id,data.messages); }}>
		<div className = "user">
			<div className="text"dir="rtl">
				<p className="noOverflow" >{data.lastMessage}</p>
			</div>
			<img className="circle" src={data.pfpURL} draggable="false"></img>
		</div>
	</IonButton>
	);
}

function onMessageRowButtonClicked(data:string, id:string, messages: string)
{
	var element = document.getElementById("messagePage");
	if(element !== undefined && element !== null)
	{
		var root = ReactDOM.createRoot(element);
		const myElement = <TextingPage name={data} id={id} messages = {messages}></TextingPage>
		var msgs = global.msgs;
		var elements = [msgs, myElement];
		root.render(elements);
	}
}

function ClosePopup()
{
	currentChatID = -15;
	updateMessagesPageInterval(2000);
	var element = document.getElementById("messagePage");
	if(element !== undefined && element !== null)
	{
		const root = ReactDOM.createRoot(element);
		var msgs = global.msgs;
		var elements = [msgs];
		root.render(elements);
	}
	getOutput();
}


async function updateMessagesPageInterval(interval:number)
{
	if(currentChatID < 0)
	{
		await sleep(interval);
		if(currentChatID < 0)
		{
			getOutput();
			updateMessagesPageInterval(interval);
		}
	}
}


async function updateMessagesInterval(interval:number, chatID:number)
{
	if(currentChatID === chatID)
	{
		let oldMessages = messagesText;
		await sleep(interval);
		getUpdatedMessages();
		if(messagesText != oldMessages)
		{
			console.error("this should not run if there are no new messages!");
			loadConversation(messagesText.split("||"), "" + chatID);
			scrollToBottom("textPosition");
		}
		updateMessagesInterval(interval, chatID);
	}
}

function OnMessageButtonClicked(data:string, message:string)
{
	alert("messaging "+data+"...");
	if(message !== "")
	{
		fetch("https://" + global.ip + "/MessageUser" + global.userID + "," + (+data) + "," + message + "," + global.sessionID);
		let element =(document.getElementById("messageTextInput") as HTMLInputElement);
		if(element !== null && element !== undefined)
			element.value = "";
	}
}


export default Tab2;


