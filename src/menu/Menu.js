import React, {Component} from 'react';

import Button from 'material-ui/Button'
import List, {ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction} from 'material-ui/List';
import Input, {InputLabel} from 'material-ui/Input';
import Select from 'material-ui/Select';
import Avatar from 'material-ui/Avatar';
import {FormLabel, FormControl, FormControlLabel, FormHelperText} from 'material-ui/Form';
import ToolTip from 'material-ui/Tooltip';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import LayersIcon from 'material-ui-icons/Layers';

import Radio, {RadioGroup} from 'material-ui/Radio';


import AddIcon from 'material-ui-icons/Add';
import MusicIcon from 'material-ui-icons/QueueMusic';

import mapDataSource from "./utils";

const INSTRUMENTS = ['piano', 'guitar', 'bass', 'celesta', 'organ', 'music box'];

const instrumentNumber = inst => {
    switch (inst) {
        case 'piano':
            return 1;
            break;
        case 'guitar':
            return 25;
            break;
        case 'bass':
            return 33;
            break;
        case 'celesta':
            return 9;
            break;
        case 'organ':
            return 19;
            break;
        case 'music box':
            return 11;
            break;
        default:
            return 1;
    }
};

class TrackMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: [null]
        }
    }

    updateTrack = (idx, trackState) => {
        let newTracks = this.state.tracks.map((track, i) => {
            if (idx !== i) {
                return track;
            } else {
                return trackState
            }
        });

        this.setState({tracks: newTracks})
    };

    handleTrackAdd = () => {
        this.setState({tracks: this.state.tracks.concat([null])})
    };


    handleOnDelete = trackNumber => () => {

        this.setState({
            tracks: this.state.tracks.filter((track, idx) => trackNumber !== idx)
        })
    };

    handleSubmit = event => {
        console.log(this.state.tracks);
        let reqTracks = JSON.stringify(this.state.tracks.map((track) => {
            return {dataset: track.dataset.id, instrument: instrumentNumber(track.instrument), noteValue: track.noteValue}
        }));

        let url = 'http://localhost:8000/data-music/neighborhood-music/' +
            '?neighborhood=' + this.props.hood +
            '&tracks=' + reqTracks;
        console.log(url);

        fetch(url)
            .then(
                (response) => {
                    response.json()
                        .then(
                            (data) => {
                                let music = "data:audio/wav;base64," + data.music;
                                let snd = new Audio(music);
                                snd.play()
                                    .then(() => {
                                        },
                                        (err) => {
                                            console.log(err)
                                        });
                            },
                            (err) => console.log(err))
                },
                (err) => {
                    console.log(err)
                }
            )
    };


    render() {
        console.log("rendering", this.state.tracks);
        return (
            <div className="main-menu">
                <h1>{this.props.hood}</h1>


                {this.state.tracks.map((track, i) => {
                        return (
                            <div key={i.toString()}>
                                <TrackMenuItem currState={this.state.tracks[i]} trackNumber={i}
                                               numTracks={this.state.tracks.length}
                                               updateTrack={this.updateTrack} onDelete={this.handleOnDelete(i)}/>
                                <br/>
                                {this.state.tracks.length - 1 !== i && <div><Divider/></div>}

                            </div>
                        );
                    }
                )}

                <Button raised onClick={this.handleTrackAdd}><AddIcon/></Button>
                <Button raised color='primary'
                        style={{float: 'right', 'marginLeft': 'auto', 'marginRight': 'auto'}}
                        onClick={this.handleSubmit}><MusicIcon/> Make Some Music</Button>
            </div>
        )
    }
}


class TrackMenuItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            availableDatasets: [],
            availableFields: [],
            dataset: null,
            field: null,
            method: '',
            instrument: INSTRUMENTS[0],
            noteValue: 'eighth'
        }
    }

    /**
     * Update State with available datasets
     * @private
     */
    _getAvailableDatasets() {
        let availableDatasets = mapDataSource.getDatasets();
        let defaultDataset = availableDatasets[0];

        console.log("DS", availableDatasets);
        console.log(defaultDataset);

        this.setState(
            {
                availableDatasets: availableDatasets,
                dataset: defaultDataset,
            }, () => {
                this._getAvailableFields(defaultDataset)
            });
    }

    /**
     * Update State with available fields from `dataset`
     * @param {obj} dataset - carto dataset
     * @private
     */
    _getAvailableFields(dataset) {
        console.log("NEW DS", this.state.dataset)
        this.props.updateTrack(this.props.trackNumber, this.state);

    }


    /**
     * Runs when data source (dataset, field) dropdowns are changed.
     * @param name
     */
    handleChange = name => event => {
        if (name === 'dataset') {
            // Update dataset
            let newDataset = mapDataSource.getDataset(event.target.value);
            this.setState(
                {dataset: newDataset},
                () => {
                    // And then get new available the fields,
                    // which will also set the currently-selected field and it's possible values.
                    this._getAvailableFields(newDataset)
                }
            );

        }
        else if (name === 'field') {
            // Get new field
            let newField = mapDataSource.getField(this.state.dataset.id, event.target.value);

            // Update field in state
            this.setState(
                {field: newField}
            );
        }

        else {
            this.setState(
                {[name]: event.target.value},
                () => {
                    this.props.updateTrack(this.props.trackNumber, this.state);
                }
            );
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.currState) {
            this.setState({...nextProps.currState})
        }
    }

    componentDidMount() {
        this._getAvailableDatasets();
    }

    render() {
        const style = {
            menuItem: {
                position: 'relative',
                padding: "6px"
            },
            deleteButton: {
                position: 'absolute',
                top: '12px',
                right: '12px',
            },
            noteImg: {
                height: '24px'
            }
        };

        console.log(this.state.dataset);
        let trackNum = this.props.trackNumber;

        if (this.state.dataset) {
            return (
                <div className="track-menu-item" style={style.menuItem}>
                    <h3>Track {trackNum + 1}</h3>
                    {this.props.numTracks > 1 &&
                    <ToolTip style={style.deleteButton} title={"Delete Track"}>
                        <IconButton onClick={this.props.onDelete}><DeleteIcon/></IconButton>
                    </ToolTip>
                    }
                    <FormControl>
                        <InputLabel htmlFor={`dataset-${trackNum}`}>Dataset</InputLabel>
                        <Select
                            native
                            value={this.state.dataset.id}
                            onChange={this.handleChange('dataset')}
                            input={<Input id={`dataset-${trackNum}`}/>}
                        >
                            {this.state.availableDatasets.map((dataset, i) => {
                                return <option key={i.toString()}
                                               value={dataset.id}>{dataset.name}</option>
                            })}
                        </Select>
                    </FormControl>


                    <FormControl>
                        <InputLabel htmlFor={`instrument-${trackNum}`}>Instrument</InputLabel>
                        <Select
                            native
                            value={this.state.instrument}
                            onChange={this.handleChange('instrument')}
                            input={<Input id={`instrument-${trackNum}`}/>}
                        >
                            {INSTRUMENTS.map((instrument, i) => {
                                return <option key={i.toString()}
                                               value={instrument}>{instrument}</option>
                            })}
                        </Select>
                    </FormControl>
                    <br/><br/>
                    <FormControl component="fieldset" >
                        <FormLabel component="legend">Note Value</FormLabel>
                        <RadioGroup row
                            aria-label="Note Value"
                            name="noteValue"
                            value={this.state.noteValue}
                            onChange={this.handleChange('noteValue')}
                        >
                            <FormControlLabel value="eighth" control={<Radio />} label={<img style={style.noteImg} src={require('../img/eighth_note.png')}/>} />
                            <FormControlLabel value="quarter" control={<Radio />} label={<img style={style.noteImg} src={require('../img/quarter_note.png')}/>} />
                            <FormControlLabel value="half" control={<Radio />} label={<img style={style.noteImg} src={require('../img/half_note.png')}/>} />

                        </RadioGroup>
                    </FormControl>

                </div>
            );
        } else {
            return null;
        }
    }
}

export default TrackMenu;


