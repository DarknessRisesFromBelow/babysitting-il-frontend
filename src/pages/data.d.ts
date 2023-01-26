declare module NodeJS {
	interface Global {
		ip : string = "api.yairmedina.cf";
		loggedInEvent : Event;
		userID : string;
		sessionID : string;
		usrs : any;
		msgs : any;
	}
}