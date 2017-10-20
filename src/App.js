import React, {Component} from 'react';

import './App.css';
import {MapContainer} from "./map/map";
import Menu from "./menu/Menu";
import Button from 'material-ui/Button'
import {Sparklines, SparklinesLine, SparklinesBars } from 'react-sparklines';

import AddIcon from 'material-ui-icons/Add'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';



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
            open: false,
            tracks: null,
            notes: null
        };
        this.updateHood = this.updateHood.bind(this);
    }

    updateHood = (hood) => {
        this.setState({hood: hood})
    };


    openNoteDisplay = (tracks, notes) => {
        console.log("DISPLAY", tracks, notes);
        this.setState({tracks: tracks, notes: notes, open: true})
    };

    closeNoteDisplay = () => {
        this.setState({open: false})
    }

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
                        <Menu openNoteDisplay={this.openNoteDisplay} hood={this.state.hood}/>
                        <NoteDialog open={this.state.open}
                                    handleRequestClose={this.closeNoteDisplay}
                                    hood={this.state.hood}
                                    tracks={this.state.tracks}
                                    notes={this.state.notes}
                        />
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


const NoteDialog = props => {
    let open = props.open,
        hood = props.hood,
        tracks = props.tracks,
        notes = props.notes;

    const style = {
        'name': {
            marginBottom: '3px'
        }
    };


    let noteLen = 20;
    const maxLen = 300;// max length
    if (notes) {
        let longest = notes.map(function (a) {
            return a.length;
        }).indexOf(Math.max.apply(Math, notes.map(function (a) {
            return a.length;
        })));
        noteLen = notes[longest].length;
    }

    // for each noteSet in notes, set width to be


    return (
        <Dialog open={open} onRequestClose={props.handleRequestClose}>
            <DialogTitle>{`The Sound of ${hood}`}</DialogTitle>
            <DialogContent>
                {tracks && tracks.map((track, i) =>
                    <div key={i.toString()}>
                        <h5 style={style.name}>{track.dataset.name}</h5>
                        <Sparklines data={notes[i]}
                                    // width={Math.floor((notes[i].length / noteLen) * maxLen) * getLen(track.noteValue)}
                                    preserveAspectRatio={'xMidYMid'}>
                            <SparklinesLine color={'gray'}/>
                        </Sparklines>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )


};


const getLen = (value) => {
    switch (value) {
        case 'eighth':
            return 1;
        case 'quarter':
            return 2;
        case 'half':
            return 4;
        default:
            return 1;
    }
}

export default App;


