<template>
  <div class="header">
    <h2 class="header__title">
      HỆ THỐNG DỮ LIỆU KHÔNG GIAN DÂN SỐ VÀ PHÁT TRIỂN
    </h2>
    <div class="header__menu">
      <div class="header__menu_left">
        <ul class="nav">
          <li class="nav-item">
            <a class="active"> Trang chủ</a>
          </li>
          <li class="nav-item">
            <a>Giới thiệu</a>
          </li>
          <li class="nav-item"><a> Khái niệm</a></li>
          <li class="nav-item"><a>Ấn phẩm</a></li>
          <li class="nav-item"><a>Dữ liệu</a></li>
          <li class="nav-item"><a>Hướng dẫn</a></li>
        </ul>
      </div>
      <div class="header__menu_right">
        <div class="search">
          <!-- <div class="wrapper__input_container"> -->
          <!-- <input type="text" class="search__input" placeholder="Tìm kiếm" /> -->
          <v-autocomplete
            v-model="search"
            :items="items"
            item-text="ten_tinh"
            class="rounded-0"
            dense
            outlined
            hide-details
            hide-no-data
            append-icon=""
            clearable
            @change="handleChange"
            return-object
          />
          <!-- </div> -->
          <div class="icon">
            <v-icon color="white">mdi-magnify</v-icon>
          </div>
        </div>
        <div class="others">
          <div class="login">
            <p>Đăng nhập</p>
          </div>
          <div class="lang">
            <button class="lang-vi">
              <img
                src="https://gis.gso.gov.vn/_nuxt/img/vi-rectangular-flag.9b8860e.jpg"
                alt=""
              />
            </button>
            <button class="lang-en">
              <img
                src="https://gis.gso.gov.vn/_nuxt/img/en-rectangular-flag.63f6589.jpg"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProvinceApi from "../api/ProvinceApi";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style, Circle } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { mapGetters } from "vuex";

export default {
  name: "AppHeader",
  async created() {
    try {
      const response = await ProvinceApi.getAll();
      this.items = response;
    } catch (error) {
      console.log("Failed: ", error);
    }
  },
  data() {
    return {
      items: [],
      search: null,
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["map"]),
  },
  methods: {
    async handleChange(item) {
      if (item) {
        const layerOverLayer = this.map.getAllLayers()[3];
        if (layerOverLayer) this.map.removeLayer(layerOverLayer);

        const source = new VectorSource();

        const format = new GeoJSON();
        let style = new Style({
          fill: new Fill({
            color: "rgba(255,255,255,0.4)",
          }),
          stroke: new Stroke({
            color: "#53ffb3",
            width: 2,
          }),
          image: new Circle({
            radius: 4,
            fill: new Fill({
              color: "#53ffb3",
            }),
          }),
        });

        const res = await ProvinceApi.getPointInProvince(item);

        for (let i = 0; i < res.length; i++) {
          const featuresPoint = format.readFeature(res[i].geojson);
          featuresPoint.setStyle(style);
          featuresPoint.getGeometry().transform("EPSG:4326", "EPSG:3857");
          source.addFeature(featuresPoint);
        }

        const features = format.readFeatures(item.geojson);

        const polygon = features[0];

        const geom = polygon.getGeometry().transform("EPSG:4326", "EPSG:3857");

        const extend = geom.getExtent();

        source.addFeature(polygon);

        const vectorLayer = new VectorLayer({
          source: source,
        });

        this.map.addLayer(vectorLayer);
        this.map.getView().fit(extend, this.map.getSize());
      }
    },
  },
};
</script>

<style lang="css" scoped>
.v-text-field--outlined >>> fieldset {
  border: 2px solid #127bbf;
  color: #127bbf !important;
}
.header {
  display: flex;
  flex-direction: column;
}

.header__title {
  background-color: #1e799d;
  color: white;
  font-size: 30px;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.header__menu {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #1e799d;
}
.header__menu_left {
  flex: 1;
}
.nav {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  width: 100%;
  margin: 0;
  padding: 0;
}
.nav-item {
  padding: 10px;
  height: 48px;
  position: relative;
}
.nav-item a {
  font-size: 13px;
  text-decoration: none solid rgb(42, 115, 213);
  text-transform: uppercase;
  white-space: nowrap;
  font-weight: 700;
  padding: 0 0 0 5px;
  color: #0b1657;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.active,
a:hover {
  color: #2a73d5 !important;
}

a:hover:after,
.active:after {
  background: #2a73d5;
  content: "";
  height: 4px;
  left: 0;
  position: absolute;
  bottom: 0;
  width: 40%;
  margin: 0 auto;
  right: -18px;
  padding: 0 0 0 5px;
  display: flex;
  align-items: center;
}
.header__menu_right {
  flex: 1;
  display: flex;
}
.header__menu_right > .search {
  flex: 8;
  display: flex;
  align-items: center;
}
.wrapper__input_container {
  border: 2px solid #127bbf;
  width: 100%;
}
input {
  outline: none;
  padding: 4px 12px;
  width: 100%;
}
.icon {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #127bbf;
}

.header__menu_right > .others {
  flex: 4;
  display: flex;
}

.login {
  flex: 1;
  display: flex;
  justify-content: center;
  justify-content: center;
  height: 100%;
}

.login > p {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.lang {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lang button {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lang button:hover {
  background-color: rgba(0, 0, 0, 0.12);
  border-radius: 50%;
}

.lang button img {
  width: 30px;
  height: 20px;
}
</style>
