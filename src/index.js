import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
import Clock from './components/timeDate';

// Render the main component into the dom
ReactDOM.render(
	<section>
		<App />
		<Clock />
	</section>,
	 document.getElementById('app'));
