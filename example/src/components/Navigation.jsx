import React from 'react';
import { Link } from 'react-router-dom';
import NDLogo from '../img/nd-logo.png';


export default function Navigation(props) {
	return (
	<div className="navigation">
		<img src={NDLogo} alt="ND Logo" />
		<Link to="/">Home</Link>
		<Link to="/combat-test">Combat Test</Link>
		<Link to="/character-equipment">Character Equipment</Link>
		<Link to="/combat-scene">Combat Scene</Link>
	</div>
	)
}
