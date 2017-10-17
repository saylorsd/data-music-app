import React, {Component} from 'react';

import './App.css';
import {MapContainer} from "./map/map";
import Menu from "./menu/Menu";
import Button from 'material-ui/Button'

import AddIcon from 'material-ui-icons/Add'

import {themeColors} from "./utils/settings"


class App extends Component {
    render() {
        return (
            <div className="App flex-container">
                <MainHeader className="flex-item"/>

                <MainContent className="flex-item"/>

                <MainFooter className="flex-item">
                    <p>This is a footer.</p>
                </MainFooter>
            </div>
        );
    }
}


class MainContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hood: 'Central Oakland',
        };
        this.updateHood = this.updateHood.bind(this);
    }

    updateHood = (hood) => {
        this.setState({hood: hood})
    };


    render() {
        const style = {
            menuContainer: {
                padding: "0 6px",
                overflowX: 'auto',
                flexGrow: '2'
            }
        };

        return (
            <div className={this.props.className}>
                <MapContainer className="map" id="map"
                              parcelId={this.state.hood}
                              updateHood={this.updateHood}/>

                <div style={{width: '480px', heigh: '100%', display: 'flex', flexDirection: 'column'}}>
                    <div style={style.menuContainer}>
                        <Menu hood={this.state.hood}/>
                    </div>
                </div>
            </div>
        );
    }
}

class MainHeader extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const style = {
            padding: '10px 7px',
            backgroundColor: themeColors.black,
            color: themeColors.white,
            img: {
                height: '70px',
                display: 'block',
                float: 'left',
            },
            h1: {
                display: 'block',
                margin: '0',
                position: 'relative',
                top: '20px',
                left: '5px'
            }
        };

        return (
            <div style={style} className={this.props.className}>
                <img style={style.img}
                     src="http://www.wprdc.org/wp-content/themes/wprdc-redesign/assets/images/plain_logo_rbg_cropped.svg"/>
                <h1 style={style.h1}>Neighborhood Sounds</h1>
            </div>
        )
    }
}

class MainFooter extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const style = {
            borderTop: "3px solid black",
            background: themeColors.black,
            color: "white",
            padding: ".25rem"
        };

        return (
            <div style={style} className={this.props.className}>
                <p>&copy; 2017 Steve Saylor</p>
            </div>
        )
    }
}


export default App;
