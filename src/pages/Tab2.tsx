import { IonContent,IonButton, IonIcon, IonPage, IonTitle, IonFabButton, IonFab} from '@ionic/react';
import React, {useRef, useEffect} from 'react'
//import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import {add, send} from 'ionicons/icons';
import ReactDOM from 'react-dom/client'
import image from "../PicData/messageOutlineLeft.svg"
import { Redirect, Route, NavLink } from "react-router-dom";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';




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

function ChatMessageElement(data:{direction : string, imgURL : string , messageText : string})
{
	scrollToBottom("textPosition");
	return <div className = "chatMessageElementStyle">
		<img src={data.imgURL} className="circleMessageTab"></img><p className = {data.direction === "left" ? "ChatMessageLeft" : "ChatMessageRight"}>{data.messageText}</p>
	</div>
}

function scrollToBottom(id:string)
{
	var element = document.getElementById(id);
	if(element !== null && element !== undefined)
	{
		console.error("scrolling down!");
		element.scrollTop = 0;
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
			for(var i= 0; i < data.length; i++)
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
						if(temp[3].includes("0"))
						{
							var url : string = "https://" + global.ip + "/GetUserData" + temp[0];
						}
						else
						{
							var url : string = "https://" + global.ip + "/GetUserData" + global.userID;
						}
						await fetch(url).then(
							async function(response:any)
							{
								console.log("");
								await response.text().then(
								function(responseString: any)
								{ 
									responseString = responseString.replace("Got User Info. <br>", "");
									var usersData = responseString.split(",");
									pfpURLstring = usersData[2];
									//await console.log(temp[3] + ", "+ temp[0]);
								}
							);
						});
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
			if(page != null)
			{
				console.log("rendering messages");
				var root = ReactDOM.createRoot(page);
				root.render(msgs);
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
		<br></br>
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
	for(var i = messagesArr.length - 1; i >= 0; i--)
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

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
		getOutput();
		updateMessagesPageInterval(interval);
	}
}


async function updateMessagesInterval(interval:number, chatID:number)
{
	if(currentChatID === chatID)
	{
		await sleep(interval);
		getUpdatedMessages();
		loadConversation(messagesText.split("||"), "" + chatID);
		updateMessagesInterval(interval, chatID);
		let content = document.querySelector("textPosition");
    	if(content)
    	{
    		await sleep(1500);
    		content.scrollTo(0, content.scrollHeight);
		}
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


