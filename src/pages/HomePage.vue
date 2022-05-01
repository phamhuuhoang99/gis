<template>
  <div id="map">
    <tool-search />
    <app-nav />
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";

import ToolSearch from "../components/ToolSearch.vue";
import AppNav from "../components/AppNav.vue";

export default {
  name: "HomePage",
  components: {
    ToolSearch,
    AppNav,
  },
  data() {
    return {};
  },
  mounted() {
    new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: "map",
      view: new View({
        zoom: 6,
        center: [11781474.417420888, 1815619.3084370033],
      }),
    });
  },
};
</script>

<style scoped>
#map {
  position: relative;
  height: calc(100vh - 129px);
  width: 100%;
}
</style>
