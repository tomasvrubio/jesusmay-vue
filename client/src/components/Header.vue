<template>
  <v-toolbar fixed class="cyan" dark>
    <v-toolbar-title class="mr-4">
      <router-link
        class="home"
        tag="span"
        :to="{
          name: 'root'
        }">
        JesusMay
      </router-link>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn
        flat
        dark
        :to="{
          name: 'calendar'
        }">
        Calendar
      </v-btn>

      <v-btn
        flat
        dark
        :to="{
          name: 'works'
        }">
        Browse
      </v-btn>
    </v-toolbar-items>

    <v-spacer/>

    <v-toolbar-items>
      <v-btn
        v-if="!$store.state.isUserLoggedIn"
        flat
        dark
        :to="{
          name: 'login'
        }">
        Login
      </v-btn>

      <v-btn
        v-if="!$store.state.isUserLoggedIn"
        flat
        dark
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn>

      <v-btn
        v-if="$store.state.isUserLoggedIn"
        flat
        dark
        @click="logout">
        Log Out
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    // navigateTo (route) {
    //   this.$router.push(route)
    // },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'root'
      })
    }
  }

}
</script>

<style scoped>
.home {
  cursor: pointer;
}

.home:hover {
  color: purple;
}
</style>
