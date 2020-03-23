<template>
<transition name="slide-fade">
    <div class="holidayItemWrapper" v-show="showCard">
      <div class="holidayItem" v-for="(holiday, index) in bestHolidays" :key="holiday.startDay"><b>{{ holiday.startDay }} - {{ holiday.endDay }}</b>
        <div class="subtitle"> {{ holiday.leaveCost }} days of annual leave</div>
        <hr class="divider" v-if="index+1 < bestHolidays.length" />
      </div>
    </div>
</transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class HolidayList extends Vue {
    get bestHolidays() {
      return this.$store.getters.bestHolidays;
    }

    get showCard() {
      return this.$store.getters.showCard;
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "./holiday_list.scss";
</style>