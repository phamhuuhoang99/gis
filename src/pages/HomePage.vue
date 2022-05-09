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
// import { bbox as bboxStrategy } from "ol/loadingstrategy";
import monotoneChainConvexHull from "monotone-chain-convex-hull";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style, Text } from "ol/style";
// import Select from "ol/interaction/Select";
// import { click } from "ol/events/condition";
import DistrictApi from "../api/DistrictApi";

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

    const getText = function (feature, resolution) {
      const type = "wrap";
      const maxResolution = "4800";
      let text = "";
      if (feature.get("ten_huyen")) {
        text = `Huyện ${feature.get("ten_huyen")}`;
      } else if (feature.get("ten_tinh")) {
        text = `Tỉnh ${feature.get("ten_tinh")}`;
      }
      text += `: ${feature.get("persons")} người`;

      if (resolution > maxResolution) {
        text = "";
      } else if (type == "wrap" && "point" != "line") {
        text = stringDivider(text, 16, "\n");
      }

      return text;
    };

    const createTextStyle = function (feature, resolution) {
      const align = "center";
      const baseline = "middle";
      const size = "10px";
      const height = "1";
      const offsetX = 0;
      const offsetY = 0;
      const weight = "bold";
      const placement = "point";
      const maxAngle = 0.7853981633974483;
      const overflow = false;
      const rotation = 0;

      const font = weight + " " + size + "/" + height + " " + "Arial";
      const fillColor = "blue";
      const outlineColor = "white";
      const outlineWidth = 3;

      return new Text({
        textAlign: align == "" ? undefined : align,
        textBaseline: baseline,
        font: font,
        text: getText(feature, resolution),
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
    function polygonStyleFunction(feature, resolution) {
      return new Style({
        stroke: new Stroke({
          color: "blue",
          width: 1,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
        text: createTextStyle(feature, resolution),
      });
    }

    const vectorTinh = new VectorLayer({
      source: new VectorSource({
        url: "http://localhost:8090/geoserver/hoang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hoang%3Adia_phan_tinh&outputFormat=application%2Fjson",
        format: new GeoJSON(),
      }),
      style: polygonStyleFunction,
      maxZoom: 9,
    });

    const vectorHuyen = new VectorLayer({
      source: new VectorSource({
        url: "http://localhost:8090/geoserver/hoang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hoang%3Adia_phan_huyen&outputFormat=application%2Fjson",
        format: new GeoJSON(),
      }),
      minZoom: 9,
      style: polygonStyleFunction,
    });

    this.map.addLayer(vectorHuyen);
    this.map.addLayer(vectorTinh);

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
    // let select = null; // ref to curren
    // const selected = new Style({
    //   // fill: new Fill({
    //   //   color: "#eeeeee",
    //   // }),
    //   stroke: new Stroke({
    //     color: "rgba(200,20,20,0.8)",
    //     width: 2,
    //   }),
    // });
    // // function selectStyle(feature) {
    // // const color = feature.get("COLOR") || "#eeeeee";
    // // selected.getFill().setColor(color);
    // // return selected;
    // //}
    // const selectClick = new Select({
    //   style: selected,
    //   layers: [vectorHuyen],
    //   condition: click,
    // });

    // select = selectClick;
    // if (select !== null) {
    //   this.map.addInteraction(select);
    // }
    // let preselect = null;
    // select.on("select", async e => {
    //   const objectid = e.selected[0].get("objectid");
    //   console.log("click");
    //   if (objectid === preselect) return;
    //   preselect = objectid;

    //   const res = await DistrictApi.getPontInDistrict({ objectid });

    //   const vectorSource = new VectorSource();
    //   const format = new GeoJSON();
    //   for (let i = 0; i < res.length; i++) {
    //     const featuresPoint = format.readFeature(res[i].geojson);
    //     // featuresPoint.setStyle(style);
    //     featuresPoint.getGeometry().transform("EPSG:4326", "EPSG:3857");
    //     vectorSource.addFeature(featuresPoint);
    //   }

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
      src: "https://covidmaps.hanoi.gov.vn/upload/1002902/20210608/cach_ly_56b64e9436.png",
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

      legLength = Math.max(legLength, 35) * resolution; // Minimum distance to get outside the cluster icon.

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

    //   // const vectorSource = new VectorSource({
    //   //   format: new GeoJSON(),
    //   //   // url: function () {
    //   //   //   return "http://localhost:8090/geoserver/hoang/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=hoang:test&maxFeatures=1000000&outputFormat=application/json";
    //   //   // },
    //   // });

    //   this.map.on("click", event => {
    // clusters.getFeatures(event.pixel).then(features => {
    //   if (features.length > 0) {
    //     const clusterMembers = features[0].get("features");
    //     if (clusterMembers.length > 1) {
    //       // Calculate the extent of the cluster members.
    //       const extent = createEmpty();
    //       clusterMembers.forEach(feature =>
    //         extend(extent, feature.getGeometry().getExtent()),
    //       );
    //       const view = this.map.getView();
    //       const resolution = this.map.getView().getResolution();
    //       if (
    //         view.getZoom() === view.getMaxZoom() ||
    //         (getWidth(extent) < resolution && getWidth(extent) < resolution)
    //       ) {
    //         // Show an expanded view of the cluster members.
    //         clickFeature = features[0];
    //         clickResolution = resolution;
    //         clusterCircles.setStyle(clusterCircleStyle);
    //       } else {
    //         // Zoom to the extent of the cluster members.
    //         view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
    //       }
    //     }
    //   }
    // });
    // });
    // });
    this.map.on("click", event => {
      try {
        if (this.map.getView().getZoom() >= 10) {
          vectorHuyen.getFeatures(event.pixel).then(async features => {
            if (features.length > 0) {
              const _extend = features[0].get("geometry");
              // console.log(extend);

              this.map.getView().fit(_extend, this.map.getSize());

              const objectid = features[0].get("objectid");
              const res = await DistrictApi.getPontInDistrict({ objectid });

              const vectorSource = new VectorSource();
              const format = new GeoJSON();
              for (let i = 0; i < res.length; i++) {
                const featuresPoint = format.readFeature(res[i].geojson);
                // featuresPoint.setStyle(style);
                featuresPoint.getGeometry().transform("EPSG:4326", "EPSG:3857");
                vectorSource.addFeature(featuresPoint);
              }
              const clusterSource = new Cluster({
                attributions:
                  'Data: <a href="https://www.data.gv.at/auftritte/?organisation=stadt-wien">Stadt Wien</a>',
                distance: 35,
                source: vectorSource,
              });

              //   // // Layer displaying the convex hull of the hovered cluster.
              const clusterHulls = new VectorLayer({
                source: clusterSource,
                style: clusterHullStyle,
              });

              //   // // Layer displaying the clusters and individual features.
              const clusters = new VectorLayer({
                source: clusterSource,
                style: clusterStyle,
              });

              //   // // Layer displaying the expanded view of overlapping cluster members.
              const clusterCircles = new VectorLayer({
                source: clusterSource,
                style: clusterCircleStyle,
              });

              this.map.addLayer(clusterHulls);
              this.map.addLayer(clusters);
              this.map.addLayer(clusterCircles);

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
                          duration: 500,
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
        }
      } catch (err) {
        console.log(err);
      }
    });

    let hoverFeature = null;

    this.map.on("pointermove", event => {
      vectorHuyen.getFeatures(event.pixel).then(features => {
        if (features[0] !== hoverFeature) {
          // Display the convex hull on hover.
          hoverFeature = features[0];
          this.map.getTargetElement().style.cursor =
            hoverFeature && this.map.getView().getZoom() >= 10 ? "pointer" : "";
        }
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
</style>
