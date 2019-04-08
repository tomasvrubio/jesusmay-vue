<template>
  <v-layout row>
    <v-flex xs10 offset-xs1>
      <works-search-panel />
      <works-panel class="mt-2"/>
    </v-flex>
  </v-layout>
</template>

<script>
// import Panel from '@/components/Panel'
import WorksPanel from './WorksPanel'
import WorksSearchPanel from './WorksSearchPanel'
// import WorksService from '@/services/WorksService'

export default {
  components: {
    WorksPanel,
    WorksSearchPanel
  }
  // },
//   data () {
//     return {
//       works: null
//     }
//   },
//   methods: {
//     navigateTo (route) {
//       this.$router.push(route)
//     }
//   },
//   async mounted () {
//     // Request for all the works
//     // TODO: Que estas fechas sean variables en función de los datos que se necesiten recuperar para la aplicación
//     const dateStart = new Date('2019 03 01').valueOf()
//     const dateEnd = new Date('2019 04 01').valueOf()
//     this.works = (await WorksService.index(dateStart, dateEnd)).data
//   }
}
</script>

<style scoped>
/* .song {
  padding: 20px;
}

.work-name {
  font-size: 24px;
}

.work-email {
  font-size: 20px;
} */
</style>
