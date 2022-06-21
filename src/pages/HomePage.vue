<template>
  <div id="map">
    <tool-search />
    <app-nav />
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
  </div>
</template>

<script>
import ToolSearch from "../components/ToolSearch.vue";
import AppNav from "../components/AppNav.vue";
import { mapActions, mapGetters } from "vuex";
import "ol/ol.css";
import Feature from "ol/Feature";
import { Circle as CircleStyle, Icon } from "ol/style";
import { Cluster, Vector as VectorSource } from "ol/source";
import { LineString, Point, Polygon } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { createEmpty, getWidth, extend } from "ol/extent";
import monotoneChainConvexHull from "monotone-chain-convex-hull";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style, Text } from "ol/style";
import DistrictApi from "../api/DistrictApi";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import home from "../assets/home.png";

export default {
  name: "HomePage",
  components: {
    ToolSearch,
    AppNav,
  },
  data() {
    return {
      loadingData: false,
    };
  },
  mounted() {
    this.initMap();

    const LEVEL_MAP_SWITCH_TINH_TO_HUYEN = 10;

    this.map.on("loadstart", () => {
      this.map.getTargetElement().classList.add("spinner");
    });
    this.map.on("loadend", () => {
      !this.loadingData &&
        this.map.getTargetElement().classList.remove("spinner");
    });

    const getText = function (feature, resolution, text) {
      const type = "wrap";
      const maxResolution = "4800";
      if (text === null) {
        if (feature.get("ten_huyen")) {
          text = `Huyện ${feature.get("ten_huyen")}`;
        } else if (feature.get("ten_tinh")) {
          text = `Tỉnh ${feature.get("ten_tinh")}`;
        }
      }

      if (resolution > maxResolution) {
        text = "";
      } else if (type == "wrap" && "point" != "line") {
        text = stringDivider(text, 16, "\n");
      }

      return text;
    };

    const createTextStyle = function (
      feature,
      resolution,
      sizeText,
      Y,
      fill,
      type,
    ) {
      const align = "center";
      const baseline = "middle";
      const size = sizeText;
      const height = "1";
      const offsetX = 0;
      const offsetY = Y;
      const weight = "bold";
      const placement = "point";
      const maxAngle = 0.7853981633974483;
      const overflow = false;
      const rotation = 0;

      const font = weight + " " + size + "/" + height + " " + "Arial";
      const fillColor = fill;
      const outlineColor = "white";
      const outlineWidth = 3;

      return new Text({
        textAlign: align == "" ? undefined : align,
        textBaseline: baseline,
        font: font,
        text:
          type === "point"
            ? getText(feature, resolution, feature.get("persons").toString())
            : getText(feature, resolution, null),
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: outlineColor, width: outlineWidth }),
        offsetX: offsetX,
        offsetY: offsetY,
        placement: placement,
        maxAngle: maxAngle,
        overflow: overflow,
        rotation: rotation,
      });
    };

    // Polygons
    // function polygonStyleFunction(feature, resolution) {
    //   return new Style({
    //     stroke: new Stroke({
    //       color: "blue",
    //       width: 1,
    //     }),
    //     fill: new Fill({
    //       color: "rgba(0, 0, 255, 0.1)",
    //     }),
    //     text: createTextStyle(
    //       feature,
    //       resolution,
    //       "10px",
    //       "20",
    //       "blue",
    //       "polygon",
    //     ),
    //     image: new CircleStyle({
    //       radius: 20,
    //       fill: null,
    //       stroke: new Stroke({ color: "red", width: 1 }),
    //     }),
    //   });
    // }
    //points
    const pointStyleFunction = (feature, resolution) => {
      return new Style({
        image: new CircleStyle({
          radius: 25,

          fill: new Fill({
            color: "rgba(255,0,0,0.2)",
          }),
          stroke: new Stroke({ color: "red", width: 1 }),
        }),
        text: createTextStyle(feature, resolution, "12px", "0", "red", "point"),
      });
    };

    // const vectorTinh = new VectorLayer({
    //   source: new VectorSource({
    //     url: "http://localhost:8090/geoserver/hoang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hoang%3Adia_phan_tinh&outputFormat=application%2Fjson",
    //     format: new GeoJSON(),
    //   }),
    //   style: polygonStyleFunction,
    //   maxZoom: LEVEL_MAP_SWITCH_TINH_TO_HUYEN,
    // });

    // const vectorHuyen = new VectorLayer({
    //   source: new VectorSource({
    //     url: "http://localhost:8090/geoserver/hoang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hoang%3Adia_phan_huyen&outputFormat=application%2Fjson",
    //     format: new GeoJSON(),
    //   }),
    //   minZoom: LEVEL_MAP_SWITCH_TINH_TO_HUYEN,
    //   style: polygonStyleFunction,
    // });
    const hc = new TileLayer({
      source: new TileWMS({
        url: "http://localhost:8090/geoserver/hoang/wms",
        params: { LAYERS: "hoang:HC", tiled: true },
      }),
    });
    const centroidHuyen = new VectorLayer({
      source: new VectorSource({
        url: "http://localhost:8090/geoserver/hoang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hoang%3Acentroid_huyen&outputFormat=application%2Fjson",
        format: new GeoJSON(),
      }),
      minZoom: LEVEL_MAP_SWITCH_TINH_TO_HUYEN,
      style: pointStyleFunction,
    });
    const centroidTinh = new VectorLayer({
      source: new VectorSource({
        url: "http://localhost:8090/geoserver/hoang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hoang%3Acentroid_tinh&outputFormat=application%2Fjson",
        format: new GeoJSON(),
      }),
      style: pointStyleFunction,
      maxZoom: LEVEL_MAP_SWITCH_TINH_TO_HUYEN,
    });

    // this.map.addLayer(vectorTinh);
    this.map.addLayer(hc);
    this.map.addLayer(centroidHuyen);
    this.map.addLayer(centroidTinh);

    // https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
    function stringDivider(str, width, spaceReplacer) {
      if (str.length > width) {
        let p = width;
        while (p > 0 && str[p] != " " && str[p] != "-") {
          p--;
        }
        if (p > 0) {
          let left;
          if (str.substring(p, p + 1) == "-") {
            left = str.substring(0, p + 1);
          } else {
            left = str.substring(0, p);
          }
          const right = str.substring(p + 1);
          return (
            left + spaceReplacer + stringDivider(right, width, spaceReplacer)
          );
        }
      }
      return str;
    }

    const circleDistanceMultiplier = 1;
    const circleFootSeparation = 28;
    const circleStartAngle = Math.PI / 2;

    const convexHullFill = new Fill({
      color: "rgba(255, 153, 0, 0.4)",
    });
    const convexHullStroke = new Stroke({
      color: "rgba(204, 85, 0, 1)",
      width: 1.5,
    });
    const outerCircleFill = new Fill({
      color: "rgba(255, 153, 102, 0.3)",
    });
    const innerCircleFill = new Fill({
      color: "rgba(255, 165, 0, 0.7)",
    });
    const textFill = new Fill({
      color: "#fff",
    });
    const textStroke = new Stroke({
      color: "rgba(0, 0, 0, 0.6)",
      width: 3,
    });
    const innerCircle = new CircleStyle({
      radius: 14,
      fill: innerCircleFill,
    });
    const outerCircle = new CircleStyle({
      radius: 20,
      fill: outerCircleFill,
    });
    const darkIcon = new Icon({
      src: "https://openlayers.org/en/latest/examples/data/icons/emoticon-cool.svg",
    });
    const lightIcon = new Icon({
      src: home,
    });

    //   // /**
    //   //  * Single feature style, users for clusters with 1 feature and cluster circles.
    //   //  * @param {Feature} clusterMember A feature from a cluster.
    //   //  * @return {Style} An icon style for the cluster member's location.
    //   //  */
    function clusterMemberStyle(clusterMember) {
      return new Style({
        geometry: clusterMember.getGeometry(),
        image: clusterMember.get("LEISTUNG") > 5 ? darkIcon : lightIcon,
      });
    }

    let clickFeature, clickResolution;
    //   // /**
    //   //  * Style for clusters with features that are too close to each other, activated on click.
    //   //  * @param {Feature} cluster A cluster with overlapping members.
    //   //  * @param {number} resolution The current view resolution.
    //   //  * @return {Style} A style to render an expanded view of the cluster members.
    //   //  */
    function clusterCircleStyle(cluster, resolution) {
      if (cluster !== clickFeature || resolution !== clickResolution) {
        return;
      }
      const clusterMembers = cluster.get("features");
      const centerCoordinates = cluster.getGeometry().getCoordinates();
      return generatePointsCircle(
        clusterMembers.length,
        cluster.getGeometry().getCoordinates(),
        resolution,
      ).reduce((styles, coordinates, i) => {
        const point = new Point(coordinates);
        const line = new LineString([centerCoordinates, coordinates]);
        styles.unshift(
          new Style({
            geometry: line,
            stroke: convexHullStroke,
          }),
        );
        styles.push(
          clusterMemberStyle(
            new Feature({
              ...clusterMembers[i].getProperties(),
              geometry: point,
            }),
          ),
        );
        return styles;
      }, []);
    }

    //   // /**
    //   //  * From
    //   //  * https://github.com/Leaflet/Leaflet.markercluster/blob/31360f2/src/MarkerCluster.Spiderfier.js#L55-L72
    //   //  * Arranges points in a circle around the cluster center, with a line pointing from the center to
    //   //  * each point.
    //   //  * @param {number} count Number of cluster members.
    //   //  * @param {Array<number>} clusterCenter Center coordinate of the cluster.
    //   //  * @param {number} resolution Current view resolution.
    //   //  * @return {Array<Array<number>>} An array of coordinates representing the cluster members.
    //   //  */
    function generatePointsCircle(count, clusterCenter, resolution) {
      const circumference =
        circleDistanceMultiplier * circleFootSeparation * (2 + count);
      let legLength = circumference / (Math.PI * 2); //radius from circumference
      const angleStep = (Math.PI * 2) / count;
      const res = [];
      let angle;

      legLength = Math.max(legLength, 10000) * resolution; // Minimum distance to get outside the cluster icon.

      for (let i = 0; i < count; ++i) {
        // Clockwise, like spiral.
        angle = circleStartAngle + i * angleStep;
        res.push([
          clusterCenter[0] + legLength * Math.cos(angle),
          clusterCenter[1] + legLength * Math.sin(angle),
        ]);
      }

      return res;
    }

    //   let hoverFeature;
    //   // /**
    //   //  * Style for convex hulls of clusters, activated on hover.
    //   //  * @param {Feature} cluster The cluster feature.
    //   //  * @return {Style} Polygon style for the convex hull of the cluster.
    //   //  */
    function clusterHullStyle(cluster) {
      if (cluster !== hoverFeature) {
        return;
      }
      const originalFeatures = cluster.get("features");
      const points = originalFeatures.map(feature =>
        feature.getGeometry().getCoordinates(),
      );
      return new Style({
        geometry: new Polygon([monotoneChainConvexHull(points)]),
        fill: convexHullFill,
        stroke: convexHullStroke,
      });
    }

    function clusterStyle(feature) {
      const size = feature.get("features").length;
      if (size > 1) {
        return [
          new Style({
            image: outerCircle,
          }),
          new Style({
            image: innerCircle,
            text: new Text({
              text: size.toString(),
              fill: textFill,
              stroke: textStroke,
            }),
          }),
        ];
      } else {
        const originalFeature = feature.get("features")[0];
        return clusterMemberStyle(originalFeature);
      }
    }

    let preFeatureHuyen = null;
    let preFeatureTinh = null;
    let clusterHulls,
      clusters,
      clusterCircles = null;
    this.map.on("click", event => {
      try {
        if (this.map.getView().getZoom() > LEVEL_MAP_SWITCH_TINH_TO_HUYEN) {
          centroidHuyen.getFeatures(event.pixel).then(async features => {
            if (features.length > 0) {
              if (preFeatureHuyen === features[0]) return;
              preFeatureHuyen = features[0];
              const center = features[0].get("geometry").flatCoordinates;

              this.map.getView().animate({
                center: center,
                duration: 1000,
                zoom: LEVEL_MAP_SWITCH_TINH_TO_HUYEN + 2,
              });

              this.map.getTargetElement().classList.add("spinner");
              this.loadingData = true;

              const objectid = features[0].get("objectid");
              const res = await DistrictApi.getPontInDistrict({ objectid });

              const vectorSource = new VectorSource();
              const format = new GeoJSON();
              for (let i = 0; i < res.length; i++) {
                const featuresPoint = format.readFeature(res[i].geojson);
                featuresPoint.getGeometry().transform("EPSG:4326", "EPSG:3857");
                vectorSource.addFeature(featuresPoint);
              }
              const clusterSource = new Cluster({
                distance: 35,
                source: vectorSource,
              });

              if (clusterHulls) this.map.removeLayer(clusterHulls);
              if (clusters) this.map.removeLayer(clusters);
              if (clusterCircles) this.map.removeLayer(clusterCircles);

              // Layer displaying the convex hull of the hovered cluster.
              clusterHulls = new VectorLayer({
                source: clusterSource,
                style: clusterHullStyle,
              });

              // Layer displaying the clusters and individual features.
              clusters = new VectorLayer({
                source: clusterSource,
                style: clusterStyle,
              });

              // Layer displaying the expanded view of overlapping cluster members.
              clusterCircles = new VectorLayer({
                source: clusterSource,
                style: clusterCircleStyle,
              });

              this.map.addLayer(clusterHulls);
              this.map.addLayer(clusters);
              this.map.addLayer(clusterCircles);

              this.map.getTargetElement().classList.remove("spinner");
              this.loadingData = false;

              this.map.on("click", event => {
                clusters.getFeatures(event.pixel).then(features => {
                  if (features.length > 0) {
                    const clusterMembers = features[0].get("features");
                    if (clusterMembers.length > 1) {
                      // Calculate the extent of the cluster members.
                      const extent = createEmpty();
                      clusterMembers.forEach(feature =>
                        extend(extent, feature.getGeometry().getExtent()),
                      );
                      const view = this.map.getView();
                      const resolution = this.map.getView().getResolution();
                      if (
                        view.getZoom() === view.getMaxZoom() ||
                        (getWidth(extent) < resolution &&
                          getWidth(extent) < resolution)
                      ) {
                        // Show an expanded view of the cluster members.
                        clickFeature = features[0];
                        clickResolution = resolution;
                        clusterCircles.setStyle(clusterCircleStyle);
                      } else {
                        // Zoom to the extent of the cluster members.
                        view.fit(extent, {
                          duration: 1000,
                          padding: [50, 50, 50, 50],
                        });
                      }
                    }
                  }
                });
              });
              this.map.on("pointermove", event => {
                clusters.getFeatures(event.pixel).then(features => {
                  if (features[0] !== hoverFeature) {
                    // Display the convex hull on hover.
                    hoverFeature = features[0];
                    clusterHulls.setStyle(clusterHullStyle);
                    // Change the cursor style to indicate that the cluster is clickable.
                    this.map.getTargetElement().style.cursor =
                      hoverFeature && hoverFeature.get("features").length > 1
                        ? "pointer"
                        : "";
                  }
                });
              });
            }
          });
        } else {
          centroidTinh.getFeatures(event.pixel).then(features => {
            if (features.length > 0) {
              const center = features[0].get("geometry").flatCoordinates;
              if (preFeatureTinh === features[0]) return;

              this.map.getView().animate({
                center: center,
                duration: 1000,
                zoom: LEVEL_MAP_SWITCH_TINH_TO_HUYEN + 1,
              });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    });

    let hoverFeature = null;

    this.map.on("pointermove", event => {
      this.map.getView().getZoom() <= LEVEL_MAP_SWITCH_TINH_TO_HUYEN &&
        centroidTinh.getFeatures(event.pixel).then(features => {
          this.map.getTargetElement().style.cursor =
            features.length > 0 ? "pointer" : "";
        });
    });
    this.map.on("pointermove", event => {
      this.map.getView().getZoom() > LEVEL_MAP_SWITCH_TINH_TO_HUYEN &&
        centroidHuyen.getFeatures(event.pixel).then(features => {
          this.map.getTargetElement().style.cursor =
            features.length > 0 ? "pointer" : "";
        });
    });
  },

  methods: {
    ...mapActions(["initMap"]),
  },
  computed: {
    ...mapGetters(["map"]),
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

.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner:after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  border-radius: 50%;
  border: 5px solid rgba(180, 180, 180, 0.6);
  border-top-color: rgba(0, 0, 0, 0.6);
  animation: spinner 0.6s linear infinite;
}
</style>
