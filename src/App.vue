<template>
  <div id="app">
    <h1 class="lobster heading">attempts</h1>
    <div id="wrapper">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lobster');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.heading {
  font-size: 40px;
}

.lobster {
  font-family: 'Lobster';
}

#wrapper {
  padding: 5%;
}

</style>
