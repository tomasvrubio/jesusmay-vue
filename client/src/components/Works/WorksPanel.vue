<template>
  <panel title="Works">
    <v-btn
      slot="action"
      :to="{
        name: 'works-create',
        params: {
          datePicked: 0
        }
      }"
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
            :to="{
              name: 'work',
              params: {
                datePicked: new Date(work.datePicked).valueOf(),
                workId: work._id
              }
            }">
            View
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
  </panel>
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
    // navigateTo (route) {
    //   this.$router.push(route)
    // }
  },
  watch: {
    '$route.query': {
      inmediate: true,
      async handler (value) {
        const search = value.search
        const dateStart = new Date(value.dateStart).valueOf()
        const dateEnd = new Date(value.dateEnd).valueOf()
        this.works = (await WorksService.index(dateStart, dateEnd, search)).data
      }
    }
  },
  async mounted () {
    // Request for all the works
    // Esto lo he pasado al watcher
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
