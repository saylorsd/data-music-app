/**
 * Created by sds25 on 9/15/17.
 */

import React, {Component} from 'react';
import {Map, TileLayer, GeoJSON} from 'react-leaflet';

/* Material UI Components*/

/* Functions */
import {getCartoTiles, getHood} from './mapUtils'
import {BASEMAPS} from './mapDefaults'

/* Constants */
const mapDefaults = {
    position: [40.438340, -79.961884],
    zoom: 13,
    maxZoom: 16
};


const DEFAULT_BASEMAP = BASEMAPS['voyager'];

export class MapContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            styleLayer: null,
            selectedShape: null,
            baseMap: <TileLayer className="new-basemap" url={DEFAULT_BASEMAP.url}
                                attribute={DEFAULT_BASEMAP.attribution}/>,
        };

        this.handleClick = this.handleClick.bind(this);
        this.updateBasemap = this.updateBasemap.bind(this);
        this.updateStyleLayer = this.updateStyleLayer.bind(this);
    }

    updateBasemap(i) {
        let basemap = BASEMAPS[i];
        this.setState({baseMap: null});
        this.setState({
            baseMap: <TileLayer className="new-basemap" url={basemap.url} attribute={basemap.attribution}/>
        });
        console.log(basemap);
        this.render();
    }


    /**
     * Runs when map is clicked.  It colors the selected parcel and then changes the parcelId for the entire map.
     * @param e
     */
    handleClick(e) {
        // Highlight the Parcel Polygon
        let sql = `SELECT hood, the_geom, the_geom_webmercator FROM pittsburgh_neighborhoods WHERE ST_Contains(the_geom, ST_SetSRID(ST_Point(${e.latlng.lng}, ${e.latlng.lat}), 4326))`;
        this.setState({selectedShape: null});   // Hacky fix that tricks react into rerendering the layer.  Aparently changing the `selectedShape` isn't enough.
        this.setState({
            selectedShape: <CartoLayer sql={sql}
                                       css="#layer {line-color: #00F; polygon-fill: #00F; polygon-opacity: 0.4}"/>
        });

        // Lift parcelId state up
        getHood(e.latlng)
            .then((hood) => {
                console.log(hood);
                this.props.updateHood(hood)
            });
    }

    handleHover(e) {
        console.log('hovering');
        getHood(e.latlng)
            .then((hood) => {
                console.log(hood)
            });
    }

    /**
     * Request new Carto tile layer styled with `css`
     * @param {string} sql - SQL query used to define map for style layer
     * @param {string} css - cartoCSS string used to style new layer
     */
    updateStyleLayer(sql, css) {
        console.log(sql);
        console.log(css);

        this.setState({styleLayer: <CartoLayer sql={sql} css={css}/>});
    }

    render() {
        const style = {
            base: {
                position: 'relative',
            },
            map: {
                height: '100%',
                cursor: 'pointer'
            }
        };
        return (
            <div style={style.base} className="mapContainer">
                <Map style={style.map}
                     center={mapDefaults.position}
                     zoom={mapDefaults.zoom}
                     maxZoom={mapDefaults.maxZoom}
                     onClick={this.handleClick}
                    //onMouseMove={this.handleHover}
                >
                    {this.state.baseMap}
                    {this.state.selectedShape}

                    <CartoLayer sql="SELECT * FROM pittsburgh_neighborhoods"
                                css={`
                                #layer {
                                      polygon-fill: #2E5387;
                                      polygon-opacity: 0.4;
                                    }
                                    #layer::outline {
                                      line-width: 2;
                                      line-color: #FFF;
                                      line-opacity: 1;
                                    }
                                    #layer::labels {
                                      text-name: [hood];
                                      text-face-name: 'DejaVu Sans Book';
                                      text-size: 10;
                                      text-fill: #000;
                                      text-label-position-tolerance: 0;
                                      text-halo-radius: 1;
                                      text-halo-fill: #FFF;
                                      text-dy: -10;
                                      text-allow-overlap: true;
                                      text-placement: point;
                                      text-placement-type: dummy;
                                }`}
                    />
                </Map>
            </div>
        );
    }
}


/*******************************************************
 * CUSTOM MAP LAYERS
 *******************************************************/
class CartoLayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sql: this.props.sql,
            css: this.props.css,
            tiles: ''
        };
        this.setTiles = this.setTiles.bind(this);
    }

    componentDidMount() {
        this.setTiles();
    }


    /**
     * Collects tiles from Carto and loads them into component
     */
    setTiles() {
        getCartoTiles(this.state.sql, this.state.css)
            .then((tileUrl) => {
                this.setState({tiles: tileUrl})
            }, (err) => {
                console.log(err);
            })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sql !== this.props.sql || nextProps.css !== this.props.css) {
            this.setState({sql: nextProps.sql, css: nextProps.css}, this.setTiles)
        }
    }


    render() {
        const tiles = this.state.tiles;

        if (tiles === null)
            return null;

        return <TileLayer url={tiles}/>

    }
}
