import { Redirect, Route } from 'react-router-dom';
import {
	IonApp,
	IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personCircle,chatbubbleEllipses, home, calendar } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/tab4';
import LoginScreen from './pages/login';
import SignupScreen from './pages/signup';
import OneSignal from 'onesignal-cordova-plugin';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';



// Call this function when your app starts
function OneSignalInit(): void {
	// Uncomment to set OneSignal device logging to VERBOSE  
	// OneSignal.setLogLevel(6, 0);

	console.log("\n-----------------------------------------------\n-----------------------------------------------\n-----------------------------------------------\n-----------------------------------------------\nstarting the notification subscription process\n-----------------------------------------------\n-----------------------------------------------\n-----------------------------------------------\n-----------------------------------------------");


	// NOTE: Update the setAppId value below with your OneSignal AppId.
	OneSignal.setAppId("697dd96c-162f-4af5-82a4-e42990cdec84");
	OneSignal.setNotificationOpenedHandler(function(jsonData) {
		console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
	});

	// Prompts the user for notification permissions.
	//    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
	OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
		console.log("User accepted notifications: " + accepted);
	});
}



setupIonicReact();
OneSignalInit();

const App: React.FC = () => (
	<IonApp>
	<IonReactRouter>
		<IonTabs>
		<IonRouterOutlet >
			<Route exact path="/home">
			<Tab1 />
			</Route>
			<Route exact path="/messages">
			<Tab2 />
			</Route>
			<Route exact path="/events">
			<Tab4/>
			</Route>
			<Route exact path="/profile">
			<Tab3 />
			</Route>
			<Route exact path="/login">
			<LoginScreen/>
			</Route>
			<Route exact path = "/signup">
			<SignupScreen/>	
			</Route>
			<Route exact path="/">
			<LoginScreen />
			</Route>
		</IonRouterOutlet>
		<IonTabBar slot="bottom" id="appTabBar">
			<IonTabButton tab="tab1" href="/home" >
			<IonIcon icon={home}/>
			<IonLabel>Home</IonLabel>
			</IonTabButton>
			<IonTabButton tab="tab2" href="/messages">
			<IonIcon icon={chatbubbleEllipses} />
			<IonLabel>Messages</IonLabel>
			</IonTabButton>
			<IonTabButton tab="tab3" href="/events">
			<IonIcon icon={calendar} />
			<IonLabel>Events</IonLabel>
			</IonTabButton>
			<IonTabButton tab="tab4" href="/profile">
			<IonIcon icon={personCircle} />
			<IonLabel>Profile</IonLabel>
			</IonTabButton>
		</IonTabBar>
		</IonTabs>
	</IonReactRouter>
	</IonApp>
);

export default App;