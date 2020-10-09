import React from 'react';
import { Link } from 'react-router-dom';
import NDLogo from '../img/nd-logo.png';


export default function Navigation(props) {
	return (
	<div className="navigation">
		<img src={NDLogo} alt="ND Logo" />
		<Link to="/">Home</Link>
		<Link to="/character-equipment">Character Equipment</Link>
		<Link to="/background-review">Background Review</Link>
		<Link to="/effect-review">VFX Review</Link>
		<Link to="/combat-scene">Combat Scene</Link>
	</div>
	)
}
