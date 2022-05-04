<template>
  <div id="map">
    <tool-search />
    <app-nav />
  </div>
</template>

<script>
import ToolSearch from "../components/ToolSearch.vue";
import AppNav from "../components/AppNav.vue";
import { mapActions } from "vuex";

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
    this.initMap();
  },
  methods: {
    ...mapActions(["initMap"]),
  },
};
</script>

<style scoped>
@import "ol/ol.css";
#map {
  position: relative;
  height: calc(100vh - 129px);
  width: 100%;
}
</style>
