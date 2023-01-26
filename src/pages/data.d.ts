declare module NodeJS {
	interface Global {
		ip : string = "8e13-77-137-74-93.eu.ngrok.io";
		loggedInEvent : Event;
		userID : string;
		sessionID : string;
		usrs : any;
		msgs : any;
	}
}