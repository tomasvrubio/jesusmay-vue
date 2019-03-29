<template>
  <v-layout wrap>
    <v-flex
      xs6
      class="text-center">
      <v-btn
        class="cyan"
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
      xs6
      class="text-center">
      <v-btn
        class="cyan"
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
      <v-sheet>
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
          :interval-style="intervalStyle">
          <!-- the events at the top (all-day) -->
          <template v-slot:dayHeadere="{ date }">
            <div>
            <template v-for="event in eventsMap[date]">
              <!-- all day events don't have time -->
              <div
                v-if="event.vacation"
                :key="event.title"
                class="my-event with-vacation"
                @click="open(event)"
                v-html="event.title" />
            </template>
            </div>
          </template>
          <!-- the events at the bottom (timed) -->
          <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
            <template v-for="event in eventsMap[date]">
              <!-- timed events -->
              <div
                v-if="event.time"
                :key="event.title"
                :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                :class="['event', !event.vacation ? 'work' : 'vacation']"
                @click="open(event)"
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
import moment from 'moment'

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
    today: '2019-01-10',
    start: moment(this.today).day(1).format('YYYY-MM-DD'),
    end: moment(this.today).day(0).format('YYYY-MM-DD'),
    intervals: { first: 15, minutes: 30, count: 26, height: 40 },
    styleInterval: 'workday',
    events: [
      {
        title: 'Weekly Meeting',
        date: '2019-01-07',
        time: '09:00',
        duration: 45
      },
      {
        title: 'Thomas\' Birthday',
        date: '2019-01-10',
        time: '09:00',
        duration: 300,
        vacation: true
      },
      {
        title: 'Mash Potatoes',
        date: '2019-01-09',
        time: '12:30',
        duration: 180
      }
    ]
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
    }
  },
  mounted () {
    // this.$refs.calendar.scrollToTime('08:00')
    this.start = moment(this.today).day(1).format('YYYY-MM-DD')
    this.end = moment(this.today).day(0).format('YYYY-MM-DD')
  },
  methods: {
    open (event) {
      alert(event.title)
      console.log(this.today)
      console.log(this.start)
      console.log(this.end)
    },
    changePrev () {
      this.$refs.calendar.prev()
      this.start = moment(this.today).day(1).format('YYYY-MM-DD')
      this.end = moment(this.today).day(0).format('YYYY-MM-DD')
    },
    changeNext () {
      this.$refs.calendar.next()
      this.start = moment(this.today).day(1).format('YYYY-MM-DD')
      this.end = moment(this.today).day(0).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="stylus" scoped>
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
    left: 4px;
    margin-right: 8px;
    position: relative;
    &.work {
      position: absolute;
      right: 4px;
      margin-right: 0px;
    }
    &.vacation {
      position: absolute;
      right: 4px;
      margin-right: 0px;
      background-color: #C5C3C6;
    }
  }
</style>
