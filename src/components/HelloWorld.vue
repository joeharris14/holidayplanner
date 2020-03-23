<template>
  <div class="contentWrapper">
    <h1>Holiday Planner</h1>
    <div>
    <p class="errorMessage">{{ errorMessage }}</p>
    <div class="inputWrapper">
      <div class="inputLabel"><p>How long is your vacation?</p></div>
      <input class="inputField" v-model="holidayLengthEntered" />
      <button class="calcButton" v-on:click="handleSubmitPress">Calculate best dates</button>
      </div>
    </div>
    <transition name="slide-fade">
    <div class="holidayItemWrapper" v-show="bestHolidays.length > 0">
      <div class="holidayItem" v-for="(holiday, index) in bestHolidays" :key="holiday.startDay"><b>{{ holiday.startDay }} - {{ holiday.endDay }}</b>
        <div class="subtitle"> {{ holiday.leaveCost }} days of annual leave</div>
        <hr class="divider" v-if="index+1 < bestHolidays.length" />
      </div>
    </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import moment, { Moment } from 'moment';
import { Holiday } from '../types';
import json from '../assets/public_holidays.json';
@Component
export default class HelloWorld extends Vue {
  holidayLengthEntered = "";
  errorMessage: string | null = null;
  daysOff: Moment[] = [];
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
      this.bestHolidays = [];
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
      this.errorMessage = "Please enter a valid number between 4 and 20." 
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
  createHoliday(startDay: Moment, length: number, leaveCost: number): Holiday {
    const format = "ddd, DD MMM";
    return { startDay: moment(startDay).format(format).toString(), endDay: moment(startDay).add(length - 1, "days").format(format).toString(), leaveCost: leaveCost }
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
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.inputField {
  border-radius: 4px;
  max-width: 450px;
  height: 35px;
  width: 80%;
  box-sizing: border-box;
  padding: 4px 8px; 
  outline: none;
}
.inputField:focus {
  border: 2px solid lightblue;
}
.calcButton {
  border-radius: 4px;
  max-width: 450px;
  height: 35px;
  width: 80%;
  font-size: 15px;
  background-color: #0c71e0;
  color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  margin-top: 15px;
  outline: none;
}
.inputLabel {
  padding-bottom: 4px;
}
.errorMessage {
  color: red;
  min-height: 30px;
}
.holidayItem {
  padding: 10px;
}
.subtitle {
  padding-top: 8px;
  padding-bottom: 8px;
  size: 10px;
}
.holidayItemWrapper {
  text-align: left;
  border-radius: 12px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  padding: 20px;
  margin: 20px;
  width: 80%;
  min-height: 160px;
  max-width: 450px;
  background-color: #fcfcfc;
}
.divider {
  border: 0.5px solid grey;
  width: 90%;
  opacity: 0.2;
  
}
</style>
