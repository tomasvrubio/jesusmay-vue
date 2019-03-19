<template>
  <v-layout row>
    <v-flex xs8 offset-xs2>
      <panel title="Works">
        <v-btn
          slot="action"
          @click="navigateTo({name: 'works-create'})"
          class="white"
          light
          small
          absolute
          right
          middle
          fab>
          <v-icon>add</v-icon>
        </v-btn>
        <div v-for="work in works"
          :key="work._id"
          class="work">
          <v-layout>
            <v-flex xs6>
              <div class="work-name">
                {{work.name}}
              </div>
              <div class="work-email">
                {{work.email}}
              </div>
              <div class="work-phone">
                {{work.phone}}
              </div>
            </v-flex>

            <v-flex xs6>
              <div class="work-datePicked">
                {{work.datePicked}}
              </div>
              <v-btn
                class="cyan"
                dark
                @click="navigateTo({name:'work', params: {datePicked:new Date(work.datePicked).valueOf(), workId:work._id}})">
                View
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
// import Panel from '@/components/Panel'
import WorksService from '@/services/WorksService'

export default {
  // components: {
  //   Panel
  // },
  data () {
    return {
      works: null
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  },
  async mounted () {
    // Request for all the works
    // TODO: Que estas fechas sean variables en función de los datos que se necesiten recuperar para la aplicación
    const dateStart = new Date('2019 03 01').valueOf()
    const dateEnd = new Date('2019 04 01').valueOf()
    this.works = (await WorksService.index(dateStart, dateEnd)).data
  }
}
</script>

<style scoped>
.song {
  padding: 20px;
}

.work-name {
  font-size: 24px;
}

.work-email {
  font-size: 20px;
}
</style>
