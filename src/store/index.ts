import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    daysOff: [],
    bestHolidays: [],
    errorMessage: null,
  },
  mutations: {
    setDaysOff(state, payload) {
      Vue.set(state, "daysOff", [...payload]);
    },
    setBestHolidays(state, payload) {
      Vue.set(state, "bestHolidays", [...payload]);
    },
    setErrorMessage(state, payload) {
      Vue.set(state, "errorMessage", payload);
    }
  },
  actions: {
  },
  getters: {
   daysOff(state) {
     return state.daysOff;
   },
   bestHolidays(state) {
     return state.bestHolidays;
   },
   errorMessage(state) {
     return state.errorMessage;
   }
  },
  modules: {
  }
})
