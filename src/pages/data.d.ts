declare module NodeJS {
	interface Global {
		loggedInEvent : Event;
		userID : string;
		sessionID : string;
		usrs : any;
		msgs : any;
	}
}