import * as actions from './actions'
import * as getters from './getter'

import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import mutations from './mutations'
import state from './state'

Vue.use(Vuex)
const debug=process.env.NODE_ENV!=='production'
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict:debug,
    plugins:debug?[createLogger()]:[]
})