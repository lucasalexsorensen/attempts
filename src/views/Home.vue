<template>
  <div class="home">
    <div id="logout">
      <span>{{btag}}</span> |
      <a href="#" v-on:click="logout()">Logout</a>
    </div>

    <div v-if="characters.length < 1">
      <b-button
        v-if="fetching != true"
        size="bg"
        variant="primary"
        icon-left="account_box"
        v-on:click="fetchCharacters()"
        >Get Characters</b-button>
      <b-button
        v-if="fetching === true"
        size="bg"
        disabled
        icon-left="account_box"
        >Get Characters</b-button>
    </div>

    <b-card id="counter" v-if="characters.length > 0">
      <v-multiselect
        placeholder="Select statistics"
        v-model="selected"
        :options="statistics"
        label="name"
        :multiple="true"
        track-by="name">
          <template slot="singleLabel" slot-scope="{ option }">
            <strong>{{ option.name }}</strong>
          </template>
      </v-multiselect>
      <br>
      <b-button-group>
        <b-button v-on:click="countAll()" :disabled="selected.length <= 0" variant="primary">Count attempts</b-button>
        <b-button v-on:click="refreshAll()" :disabled="selected.length <= 0"><a-icon icon="sync"></a-icon></b-button>
      </b-button-group>

      <div v-if="counting">
        <br>
        <h4>Total count: {{totalCount}}</h4>
        <br>
        <b-progress height="30px" :max="characters.length" variant="info" striped="striped">
          <b-progress-bar :value="countedCharacters.length" >
            {{countedCharacters.length}} / {{characters.length}}
          </b-progress-bar>
        </b-progress>

        <br><br>
        <b-list-group>
          <b-list-group-item href="#" v-for="char of characters" v-bind:key="char.lastModified" class="d-flex justify-content-between align-items-center">
            {{ char.name }}-{{ char.realm }}
            <b-badge variant="primary" v-if="char.attempts > -1">{{char.attempts}}</b-badge>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-card>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
.home {
  min-width: 400px;
  width: 80%;
  margin-left: auto;
  margin: auto;
}
#counter {
  padding-bottom: 4%;
}
#logout {
  position:absolute;
  top: 2%;
  right: 2%;
}
</style>

<script>
import STATISTICS from '../../all-statistics.json'

export default {
  name: 'home',
  data () {
    return {
      selected: [],
      statistics: STATISTICS
    }
  },
  computed: {
    counting () {
      return this.$store.state.ui.counting
    },
    btag () {
      return this.$store.state.auth.user.battletag
    },
    fetching () {
      return this.$store.state.wow.fetching
    },
    characters () {
      return this.$store.getters.characters(80)
    },
    countedCharacters () {
      const allChars = this.$store.getters.characters(80)
      return allChars.filter(char => char.attempts > -1)
    },
    totalCount () {
      return this.$store.getters.characters(80).reduce((accum, current) => {
        const prev = (accum.attempts > -1) ? accum.attempts : 0
        const next = (current.attempts > -1) ? current.attempts : 0
        return { attempts: prev + next }
      }).attempts
    }
  },
  components: {
  },
  methods: {
    fetchCharacters () {
      this.$store.dispatch('fetchCharacters')
    },
    countAll () {
      const ids = this.selected.map(stat => Number(stat.id))
      const chars = this.$store.getters.characters(80)
      this.$store.dispatch('startCounting')
      for (let char of chars) {
        this.$store.dispatch('countStatistics', { realm: char.realm, name: char.name, statId: ids[0] })
      }
    },
    refreshAll () {
      console.log('hello world')
    },
    logout () {
      console.log('LOGGING OUT')
      this.$store.dispatch('logout')
      this.$router.replace('login')
    }
  }
}
</script>
