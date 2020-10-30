// import logo from './logo.svg';
import "./App.css";
import MapGL, { Layer, Source } from "react-map-gl";
import React from "react";
import { render } from "react-dom";
require("mapbox-gl/dist/mapbox-gl.css");

const lineLayer = {
  type: "line",
  paint: {
    "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1.5, 10, 3],
    "line-color": "green",
    "line-blur": 0.5,
    "line-opacity": 0.6
  },
  layout: {
    "line-join": "round"
  }
};


export default class App extends React.Component {
  state = {
    mapStyle: "",
    lineFeature: {
      type: "LineString",
      coordinates: [
        [-97, 30],
        [-97.1, 30.2],
      ],
    },
    viewport: {
      latitude: 31.1,
      longitude: -97.4,
      zoom: 6,
      bearing: 0,
      pitch: 0,
    },
    interactiveLayerIds: [],
  };

  animation = null;

  isPaused = true;

  _onViewportChange = (viewport) => this.setState({ viewport });

  animatePoint = () => {
    const { coordinates } = this.state.lineFeature
    const lastX = coordinates[coordinates.length-1][0]
    const lastY = coordinates[coordinates.length-1][1]
    const incrementX = (Math.random() - 0.5) / (Math.random() + 10)
    const incrementY = (Math.random() - 0.5) / (Math.random() + 10)
    const newX = lastX + incrementX
    const newY = lastY + incrementY
    this.setState({
      lineFeature: {
        type: "LineString",
        coordinates: [
          ...this.state.lineFeature.coordinates,
          [newX, newY]
        ],
      },
    });

    this.animation = window.requestAnimationFrame(this.animatePoint);
  };

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animation);
  }

  componentDidMount() {
    this.animatePoint();
    this.setState(this.state)
  }

  render() {
    const { viewport, lineFeature } = this.state;
    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        containerStyle={{
          height: "100vh",
          width: "100vw",
        }}
        scrollZoom={true}
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={
          process.env.REACT_APP_MAPBOX_TOKEN
        }
      >
        {lineFeature && (
          <Source type="geojson" data={lineFeature}>
            <Layer {...lineLayer}></Layer>
          </Source>
        )}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
