<template>
  <div class="nav">
    <div class="toolbar-right">
      <button v-if="!drawer" @click="drawer = true">
        <v-icon color="#127bbf">mdi-chevron-left</v-icon>
      </button>
    </div>
    <v-navigation-drawer
      v-model="drawer"
      width="275px"
      absolute
      right
      hide-overlay
    >
      <div class="nav__wrapper">
        <div class="header">
          <h5>TOÀN QUỐC</h5>
          <div class="img__wrapper">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMDSURBVHgB7dxhaiJBFEXh0uCiRHArY1Y2zlYEcVGNnckVBElUNFHrvXfPByHB/Ejad9TE7qrWAAAAAAAAAAAAAAAAAAAAAAAAAAAAgFvsdrs/+mimIhz/pHWiA9/v92t9/fb2tprP5/+akSjH3yWA04M/coog0vFPWwfDMHwLT3eIw8vBueHLOI5dHozdXgI2m81qOp3+/Xp75WeCS8OfTCbvi8Vi3TroFoA4RRBx+Ief3zpziCDq8A+/QwugcgSRh3/4PVoQFSOIPnwJE4BUiiDD8CVUAFIhgizDl3ABSOYIMg1fQgYgGSPINnwJG4BkiiDj8CV0AJIhgqzDl/ABSOQIMg9fUgQgESPIPnxJE4BEiqDC8CVVABIhgirDl3QBSM8IKg1fUgYgPSKoNnxJG4C8MoKKw5fUAcgrIqg6fEkfgDwzgsrDlxIByDMiqD58KROAPDICh+FLqQDkERG4DF/KBSC/icBp+FIyAPlJBG7Dl7IByD0ROA5fSgcgt0TgOnwpH4Bci0CfXYcvFgHIpQjOcRm+2AQgt0TgNHyxCkCuReA2fOmyP0BPs9ns49L3PsP4aGasngEu/bV/ym27GpsAbhn+kVMEFi8B1/7PH8fx/evtLtvVSPlngFve5HHcruaodAD3vMPnGkHZAH7y9q5jBCUD+M17+24RlAvgESd2nCIoFcAjz+q5RFAmgGec0nWIoEQAzzyfXz2C9AG84mKOyhGkDuCVV/JUjSBtAD0u46oYQcoAel7DVy2CdAFEuICzUgSpAoh09W6VCNIEEPHS7QoRpAgg8nX72SMIH0CGRRuZIwgdQKYVO1kjCBtAxuVaGSMIGUDmtXrZIggXQIWFmpkiCBVApVW6WSIIE0DFJdoZIggRQOX1+dEj6B6Aw+YMkSPoGoDTzhxRI+gWgOO2LBEj6BKA85480SLosjh0GIZv4blszrBcLtfnFqR+3tblwdjtJeD0keC4M4f78R/oTthut6tmyv34AQAAAAAAAAAAAAAAAAAAAAAAAAAAcKf/oqlkMqVqWdUAAAAASUVORK5CYII="
              alt=""
              @click="onClickCloseDrawer"
            />
          </div>
        </div>
        <div class="widget-content">
          <div class="title">
            <p>
              <strong>Thống kê số lượng người khuyết tật </strong>(Đơn vị:
              Người)
            </p>
            <div class="img__wrapper">
              <img
                src="https://gis.gso.gov.vn/_nuxt/img/icon_note.2c4541e.png"
                alt=""
              />
            </div>
          </div>
          <chart-avg-population />
        </div>
        <div class="widget-content">
          <div class="title">
            <p>
              <strong>Thống kê số lượng người có nhu cầu hỗ trợ </strong>(Đơn
              vị: Người)
            </p>
            <div class="img__wrapper">
              <img
                src="https://gis.gso.gov.vn/_nuxt/img/icon_note.2c4541e.png"
                alt=""
              />
            </div>
          </div>
          <chart-age-index />
        </div>
        <div class="widget-content">
          <div class="title">
            <p>
              <strong>Thống kê số lượng đã phục hồi chức năng </strong>(Đơn vị:
              Người)
            </p>
            <div class="img__wrapper">
              <img
                src="https://gis.gso.gov.vn/_nuxt/img/icon_note.2c4541e.png"
                alt=""
              />
            </div>
          </div>
          <chart-avg-population />
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import ChartAvgPopulation from "../components/charts/ChartAvgPopulation.vue";
import ChartAgeIndex from "../components/charts/ChartAgeIndex.vue";
export default {
  name: "AppNav",
  components: {
    ChartAvgPopulation,
    ChartAgeIndex,
  },
  data() {
    return {
      drawer: true,
    };
  },
  methods: {
    onClickCloseDrawer() {
      this.drawer = false;
    },
  },
};
</script>

<style scoped>
/* .nav{
  position:
} */
.toolbar-right {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
}
.toolbar-right > button {
  padding: 7px;
  width: 40px;

  background: #fff;
  border: 1px solid #127bbf;
  color: #127bbf;
}

.nav__wrapper {
  padding: 5px;
  background-color: #f5f5f5 !important;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-around;
}

.title {
  display: flex;
  justify-content: space-around;
}
.title > h5,
.header > h5 {
  flex: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
}

.title > .img__wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img__wrapper > img {
  height: 23px;
  right: 23px;
}

.widget-content {
  margin-top: 10px;
}

.widget-content > .title > p {
  font-weight: 400;
  font-size: 16px;
  flex: 9;
}

.widget-content > .title > .img__wrapper {
  align-items: flex-start;
  padding-top: 4px;
}
</style>
