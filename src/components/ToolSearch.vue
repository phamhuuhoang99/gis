<template>
  <div class="tool-search">
    <ul class="pl-0">
      <li :class="{ active: showOptions.option1 }">
        <div class="wrapper__img" @click="showOptionsHandle(1)">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADdSURBVHgB7dmxbQIxFMbxz74USZqcskE2yAq3QTaImICroYECQQdswAgsgIANGOEmQG4osfEIPE7ASfx/hV19smS95umTAAAAAAAAXoyTUVlvy+I9/qlrXArnVBzCrGossTcZ+c84Ss731UFeWuWrZ8mYPyDKr/JDX+qgmLQUAAAAgGuYt8Hv4abOa8dcj9McJ9WP7sTLKNojrSQBAAAAuAN7NTbY/nqnts1QiCeNw6IKejJ7NZZSLef+1daH9vlc68ns1Vhyozw36yKq1I3OXk2YVjsBAAAAAADg8S7bvS40kw4tLgAAAABJRU5ErkJggg=="
            alt=""
          />
        </div>
        <Transition
          name="slide-fade"
          enter-active-class="animate__animated animate__fadeInLeft"
          leave-active-class="animate__animated animate__fadeOutLeft"
        >
          <div class="toolbar__content" v-if="showOptions.option1">
            <div class="toolbar__content_wrapper">
              <h4 class="toolbar__content_title">Chọn năm số liệu</h4>
            </div>
            <v-divider></v-divider>
            <div class="toolbar__content_options">
              <v-combobox
                :items="years"
                v-model="selectYear"
                class="rounded-0"
                dense
                outlined
                solo
                hide-details
              ></v-combobox>

              <v-combobox
                class="mt-3 rounded-0"
                :items="cities"
                label="Chọn tỉnh/Thành phố"
                dense
                outlined
                clearable
                solo
                hide-details
              ></v-combobox>
            </div>
          </div>
        </Transition>
      </li>
      <li :class="{ active: showOptions.option2 }">
        <div class="wrapper__img" @click="showOptionsHandle(2)">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgB7ZjNTcMwGIY/O3DhQsQEZQNGaCTusAFsULhVgFQq8XcsG9ANeoZDOwIb0AWAHLih2iQtSGmIU8eJ7ap6n1udpv76yW/sPEQAAAAAAAAA0DiM1oDwbBzyHeok1Zymn5kU/Zngk/ghmpJnvDYovHg+4Gz7ZN4YSeHSRUZxMjYSM+r7bJSXBoXdlzYLtnrJ5O2/MUk0kYz66eVAUkfmrnExe3y/PxyRY5w1KBej1u/sMQkxFMSf4rvoden73XGLB/KaGDvKrK6p6/hZb1BRjGT6RxkNxRcN4kEUl96fNIo4tZPvpyuuRYuqncXPWoPKYhTfRBMyILwaH7uOX6MNqhoj43kcxq+RBtWNkfG8DuJXq0E2YmRci6X4GTdo73L8RhZjZIoqfh+30T4ZwMkQmR9gfJcEWYlSJfh30hT2mR2SZE69iHnYVZS1WIp7Mw9pT4c6F7tms9u8o0Ody13T3kHRQvx87Jr2XzVqxs/V4VOFu5fVivHzdfjM40d3lMRvJmW8LofPFL/CrDh+C9bk8OlMdySr4ED1gM7Gb15USYwyD+rpZuoOSeemKyJpZDsIqAfdsWoe6A7NeaE7KtQC3aEHdMcqoDsUtUB3FMwL3aGYB7pD8ZvQHQX3Q3dAd/wDukMT6A6C7lAC3VEAdIcC6A5lgdAdSqA7VgDdoQF0hybQHZpAd1QAukMT6A5NoDsqAN2hCXSHJlV0BwAAAAAAAABsAD+CZJpUBSTNSAAAAABJRU5ErkJggg=="
            alt=""
          />
        </div>
        <Transition
          name="slide-fade"
          enter-active-class="animate__animated animate__fadeInLeft"
          leave-active-class="animate__animated animate__fadeOutLeft"
        >
          <div
            class="toolbar__content pt-0"
            v-if="showOptions.option2"
            style="padding: 10px"
          >
            <v-radio-group
              v-model="mapSelected"
              mandatory
              column
              class="pl-3 mt-2"
              hide-details
            >
              <v-radio
                label="Bản đồ hành chính"
                color="#1976d2 "
                value="1"
                class="text-color__radio"
              ></v-radio>
              <v-radio
                label="Bản đồ giao thông"
                color="#1976d2 "
                value="2"
                class="text-color__radio"
              ></v-radio>
              <v-radio
                label="Bản đồ Việt Nam"
                color="#1976d2"
                value="3"
                class="text-color__radio"
              ></v-radio>
            </v-radio-group>
          </div>
        </Transition>
      </li>
      <li :class="{ active: showOptions.option3 }">
        <div class="wrapper__img" @click="showOptionsHandle(3)">
          <img
            src="https://gis.gso.gov.vn/_nuxt/img/ic_heatmap.56b1f9e.png"
            alt=""
            style="filter: none"
          />
        </div>
        <Transition
          name="slide-fade"
          enter-active-class="animate__animated animate__fadeInLeft"
          leave-active-class="animate__animated animate__fadeOutLeft"
        >
          <div class="toolbar__content" v-if="showOptions.option3">
            <div class="toolbar__content_wrapper df justify-space-between">
              <h4 class="toolbar__content_title">Bản đồ nhiệt</h4>
              <v-btn icon @click="freshHeatMap">
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </div>
            <v-divider></v-divider>
            <div class="toolbar__content_options">
              <v-radio-group
                v-model="heatMap"
                column
                class="pl-3 mt-0"
                hide-details
              >
                <v-radio
                  label="Diện tích"
                  color="#1976d2 "
                  value="1"
                  class="text-color__radio"
                ></v-radio>
                <v-radio
                  label="Tổng số hộ"
                  color="#1976d2 "
                  value="2"
                  class="text-color__radio"
                ></v-radio>
                <v-radio
                  label="Dân số trung bình"
                  color="#1976d2"
                  value="3"
                  class="text-color__radio"
                ></v-radio>
                <v-radio
                  label="Dân số nữ"
                  color="#1976d2"
                  value="4"
                  class="text-color__radio"
                ></v-radio>
                <v-radio
                  label="Dân số trung bình"
                  color="#1976d2"
                  value="5"
                  class="text-color__radio"
                ></v-radio>
                <v-radio
                  label="Số trẻ em từ 0 đến 14 tuổi"
                  color="#1976d2"
                  value="6"
                  class="text-color__radio"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
        </Transition>
      </li>
      <li :class="{ active: showOptions.option4 }">
        <div class="wrapper__img" @click="showOptionsHandle(4)">
          <img
            src="https://gis.gso.gov.vn/_nuxt/img/ic_point.db59ac1.png"
            alt=""
            style="filter: none"
          />
        </div>
        <Transition
          name="slide-fade"
          enter-active-class="animate__animated animate__fadeInLeft"
          leave-active-class="animate__animated animate__fadeOutLeft"
        >
          <div class="toolbar__content" v-if="showOptions.option4">
            <div class="toolbar__content_wrapper df justify-space-between">
              <h4 class="toolbar__content_title">Bản đồ điểm</h4>
              <v-btn icon @click="pointMap = null">
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </div>
            <v-divider></v-divider>
            <div class="toolbar__content_options">
              <v-radio-group
                v-model="pointMap"
                column
                class="pl-3 mt-0"
                hide-details
              >
                <v-radio
                  label="Cơ sở khám chữa bệnh"
                  color="#1976d2 "
                  value="1"
                  class="text-color__radio"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
        </Transition>
      </li>
      <li :class="{ active: showOptions.option5 }">
        <div class="wrapper__img" @click="showOptionsHandle(5)">
          <img
            src="https://gis.gso.gov.vn/_nuxt/img/ic_disaster.4a43135.png"
            alt=""
          />
        </div>
        <Transition
          name="slide-fade"
          enter-active-class="animate__animated animate__fadeInLeft"
          leave-active-class="animate__animated animate__fadeOutLeft"
        >
          <div class="toolbar__content" v-if="showOptions.option5">
            <div class="toolbar__content_wrapper">
              <h4 class="toolbar__content_title">Môi trường-thiên tai</h4>
            </div>
            <v-divider></v-divider>
            <div class="toolbar__content_options">
              <v-combobox
                :items="layers"
                label="Các lớp bản đồ"
                class="rounded-0"
                dense
                outlined
                solo
                clearable
                hide-details
              ></v-combobox>

              <v-combobox
                class="mt-3 rounded-0"
                :items="scenes"
                label="Kịch bản"
                dense
                outlined
                clearable
                solo
                hide-details
              ></v-combobox>
            </div>
          </div>
        </Transition>
      </li>
      <li>
        <div class="wrapper__img" @click="showOptionsHandle(6)">
          <img
            src="https://gis.gso.gov.vn/_nuxt/img/ic_search.c55b9b2.png"
            alt=""
          />
        </div>
      </li>
    </ul>
    <ul class="pl-0" v-if="showOptions.option6">
      <li class="border-none">
        <div class="wrapper__img">
          <img
            src="https://gis.gso.gov.vn/_nuxt/img/ic_point1.5bde460.png"
            alt=""
          />
        </div>
      </li>
      <li class="border-none">
        <div class="wrapper__img">
          <img
            src="https://gis.gso.gov.vn/_nuxt/img/ic_light.ee8b71c.png"
            alt=""
          />
        </div>
      </li>
      <li class="border-none">
        <div class="wrapper__img border-none">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJeSURBVHgB7dovb9VQGMfxX9sLWUBQAhJxJ3EXC4ZaHC9hDokkzGD4I5G4vQTcbFHomyAwiAoSDMkqIGG7tOU8hbsQSDjntEv7POP3SbZdcZvdftc2Oc8OQERERERE8RIYlT8sc+x8y4HF0vvmpquxuVDVL4sakcwFyh+VyyTDgfvgdxFv3Ta4X78oqtADUhiTZng9MI5YSdyYA0xdQfmTMk83OJLXD27fwL2b14OPPXz/Ga/efuxft19xNfR2W8CSEyy3f1KJc2c3Dz60c1/bQLh88Yr7HhTI1i3Wfg8v8i/JyW7oW809g6bGQB4M5MFAHgzkwUAeDOTBQB7/Z6BjBK/qbS01fvPu05d++RBK1mKnNqgCDzMWKElOlxr7hx8whIu6jpkLmbnF8sflKs2yqFHFn1ycN52bB8UcY2Lc0cdJUbozzN0nrltgDwh/jrj7pHLvrs/lRPGvOC2K+lmxxkRUB5o7jlAbSEMcoTKQljhCXSBNcYSqQNriCDWBNMYRKgJpjSNmD6Q5jpg1kPY4YrZAFuKIWQJZiSMmD2Qpjpg0kLU4YtDALGrz0i+ZG3Z1KQ4sxRFRV9DIzUvb32gmjoi6gmTzkvuxwghJg736uY04IjiQbF5yw+4+TuzmJRmwb2fITRYxCVQg/AoauXnJqvCh/VltXjKG/1n1YCAPBvJgIA8G8mAgDwbyYCCPiECLCmfh+LwuNXbciW1+vpTNSFNsXtIgatxxbb8suxGjDtm8dPS0uAVDop5BjRtVyEligCGblzQYNHLtJ4qX3Oo+hX8BO2LzEhERERERWfUDbrEWj+5K4GMAAAAASUVORK5CYII="
            alt=""
          />
        </div>
      </li>
      <li class="border-none">
        <div class="wrapper__img border-none">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJrSURBVHgB7ZpBctMwFIZ/qU2XjAvDDEv3BKQ3qE/AcIKUG8COKYu4MxBYcgPCDeAEDieg3MAHgIyGZVJLvGcnhVVirFqm6H0zHsmRbFn/SJn3nh4gCIIgCNGiEIg0L5Kf13rirD2jQcc0ckI/J5tmQ1ep6lLPq5H9YvKsRACCCJDQ5PUaX6matnykvDfCaZlnBj2jEQpXq71QDs/sCCd0HS/fZIovrluHU26jbgvuKwiCIAhC7+w1hB5cFOe4w/yYZfNd7YfYg1P4gLvNfFfjXgG2L3BsuzskqrHfx9tGst4+UVvvJusOzm9qDiV9C/sUJVrSyRdIXhap1ijo6ZRuX5A5+x4DwNuzXqE0cWuRmXd/70B18gV4IFLukutUPsFAWIVJ/Q1K510mz3R2hipLTgtqHyfFQND2S7msnP2GjnQW4A/FUwxFswVhZtkVOhLOHf5HEQEQOSIAIkcEQOS08QW8eZQX6YrD4haXy7e7zeb7r4rnVEy1wtPvr7MFeibIClivcAZ2orR63KI7O1qJU2EMLPkPQOSIAIgcEQCRIwIgAEpTsJKTH6xrE7nh4Iap1k3EqW+CWIIbi+64Td9NgDVYkFW2ACJHBEDkiACIHBEAPrjmFDahiA8C8zAvtifUJTzwEoCPork8qOqIT1DsqjmiV0MKQIN/5tJZTEOuAo4xkvjT5k7P4YFXrnCdA7yiYOfv+N0VJzxbB6N6SJqgd6eOT4S349EWXM6yE3jgnSxdJ0scIKfqBOEwNPmP9gi58UyovtVs8eSiGB9qiuhyBNjepMLfGuxVXlua/BFKEyCTXBAEQRAE4b/mF9XPtbi5+OLjAAAAAElFTkSuQmCC"
            alt=""
          />
        </div>
      </li>

      <li class="border-none">
        <div class="wrapper__img border-none">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMDSURBVHgB7dxhaiJBFEXh0uCiRHArY1Y2zlYEcVGNnckVBElUNFHrvXfPByHB/Ejad9TE7qrWAAAAAAAAAAAAAAAAAAAAAAAAAAAAgFvsdrs/+mimIhz/pHWiA9/v92t9/fb2tprP5/+akSjH3yWA04M/coog0vFPWwfDMHwLT3eIw8vBueHLOI5dHozdXgI2m81qOp3+/Xp75WeCS8OfTCbvi8Vi3TroFoA4RRBx+Ief3zpziCDq8A+/QwugcgSRh3/4PVoQFSOIPnwJE4BUiiDD8CVUAFIhgizDl3ABSOYIMg1fQgYgGSPINnwJG4BkiiDj8CV0AJIhgqzDl/ABSOQIMg9fUgQgESPIPnxJE4BEiqDC8CVVABIhgirDl3QBSM8IKg1fUgYgPSKoNnxJG4C8MoKKw5fUAcgrIqg6fEkfgDwzgsrDlxIByDMiqD58KROAPDICh+FLqQDkERG4DF/KBSC/icBp+FIyAPlJBG7Dl7IByD0ROA5fSgcgt0TgOnwpH4Bci0CfXYcvFgHIpQjOcRm+2AQgt0TgNHyxCkCuReA2fOmyP0BPs9ns49L3PsP4aGasngEu/bV/ym27GpsAbhn+kVMEFi8B1/7PH8fx/evtLtvVSPlngFve5HHcruaodAD3vMPnGkHZAH7y9q5jBCUD+M17+24RlAvgESd2nCIoFcAjz+q5RFAmgGec0nWIoEQAzzyfXz2C9AG84mKOyhGkDuCVV/JUjSBtAD0u46oYQcoAel7DVy2CdAFEuICzUgSpAoh09W6VCNIEEPHS7QoRpAgg8nX72SMIH0CGRRuZIwgdQKYVO1kjCBtAxuVaGSMIGUDmtXrZIggXQIWFmpkiCBVApVW6WSIIE0DFJdoZIggRQOX1+dEj6B6Aw+YMkSPoGoDTzhxRI+gWgOO2LBEj6BKA85480SLosjh0GIZv4blszrBcLtfnFqR+3tblwdjtJeD0keC4M4f78R/oTthut6tmyv34AQAAAAAAAAAAAAAAAAAAAAAAAAAAcKf/oqlkMqVqWdUAAAAASUVORK5CYII="
            alt=""
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectYear: "2021",
      years: ["2016", "2017", "2018", "2019", "2020", "2021"],
      cities: [
        "01 - Thành phố Hà Nội",
        "02 - Tỉnh Hà Giang",
        "04 - Tỉnh Cao Bằng",
        "06 - Tỉnh Bắc Kạn",
      ],
      layers: [
        "Bản đồ rủi ro thiên tai",
        "Bản đồ ngập lụt",
        "Bản đồ nước dâng siêu bão",
        "Bản đồ hạn hán",
      ],
      scenes: ["Kịch bản 1 _ Huế", "Kịch bản 2_ Huế", "Kịch bản 3 _ Huế"],

      showOptions: {
        option1: false,
        option2: false,
        option3: false,
        option4: false,
        option5: false,
        option6: false,
      },
      mapSelected: null,
      heatMap: null,
      pointMap: null,
    };
  },
  methods: {
    disableAllOptions(index) {
      Object.keys(this.showOptions).forEach((key) => {
        if (key !== `option${index}`) this.showOptions[key] = false;
      });
    },
    showOptionsHandle(index) {
      this.disableAllOptions(index);

      switch (index) {
        case 1:
          this.showOptions.option1 = !this.showOptions.option1;
          break;
        case 2:
          this.showOptions.option2 = !this.showOptions.option2;
          break;
        case 3:
          this.showOptions.option3 = !this.showOptions.option3;
          break;
        case 4:
          this.showOptions.option4 = !this.showOptions.option4;
          break;
        case 5:
          this.showOptions.option5 = !this.showOptions.option5;
          break;
        case 6:
          this.showOptions.option6 = !this.showOptions.option6;
          break;
      }
    },
    freshHeatMap() {
      this.heatMap = null;
    },
  },
};
</script>

<style scoped>
@import "animate.css";
.tool-search {
  display: flex;
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 2;
  background-color: white;
}
.tool-search ul:nth-child(2) {
  border: 1px solid #127bbf;
  width: fit-content;
  margin-left: 10px;
}
.border-none {
  border: 0 !important;
}

.active,
.wrapper__img:hover {
  background-color: #127bbf;
}
.wrapper__img:hover > img {
  filter: brightness(0) invert(1);
}

.active > .wrapper__img > img {
  filter: brightness(0) invert(1);
}
.text-color__radio /deep/ label {
  color: #04003a;
}
.tool-search {
  height: 47px;
}

.wrapper__img {
  width: 46px;
  height: 46px;
  padding: 6px;
}
.tool-search ul {
  display: flex;
  position: relative;
}
.tool-search ul li {
  list-style-type: none;
  border: 1px solid #127bbf;
  border-left: 0;
  display: flex;
}
.tool-search ul li:nth-child(1) {
  border-left: 1px solid #127bbf;
}

.tool-search ul > li > .toolbar__content {
  position: absolute;
  top: 100%;
  margin-left: -1px;
  background-color: white;
}

.tool-search ul li img {
  width: 32px;
  height: 32px;
  width: 100%;
}
.toolbar__content_wrapper {
  height: 38px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}
.toolbar__content {
  border: 3px solid #127bbf;
  width: 290px;
}
.toolbar__content_title {
  color: #04003a;
  font-size: 14px;
  font-weight: 700;
}
.toolbar__content_options {
  padding: 10px 10px;
}
.toolbar__content_options .options {
  padding-top: 5px;
}

.v-text-field--outlined >>> fieldset {
  border: 2px solid #127bbf;
  color: #127bbf !important;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
