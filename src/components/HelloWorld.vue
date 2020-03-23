<template>
  <div class="hello">
    <h1>Enter a number between 4 and 20</h1>
    <div class="inputBlock">
    <p class="errorMessage">{{ errorMessage }}</p>
      <input v-model="holidayLengthEntered" />
    </div>
    
    <button v-on:click="handleSubmitPress">Calculate</button>
    <p v-for="holiday in bestHolidays" :key="holiday.startDay">{{ holiday.startDay }} - {{ holiday.endDay }} ({{ holiday.leaveCost }} days off req)</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import moment, { Moment } from 'moment';
import { Holiday } from '../types';
import json from '../assets/public_holidays.json';
@Component
export default class HelloWorld extends Vue {
  holidayLengthEntered = "";
  errorMessage: string | null = null;
  daysOff: Moment[] = [];
  @Prop() private msg!: string;
  bestHolidays: Array<Holiday> = [];

  mounted() {
    // Normally I would define an interface for this but considering none of the other info
    // is useful in this usecase I will leave it as any for simplicity.
    // If we wanted to display which holidays they are using then we could store this data too.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.daysOff = json.filter((dayOff: any) => dayOff.jurisdiction === "nsw").map((dayOff: any) => moment(dayOff.date, 'YYYYMMDD'));
  }

  @Watch('holidayLengthEntered') inputEntered() {
    if (this.holidayLengthEntered.length === 0) {
      this.errorMessage = null;
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
  
  handleSubmitPress() {
    const desiredLength = parseInt(this.holidayLengthEntered);
    // set an error message to request the user enters a number
    if (isNaN(desiredLength) || desiredLength < 4 || desiredLength > 20) { 
      this.errorMessage = "Please enter a valid number." 
      return;
    } else {
      this.errorMessage = null;
    }
    this.bestHolidays = this.calculateBestHolidays(desiredLength);
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
      const holiday = {startDay: m.format("ddd, MM YY").toString(), endDay: moment(m).add(desiredLength - 1, "days").format("ddd, MM YY").toString(), leaveCost: leaveCost};
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.errorMessage {
  color: red;
  min-height: 30px;
}
</style>
