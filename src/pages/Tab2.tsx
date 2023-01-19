import { IonContent,IonButton, IonIcon, IonPage, IonTitle, IonFabButton, IonFab} from '@ionic/react';
import React, {useRef, useEffect} from 'react'
//import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import {add} from 'ionicons/icons';
import ReactDOM from 'react-dom/client'
import { Redirect, Route, NavLink } from "react-router-dom";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';




function PreUserLoad()
{
	fetch("http://192.168.68.107/CreateUser%221,meow,Yairmedina356@gmail.com,1234rtyu%22");
	fetch("http://192.168.68.107/CreateUser%221,meow1,spam.me.please.do.it@gmail.com,1234rtyu%22");
	fetch("http://192.168.68.107/MessageUser0,2,helo!");	
}

const fetch = require("cross-fetch");


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
		position.then(function(response:any){fetch("https://192.168.68.107/setGeolocation" + global.userID + "," + response.coords.latitude + "," + response.coords.longitude + "," + global.sessionID);})
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
			<IonFabButton color="secondary">
				<IonIcon icon={add} ></IonIcon>
			</IonFabButton>
		</IonFab> 
		</IonPage>
		);
};


function getOutput() : string
{
	var res = "meow";
	console.log("meow!");
	fetch("https://192.168.68.107/GetAllMessages" + global.userID	+ "," + global.sessionID).then(function(response:any) {
		response.text().then(async function(responseString: any) { 
//		console.log(responseString);
			res = responseString.slice(0,responseString.length - 2).replace("Messages : ", "").replace("Messages ","");
			console.log(res);
			var data = res.split("||");
			var msgs = [];
			var pfpURLstring:string = "";
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
						var url : string = "https://192.168.68.107/GetUserData" + temp[0];
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
									//temp[0] = usersData[0];
									//temp[3] = usersData[3];
									//await console.log(temp[3] + ", "+ temp[0]);
								}
							);
						});

						console.log(pfpURLstring);
						msgs.push(React.createElement(message, {name:temp[0].toLowerCase(),id:temp[3],messages:res,pfpURL:pfpURLstring,lastMessage:temp[1]},null));
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
		return <div className = "boxTest2" id="CloseablePopup">
		<IonButton className="ExitButton" onClick = {()=>{ClosePopup();}}>X</IonButton>
		<p className="Title">{data.name}</p>
		<br></br>
		<br></br>
		<IonButton className="boxButton" onClick={()=>{OnMessageButtonClicked(data.id);}}><p>message {data.name}</p></IonButton>
	</div>
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
	var element = document.getElementById("messagePage");
	if(element !== undefined && element !== null)
	{
		const root = ReactDOM.createRoot(element);
		var msgs = global.msgs;
		var elements = [msgs];
		root.render(elements);
	}
}

function OnMessageButtonClicked(data:string)
{
	alert("messaging "+data+"...");
	//fetch("https://192.168.68.107/MessageUser" + global.userID + "," + data + "," + "hello from babysittingIL,"+ global.sessionID);

}


export default Tab2;


