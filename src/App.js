import logo from './logo.svg';
import './App.css';
import React from 'react';
import "../node_modules/font-awesome/css/font-awesome.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./App.css";
export class App extends React.Component {
    render() {
    
    return (
        <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Mi Proyecto React</h1>
            <p>Mis primeros pasos con react.</p>
            </header>
        </div>
        );
    };
};



export default App;