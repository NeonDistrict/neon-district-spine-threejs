import React from 'react';
import { Link } from 'react-router-dom';
import NDLogo from '../img/nd-logo.png';


export default function Navigation(props) {
	return (
	<div className="navigation">
		<img src={NDLogo} alt="ND Logo" />
		<Link to="/">Home</Link>
		<Link to="/test">Default Package Test</Link>
	</div>
	)
}
