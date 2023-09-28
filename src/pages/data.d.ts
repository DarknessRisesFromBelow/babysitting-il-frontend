declare module NodeJS {
	interface Global {
		ip : string = "api.yairmedina.cf";
		shouldRun: bool;
		loggedInEvent : Event;
		UnseccesfullyLoggedInEvent : Event;
		succesfullyRegisteredEvent : Event;
		UnsuccesfullyRegisteredEvent : Event;
		recivedMessageEvent: Event;
		googlePayPaymentAccepted : Event;
		userID : string;
		sessionID : string;
		usrs : any;
		msgs : any;
		userType : number;
	}
}