<template>
  <v-app>
    <app-header />

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
export default {
  name: "App",

  components: {
    AppHeader,
  },

  data() {
    return {};
  },
};
</script>
<style scoped>
.container {
  padding: 0;
}
</style>
