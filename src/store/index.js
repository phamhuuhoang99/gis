import Vuex from "vuex";
import Vue from "vue";
// import createPersistedState from "vuex-persistedstate";

//Import modules
import map from "./modules/map";

Vue.use(Vuex);

// const dataState = createPersistedState({
//   key: "auth",
//   paths: ["auth"],
// });

const storeData = {
  modules: {
    map,
  },
  // plugins: [dataState],
};

const store = new Vuex.Store(storeData);

export default store;
