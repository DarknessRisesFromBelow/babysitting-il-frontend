declare module NodeJS {
	interface Global {
		ip : string = "api.yairmedina.cf";
		shouldRun: bool;
		loggedInEvent : Event;
		userID : string;
		sessionID : string;
		usrs : any;
		msgs : any;
	}
}