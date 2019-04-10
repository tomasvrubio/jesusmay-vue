<template>
  <v-form v-model="valid" @submit.prevent="create">
    <v-layout row>
      <v-flex xs6>
        <panel title="Work basic">
          <v-text-field
            v-model="work.name"
            v-validate="'required'"
            :error-messages="errors.collect('name')"
            label="Name"
            data-vv-name="name"
            class="required"
            required
          ></v-text-field>

          <v-text-field
            v-model="work.email"
            v-validate="'required|email'"
            :error-messages="errors.collect('email')"
            label="Email"
            data-vv-name="email"
            class="required"
            required
          ></v-text-field>

          <v-text-field
            v-model="work.phone"
            v-validate="'required'"
            :error-messages="errors.collect('phone')"
            label="Phone"
            data-vv-name="phone"
            class="required"
            required
          ></v-text-field>

          <v-text-field
            v-model="work.datePicked"
            v-validate="'required|date_format:yyyy/MM/dd HH:mm'"
            :error-messages="errors.collect('datePicked')"
            label="Date Picked"
            data-vv-name="datePicked"
            class="required"
            required
          ></v-text-field>

          <v-layout row wrap>
            <v-flex xs11 sm6 md6>
              <v-menu
                v-model="datePicker"
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
                    :value="picker.date"
                    :disabled=isDisabled
                    clearable
                    label="Dia Reserva"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="picker.date"
                  locale="es"
                  no-title
                  scrollable
                  :allowed-dates="allowedDates"
                  :min=minDatePicker
                  :max=maxDatePicker
                  @change="datePicker = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex md1 />

            <v-flex xs11 sm6 md6>
              <v-menu
                ref="menu"
                v-model="timePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="picker.time"
                lazytime
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="picker.time"
                    :disabled=isDisabled
                    locale="es"
                    label="Hora reserva"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="timePicker"
                  v-model="picker.time"
                  full-width
                  format="24hr"
                  :allowed-minutes="allowedStep"
                  @click:minute="$refs.menu.save(picker.time)"
                ></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </panel>
      </v-flex>

      <v-flex xs6>
        <panel title="Work details" class="ml-2">
          <v-text-field
            v-model="work.category"
            v-validate="'required'"
            :error-messages="errors.collect('category')"
            label="Category"
            data-vv-name="category"
            class="required"
            required
          ></v-text-field>

          <v-textarea
            v-model="work.notes"
            label="Notes"
            data-vv-name="notes"
            multi-line
          ></v-textarea>
        </panel>

        <div class="danger-alert" v-if="error">
          {{error}}
        </div>

        <v-btn
          class="cyan"
          dark
          type="submit">
          Create Work
        </v-btn>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
// import Panel from '@/components/Panel'
import moment from 'moment'
import WorksService from '@/services/WorksService'

export default {
  data () {
    return {
      work: {
        name: null,
        email: null,
        phone: null,
        datePicked: null,
        category: 'Corte',
        notes: null
      },
      error: null,
      picker: {
        date: null,
        time: null
      },
      datePicker: false,
      timePicker: false,
      minDatePicker: moment().format('YYYY-MM-DD'),
      maxDatePicker: moment().add(14,'days').format('YYYY-MM-DD')
    }
  },
  computed: {
    fullDate: function () {
      return ((this.picker.date && this.picker.time) ? new Date(`${this.picker.date} ${this.picker.time}`) : null)
    }
  },
  watch: {
    'work.datePicked': {
      inmediate: true,
      handler (value) {
        this.picker.date = moment(value).format('YYYY-MM-DD')
        this.picker.time = moment(value).format('HH:mm')
      }
    },
    'fullDate': {
      inmediate: true,
      handler (value) {
        console.log(value)
        this.work.datePicked = this.fullDate
      }
    }
  },  
  methods: {
    async create () {
      this.error = null
      var resultValidation = await this.$validator.validateAll()
      if (!resultValidation) {
        this.error = 'Please fill in all the required fields.'
        return
      }

      try {
        this.work.datePicked = new Date(this.work.datePicked)
        console.log(this.work.datePicked)
        await WorksService.post(this.work)
        this.$router.push({
          name: 'works'
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  async mounted () {
    const intendedDate = this.$store.state.route.params.datePicked

    if (intendedDate) {
      this.work.datePicked = moment(parseInt(intendedDate)).format('YYYY/MM/DD HH:mm')
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
