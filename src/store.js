import Vue from 'vue'
import Vuex from 'vuex'
import jsonwebtoken from 'jsonwebtoken'
import { apiService } from './services'

Vue.use(Vuex)

const initialState = {
  ui: {
    counting: false
  },
  auth: {
    user: null
  },
  wow: {
    characters: JSON.parse(localStorage.getItem('characters')) || [],
    fetching: false
  }
}

export default new Vuex.Store({
  state: initialState,
  getters: {
    characters: (state) => (level) => {
      return state.wow.characters.filter(char => char.level >= level).sort((a, b) => a.level < b.level)
    }
  },
  actions: {
    startCounting ({ commit }) {
      commit('startCounting')
    },
    stopCounting ({ commit }) {
      commit('stopCounting')
    },
    async fetchCharacters ({ dispatch, commit }) {
      commit('characterRequest')
      const characters = await apiService.fetchCharacters()
      commit('characterSuccess', characters)
    },
    async countStatistics ({ dispatch, commit }, { realm, name, statId }) {
      commit('statisticsRequest')
      const statistics = await apiService.fetchStatistics(name, realm)
      if (typeof statistics === 'object') {
        commit('statisticsSuccess', { statId, statistics })
      } else {
        commit('statisticsFailure')
      }
    },
    login ({ commit }, { token }) {
      commit('login', { token })
    },
    logout ({ commit }) {
      commit('logout')
    }
  },
  mutations: {
    startCounting (state) {
      state.ui.counting = true
    },
    stopCounting (state) {
      state.ui.counting = false
    },
    statisticsRequest (state) {
      state.wow.fetching = true
    },
    statisticsSuccess (state, { statId, statistics: data }) {
      const idx = state.wow.characters.findIndex(char => char.name === data.name && char.realm === data.realm)
      const dungeonCat = data['statistics']['subCategories'].find(sub => sub['id'] === 14807)
      const allStats = dungeonCat.subCategories.reduce((accum, current) => {
        return { statistics: [...accum.statistics, ...current.statistics] }
      }).statistics
      const count = allStats.find(stat => stat['id'] === statId)
      state.wow.characters[idx].attempts = count['quantity']
    },
    statisticsFailure (state) {
      state.wow.fetching = false
    },
    characterRequest (state) {
      state.wow.fetching = true
    },
    characterSuccess (state, characters) {
      state.wow.characters = characters.sort((a, b) => a.level < b.level).map(char => Object.assign({ attempts: -1 }, char))
      localStorage.setItem('characters', JSON.stringify(state.wow.characters))
      state.wow.fetching = false
    },
    characterFailure (state) {
      state.wow.fetching = false
    },
    login (state, { token }) {
      console.log('store login', token)
      state.auth.user = { token: token }
      const { id, battletag } = jsonwebtoken.decode(token)
      state.auth.user.id = id
      state.auth.user.battletag = battletag
      console.log(id, battletag)
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('jwtToken', token)
    },
    logout (state) {
      state.auth.user = null
      delete window.axios.defaults.headers.common['Authorization']
      localStorage.removeItem('jwtToken')
    }
  }
})
