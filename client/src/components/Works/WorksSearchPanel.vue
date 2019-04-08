<template>
  <panel title="Search">
    <v-layout row wrap>
      <v-flex xs8 sm5 md4>
        <v-menu
          v-model="datePicker1"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="dateStart"
              clearable
              label="Dia Reserva"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateStart"
            locale="es"
            no-title
            scrollable
            @change="datePicker = false"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex sm1>
      </v-flex>
            <v-flex xs8 sm5 md4>
        <v-menu
          v-model="datePicker2"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="dateEnd"
              clearable
              label="Dia Reserva"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateEnd"
            locale="es"
            no-title
            scrollable
            @change="datePicker2 = false"
          ></v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-text-field
      label="Search works by name, phone, email..."
      v-model="search"
    ></v-text-field>
  </panel>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

export default {
  data () {
    return {
      search: '',
      datePicker1: false,
      datePicker2: false,
      dateStart: moment().subtract(14, 'days').format('YYYY-MM-DD'),
      dateEnd: moment().add(14, 'days').format('YYYY-MM-DD')
    }
  },
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: 'works'
      }
      if (this.search !== '') {
        route.query = {
          search: this.search,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        }
      }
      this.$router.push(route)
    }, 700),
    dateStart: async function (value) {
      const route = {
        name: 'works'
      }
      if (this.search !== '') {
        route.query = {
          search: this.search,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        }
      }
      this.$router.push(route)
    },
    dateEnd: async function (value) {
      const route = {
        name: 'works'
      }
      if (this.search !== '') {
        route.query = {
          search: this.search,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        }
      }
      this.$router.push(route)
    },
    '$route.query.search': {
      inmediate: true,
      handler (value) {
        this.search = value
      }
    }
  },
  method: {
    async updateRouteQuery () {
      const route = {
        name: 'works'
      }
      if (this.search !== '') {
        route.query = {
          search: this.search,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        }
      }
      this.$router.push(route)
    }
  }
}
</script>

<style>

</style>
