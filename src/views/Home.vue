<template>
  <div class="home">
    <a id="logout" href="#" v-on:click="logout()">Logout</a>
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

    <b-card v-if="characters.length > 0" header="<b>Characters</b>">
      <b-input-group prepend="Statistic #">
        <b-form-input v-model="statId"></b-form-input>
        <b-input-group-append>
          <b-btn v-on:click="fetchAll()" variant="primary">Count attempts</b-btn>
        </b-input-group-append>
      </b-input-group>
      <br>
      <h4>Total count: {{totalCount}}</h4>
      <br>
      <b-progress v-bind:value="countedCharactersPercentage" variant="info" striped="striped"></b-progress>

      <br><br>
      <b-list-group>
        <b-list-group-item href="#" v-for="char of characters" v-bind:key="char.lastModified" class="d-flex justify-content-between align-items-center">
          {{ char.name }}-{{ char.realm }}
          <b-badge variant="primary" v-if="char.attempts > -1">{{char.attempts}}</b-badge>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<style lang="scss">
#logout {
  position:absolute;
  top: 2%;
  right: 2%;
}
</style>

<script>
export default {
  name: 'home',
  data () {
    return { statId: 4688 }
  },
  computed: {
    fetching () {
      return this.$store.state.wow.fetching
    },
    characters () {
      return this.$store.getters.characters(80)
    },
    countedCharactersPercentage () {
      const allChars = this.$store.getters.characters(80)
      return Math.round((allChars.filter(char => char.attempts > -1).length / allChars.length) * 100)
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
    fetchAll () {
      const chars = this.$store.getters.characters(80)
      for (let char of chars) {
        this.$store.dispatch('countStatistics', { realm: char.realm, name: char.name, statId: Number(this.statId) })
      }
    },
    logout () {
      console.log('LOGGING OUT')
      this.$store.dispatch('logout')
      this.$router.replace('login')
    }
  }
}
</script>
