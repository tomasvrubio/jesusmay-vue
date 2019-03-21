<template>
  <v-layout row>
    <v-flex xs6 offset-xs3>
      <panel title="Register">
        <!-- TODO: En este formulario tengo que meter el resto de elementos necesarios para un usuario. ¿nombre y algo más? -->
        <form
          name="jesusmay-form"
          autocomplete="off">
          <v-text-field
            label="Name"
            v-model="name"
          ></v-text-field>
          <br>
          <v-text-field
            label="Email"
            v-model="email"
          ></v-text-field>
          <br>
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            autocomplete="new-password"
          ></v-text-field>
        </form>
        <br>
        <div class="danger-alert" v-html="error" />
        <br>
        <v-btn
          class="cyan"
          dark
          @click='register'>
          Register
        </v-btn>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
// import Panel from '@/components/Panel'

export default {
  name: 'Register',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      error: null
    }
  },
  // watch: {
  //   email (value) {
  //     console.log('email has changed', value)
  //   }
  // },
  // mounted () {
  //   setTimeout(() => {
  //     this.email = 'blabla'
  //   }, 2000)
  // },
  methods: {
    async register () {
      try {
        const response = await AuthenticationService.register({
          name: this.name,
          email: this.email,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({
          name: 'works'
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
  // },
  // components: {
  //   Panel
  // }
}
</script>

<style scoped>

</style>
