import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
import OSM from "ol/source/OSM";
import Overlay from "ol/Overlay";
// import GeoJSON from "ol/format/GeoJSON";
// import { Fill, Stroke, Style, Text } from "ol/style";
// import { OSM, Vector as VectorSource } from "ol/source";
// import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";

const mapModule = {
  state: {
    map: null,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      // new TileLayer({
      //   source: new TileWMS({
      //     url: "http://localhost:8090/geoserver/hoang/wms",
      //     params: { LAYERS: "hoang:dia_phan_tinh", tiled: true },
      //   }),
      //   maxZoom: 9,
      // }),
      // new TileLayer({
      //   source: new TileWMS({
      //     url: "http://localhost:8090/geoserver/hoang/wms",
      //     params: { LAYERS: "hoang:dia_phan_huyen", tiled: true },
      //   }),
      //   minZoom: 9,
      // }),
      // new TileLayer({
      //   source: new TileWMS({
      //     url: "http://localhost:8090/geoserver/hoang/wms",
      //     params: { LAYERS: "hoang:pofw", tiled: true },
      //   }),
      // }),
    ],
    overlay: null,
  },
  getters: {
    map: state => state.map,
  },
  actions: {
    initMap(context) {
      const map = new Map({
        target: "map",
        view: new View({
          zoom: 9,
          center: [11781474.417420888, 2415619.3084370033],
          constrainResolution: true,
        }),
      });
      context.commit("setMap", map);
      context.state.map.setLayers(context.state.layers);

      // ----------------------- event click -------------
      const container = document.getElementById("popup");
      // const content = document.getElementById("popup-content");
      const closer = document.getElementById("popup-closer");

      const overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      context.commit("setOverlay", overlay);
      context.state.map.addOverlay(overlay);

      closer.onclick = function () {
        context.state.overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      //   context.state.map.on("click", evt => {
      //     context.state.overlay.setPosition(undefined);
      //     const coordinate = evt.coordinate;
      //     const resolution = context.state.map.getView().getResolution();
      //     const projection = context.state.map.getView().getProjection();
      //     let url;
      //     url = context.state.map
      //       .getAllLayers()[2]
      //       .getSource()
      //       .getFeatureInfoUrl(coordinate, resolution, projection, {
      //         INFO_FORMAT: "application/json",
      //       });
      //     // Họ tên
      //     // Năm sinh
      //     // Quê quán
      //     // Năm nhiễm bệnh
      //     // Tình trạng hiện thời
      //     // Ghi chú

      //     if (url) {
      //       fetch(url)
      //         .then(response => response.json())
      //         .then(data => {
      //           if (data.features.length == 0) return;
      //           try {
      //             content.innerHTML =
      //               "<b>ID</b>: 1 " +
      //               // data.features[0].properties.name +
      //               "<br> <b>Họ và tên</b>: Nguyễn Văn A" +
      //               // data.features[0].properties.start_date +
      //               "<br> <b>Quê quán</b>: Bắc Từ Liêm, Hà Nội" +
      //               // data.features[0].properties.end_date +
      //               "<br> <b>Năm nhiễm bệnh</b>: 2018" +
      //               "<br> <b>Tình trạng hiện thời: </b>: Ổn định" +
      //               "<br> <b>Ghi chú: </b>: Không";
      //             // data.features[0].properties.description;
      //             context.state.overlay.setPosition(coordinate);
      //           } catch (err) {
      //             return;
      //           }
      //         });
      //     }
      //   });
    },
  },
  mutations: {
    setMap: (state, map) => {
      state.map = map;
    },
    setOverlay: (state, overlay) => {
      state.overlay = overlay;
    },
  },
};

export default mapModule;
