<template>
  <div class="login">
    <b-btn
      variant="success"
      size="big"
      href="https://dd8c76f5.ngrok.io/auth/bnet"
    >Sign in</b-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'login',
  components: {
    HelloWorld
  }
}
</script>
