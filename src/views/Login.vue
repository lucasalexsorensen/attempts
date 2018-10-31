<template>
  <div class="login">
    <b-btn
      variant="success"
      size="big"
      :href="AUTH_URL"
    >Sign in</b-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { apiService } from '@/services'

export default {
  name: 'login',
  data () {
    return { AUTH_URL: `${apiService.API_URL}/auth/bnet` }
  },
  components: {
    HelloWorld
  }
}
</script>
