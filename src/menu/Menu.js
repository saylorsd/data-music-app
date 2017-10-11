import React, {Component} from 'react';

import Button from 'material-ui/Button'
import List, {ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction} from 'material-ui/List';
import Input, {InputLabel} from 'material-ui/Input';
import Select from 'material-ui/Select';
import Avatar from 'material-ui/Avatar';
import {FormControl, FormHelperText} from 'material-ui/Form';
import ToolTip from 'material-ui/Tooltip';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import LayersIcon from 'material-ui-icons/Layers';

import mapDataSource from "./utils";

const INSTRUMENTS = ['piano', 'guitar', 'bass', 'trumpet'];

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

    handleSubmit= () =>{
        let params = {
            neighborhood: this.props.hood,
            tracks: this.state.tracks
        }



    }


    render() {
        console.log("rendering");
        return (
            <div className="main-menu">
                <h1>{this.props.hood}</h1>
                {this.state.tracks.map((track, i) => {
                        return (
                            <div>
                                <TrackMenuItem currState={this.state.tracks[i]} trackNumber={i} key={i.toString()}
                                               updateTrack={this.updateTrack} onDelete={this.handleOnDelete(i)}/>
                                <br/>
                                {this.state.tracks.length -1 !== i && <div><Divider/></div>}

                            </div>
                        );

                    }
                )}

                <Button raised onClick={this.handleTrackAdd}>Add Track </Button>
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
            instrument: INSTRUMENTS[0]
        }
    }

    /**
     * Update State with available datasets
     * @private
     */
    _getAvailableDatasets() {
        const styleType = this.state.currentTab;
        let availableDatasets = mapDataSource.getDatasets();

        // Filter out datasets that have no fields that accommodate the style type
        switch (styleType) {
            case 'category':
                availableDatasets = availableDatasets.filter((dataset) => mapDataSource.accommodatesType(dataset.id, 'category'));
                break;
            case 'choropleth':
            case 'range':
                availableDatasets = availableDatasets.filter((dataset) => mapDataSource.accommodatesType(dataset.id, 'numeric'));
                break;
        }
        let defaultDataset = availableDatasets[0];

        this.setState(
            {
                availableDatasets: availableDatasets,
                dataset: defaultDataset,
            },
            this._getAvailableFields(defaultDataset));
    }

    /**
     * Update State with available fields from `dataset`
     * @param {obj} dataset - carto dataset
     * @private
     */
    _getAvailableFields(dataset) {
        const styleType = this.state.currentTab;
        let fields = [],
            currentField;

        // Filter fields based on style method
        switch (styleType) {
            case 'category':
                fields = dataset.fields.filter((field) => field.type === 'category');
                break;
            case 'choropleth':
            case 'range':
                fields = dataset.fields.filter((field) => field.type === 'numeric');
                break;
            default:
                fields = dataset.fields;
        }

        // Currently just using the first field as the default one.
        currentField = fields[0];
        this.setState(
            {
                availableFields: fields,
                field: currentField,
            },
            () => {
                this.props.updateTrack(this.props.trackNumber, this.state);
            }
        )
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
            }
        };

        let trackNum = this.props.trackNumber;

        if (this.state.dataset && this.state.field) {
            return (
                <div className="track-menu-item" style={style.menuItem}>
                    <h3>Track {trackNum + 1}</h3>
                    <ToolTip style={style.deleteButton} title={"Delete Track"}>
                        <IconButton onClick={this.props.onDelete}><DeleteIcon/></IconButton>
                    </ToolTip>
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
                        <InputLabel htmlFor={`field-${trackNum}`}>Field</InputLabel>
                        <Select
                            native
                            value={this.state.field.id}
                            onChange={this.handleChange('field')}
                            input={<Input id={`field-${trackNum}`}/>}
                        >
                            {this.state.availableFields.map((field, i) => {
                                return <option key={i.toString()}
                                               value={field.id}>{field.name}</option>
                            })}
                        </Select>
                    </FormControl>

                    <br/>

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


                </div>
            );
        } else {
            return null;
        }
    }
}

export default TrackMenu;


