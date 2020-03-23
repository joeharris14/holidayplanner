<template>
  <div class="contentWrapper">
    <h1 class="header">Holiday Planner</h1>
    <p class="errorMessage">{{ errorMessage }}</p>
    <div class="inputLabel"><p>How long is your vacation?</p></div>
    <input class="inputField" v-model="holidayLengthEntered" />
    <select />
    <button class="calcButton" v-on:click="handleSubmitPress">Calculate best dates</button>
    <HolidayList />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import moment, { Moment } from 'moment';
import { Holiday } from '../../types';
import HolidayList from '../HolidayList/HolidayList.vue';
import json from '../../assets/public_holidays.json';

@Component({
  components: {
    HolidayList,
  },
})
export default class HolidayPlanner extends Vue {
  holidayLengthEntered = "";

  mounted() {
    // Normally I would define an interface for this but considering none of the other info
    // is useful in this usecase I will leave it as any for simplicity.
    // If we wanted to display which holidays they are using then we could store this data too.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$store.commit('setDaysOff', json.filter((dayOff: any) => dayOff.jurisdiction === "nsw").map((dayOff: any) => moment(dayOff.date, 'YYYYMMDD')));
  }

  get bestHolidays() {
    return this.$store.getters.bestHolidays;
  }

  get daysOff() {
    return this.$store.getters.daysOff;
  }

  get errorMessage() {
    return this.$store.getters.errorMessage;
  }

  @Watch('holidayLengthEntered') inputEntered() {
    if (this.holidayLengthEntered.length === 0) {
      this.$store.commit('setErrorMessage', null);
      this.$store.commit('setBestHolidays', []);
    }
    // If you want real time input validation

    // const desiredLength = parseInt(this.holidayLengthEntered);
    // // set an error message to request the user enters a number
    // if (isNaN(desiredLength) || desiredLength < 4 || desiredLength > 20) { 
    //   this.errorMessage = "Please enter a valid number." 
    // } else {
    //   this.errorMessage = null;
    // }
  }
  
  isDayOff(dayToCheck: Moment): boolean {
    const dayOfWeek = dayToCheck.day();
    return dayOfWeek === 6 || dayOfWeek === 0 || this.daysOff.some((dayOff: Moment) => dayToCheck.isSame(dayOff));
  }

  calculateBestHolidays(desiredLength: number): Array<Holiday> {
    let bestHolidayList: Array<Holiday> = [];
    const a = moment('2020-01-01');
    const b = moment('2020-12-31');
    const MAX_HOLIDAY_LENGTH = 20;
    let minLeaveCost = MAX_HOLIDAY_LENGTH + 1;
    for (let m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
      // look forward desiredLength days to check a potential holiday
      let leaveCost = 0;
      for (let i = 0; i < desiredLength; i++) {
        const dayToCheck = moment(m).add(i, 'days');
        if (!this.isDayOff(dayToCheck)) {
          leaveCost += 1;
        }
      }
      const holiday = this.createHoliday(m, desiredLength, leaveCost);
      // we've hit the end of the road for 2020, no point checking further
      if (moment(holiday.endDay).isAfter(b)) {
        break;
      }
      if (leaveCost === minLeaveCost) {
          // add to list of equal best holiday options
          bestHolidayList.push(holiday);
      } else if (leaveCost < minLeaveCost) {
          // wipe current list of best holidays
          bestHolidayList = [];
          // add this holiday to newly empty list
          bestHolidayList.push(holiday);
          minLeaveCost = leaveCost;
      }
      // if it's not then we don't care about it
    }
    return bestHolidayList;
  }

  handleSubmitPress() {
    const desiredLength = parseInt(this.holidayLengthEntered);
    // set an error message to request the user enters a number
    if (isNaN(desiredLength) || desiredLength < 4 || desiredLength > 20) { 
      this.$store.commit('setErrorMessage', "Please enter a valid number between 4 and 20.");
      return;
    } else {
      this.$store.commit('setErrorMessage', null);
    }
    this.$store.commit('setBestHolidays', this.calculateBestHolidays(desiredLength));
  }

  createHoliday(startDay: Moment, length: number, leaveCost: number): Holiday {
    const format = "ddd, DD MMM YY";
    return { startDay: moment(startDay).format(format).toString(), endDay: moment(startDay).add(length - 1, "days").format(format).toString(), leaveCost: leaveCost }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "./holiday_planner.scss";
</style>
