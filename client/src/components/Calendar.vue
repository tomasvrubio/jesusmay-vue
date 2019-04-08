<template>
  <v-layout wrap>
    <v-flex
      xs4
      class="text-center">
      <v-btn
        class="cyan font-weight-black"
        dark
        @click="changePrev()">
        <v-icon
          dark
          left>
          keyboard_arrow_left
        </v-icon>
        Prev
      </v-btn>
    </v-flex>

    <v-flex
      xs4
      class="text-center">
      <v-btn
        class="cyan font-weight-black"
        dark
        @click="viewMonth()">
        {{ startMonth }}
      </v-btn>
    </v-flex>

    <v-flex
      xs4
      class="text-center">
      <v-btn
        class="cyan font-weight-black"
        dark
        @click="changeNext()">
        Next
        <v-icon
          right
          dark>
          keyboard_arrow_right
        </v-icon>
      </v-btn>
    </v-flex>

    <v-flex
      xs12
      class="mt-2">
      <v-sheet class="caption">
        <!-- now is normally calculated by itself, but to keep the calendar in this date range to view events -->
        <v-calendar
          ref="calendar"
          locale="es"
          v-model="today"
          :now="today"
          :start="start"
          :end="end"
          color="primary"
          type="week"
          :weekdays="weekdays"
          :first-interval="intervals.first"
          :interval-minutes="intervals.minutes"
          :interval-count="intervals.count"
          :interval-height="intervals.height"
          :interval-style="intervalStyle"
          @click:day="viewDay"
          @click:date="viewDay"
          @click:time="freeSlot">
          <!-- the events at the top (all-day) -->
          <template v-slot:dayHeader="{ date }">
            <!-- <div class="red--text">Ho</div> -->
          </template>
          <!-- the events at the bottom (timed) -->
          <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
            <template v-for="event in eventsMap[date]">
              <!-- timed events -->
              <div
                :key="event.title"
                :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) - 1 + 'px' }"
                :class="['event', !event.vacation ? 'work' : 'vacation']"
                @click.stop="ocuppiedSlot(event)"
                v-html="event.title" />
            </template>
          </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
    <!-- TODO: Estoy pendiente el que arreglen cuando pulso un día de una semana diferente a la que empecé no se vaya todo al carajo. -->

  </v-layout>
</template>

<script>
import WorksService from '@/services/WorksService'
import moment from 'moment'
moment.locale('es')

const stylings = {
  default (interval) {
    return undefined
  },
  workday (interval) {
    const inactive = interval.weekday === 0 ||
      (interval.weekday === 6 && interval.hour >= 14) ||
      interval.hour < 8 ||
      interval.hour >= 20
    const startOfHour = interval.minute === 0
    const mid = 'rgba(0,0,0,0.1)'
    return {
      backgroundColor: inactive ? 'rgba(0,0,0,0.05)' : undefined,
      borderTop: startOfHour ? undefined : '1px dashed ' + mid
    }
  },
  past (interval) {
    return {
      backgroundColor: interval.past ? 'rgba(0,0,0,0.05)' : undefined
    }
  }
}
export default {
  data: () => ({
    minWeeks: 1,
    maxDays: 6,
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    // today: moment().format('YYYY-MM-DD'),
    // today: '2019-01-10',
    today: '2019-02-28',
    start: moment(this.today).day(1).format('YYYY-MM-DD'),
    end: moment(this.today).day(7).format('YYYY-MM-DD'),
    intervals: { first: 15, minutes: 30, count: 26, height: 40 },
    styleInterval: 'workday',
    events: []
    // events: [
    //   {
    //     title: 'Weekly Meeting',
    //     date: '2019-01-07',
    //     time: '09:00',
    //     duration: 30
    //   },
    //   {
    //     title: 'Weekly Meeting2',
    //     date: '2019-01-07',
    //     time: '09:30',
    //     duration: 30
    //   },
    //   {
    //     title: 'Weekly Meeting3',
    //     date: '2019-01-08',
    //     time: '09:30',
    //     duration: 30
    //   },
    //   {
    //     title: 'Thomas\' Birthday',
    //     date: '2019-01-10',
    //     time: '09:00',
    //     duration: 300,
    //     vacation: true
    //   },
    //   {
    //     title: 'Mash Potatoes',
    //     date: '2019-01-09',
    //     time: '12:30',
    //     duration: 30
    //   }
    // ]
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    intervalStyle () {
      return stylings[ this.styleInterval ].bind(this)
    },
    eventsMap () {
      const map = {}
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
      return map
    },
    startMonth () {
      return moment(this.start).format('MMMM')
    }
  },
  async mounted () {
    await this.getEvents()
  },
  methods: {
    async getEvents () {
      this.start = moment(this.today).day(1).format('YYYY-MM-DD')
      this.end = moment(this.today).day(7).format('YYYY-MM-DD')

      const dateStart = new Date(this.start).valueOf()
      const dateEnd = new Date(this.end).valueOf()
      const works = (await WorksService.index(dateStart, dateEnd)).data
      this.events = works.map(event => {
        return {
          title: event.name,
          date: moment(event.datePicked).format('YYYY-MM-DD'),
          time: event.hour,
          datePicked: event.datePicked,
          _id: event._id,
          duration: 30
        }
      })
    },
    async changePrev () {
      this.$refs.calendar.prev()
      await this.getEvents()
    },
    async changeNext () {
      this.$refs.calendar.next()
      await this.getEvents()
    },
    ocuppiedSlot (event) {
      this.$router.push({
        name: 'work',
        params: {
          datePicked: new Date(event.datePicked).valueOf(),
          workId: event._id
        }
      })
    },
    freeSlot (event) {
      const intendedMinute = event.minute < 30 ? '00' : '30'
      const intendedDate = new Date(`${event.date} ${event.hour}:${intendedMinute}`).valueOf()

      this.$router.push({
        name: 'works-create',
        params: {
          datePicked: intendedDate
        }
      })
    },
    viewDay (event) {
      console.log(event.date)
    },
    viewMonth (event) {
      console.log(this.start)
    }
  }
}
</script>

<style lang="stylus">
  .v-calendar-daily_head-day-label {
    font-size: 30px;
  }
  .event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #1985A1;
    color: #ffffff;
    border: 1px solid #C5C3C6;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
    left: 1px;
    margin-right: 2px;
    position: relative;
    &.work {
      position: absolute;
      right: 1px;
      margin-right: 0px;
    }
    &.vacation {
      position: absolute;
      right: 1px;
      margin-right: 0px;
      background-color: #C5C3C6;
    }
  }
</style>
