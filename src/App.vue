<template>
  <div id="app">
    <HolidayPlanner />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HolidayPlanner from './components/HolidayPlanner/HolidayPlanner.vue';

@Component({
  components: {
    HolidayPlanner,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  background-color: #FAFAFA;
}
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
