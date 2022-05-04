import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import OSM from "ol/source/OSM";

const mapModule = {
  state: {
    map: null,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8090/geoserver/hoang/wms",
          params: { LAYERS: "hoang:dia_phan_tinh", tiled: true },
        }),
      }),
      new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8090/geoserver/hoang/wms",
          params: { LAYERS: "hoang:pofw", tiled: true },
        }),
      }),
    ],
  },
  getters: {
    map: state => state.map,
  },
  actions: {
    initMap(context) {
      const map = new Map({
        target: "map",
        view: new View({
          zoom: 10,
          center: [11781474.417420888, 2415619.3084370033],
          constrainResolution: true,
        }),
      });
      context.commit("setMap", map);
      context.state.map.setLayers(context.state.layers);
    },
  },
  mutations: {
    setMap: (state, map) => {
      state.map = map;
    },
  },
};

export default mapModule;
