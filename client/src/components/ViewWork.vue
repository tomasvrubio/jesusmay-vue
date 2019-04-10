<template>
  <v-form v-model="valid">
    <v-layout row>
      <v-flex>
        <panel title="Work info">
          <v-btn
            class="cyan"
            @click='edit'
            :disabled=!isDisabled
            small
            fab>
            <v-icon>edit</v-icon>
          </v-btn>

          <v-btn
            class="green"
            @click='save'
            :disabled=isDisabled
            small
            fab>
            <v-icon>save</v-icon>
          </v-btn>

          <v-btn
            class="red"
            @click='remove'
            :disabled=!isDisabled
            small
            fab>
            <v-icon>delete</v-icon>
          </v-btn>

          <v-text-field
            v-model="work.name"
            v-validate="'required'"
            :error-messages="errors.collect('name')"
            :disabled=isDisabled
            label="Name"
            data-vv-name="name"
            class="required"
            required
          ></v-text-field>

          <v-text-field
            v-model="work.email"
            v-validate="'required|email'"
            :error-messages="errors.collect('email')"
            :disabled=isDisabled
            label="Email"
            data-vv-name="email"
            class="required"
            required
          ></v-text-field>

          <v-layout row wrap>
            <v-flex xs11 sm4 md3>
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
            <v-flex sm1 md1>
            </v-flex>

            <v-flex xs11 sm4 md3>
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

          <v-text-field
            v-model="work.datePicked"
            v-validate="'required|date_format:yyyy/MM/dd HH:mm'"
            :error-messages="errors.collect('datePicked')"
            disabled
            label="Date Picked"
            data-vv-name="datePicked"
            class="required"
            required
          ></v-text-field>

          <v-text-field
            v-model="work.phone"
            v-validate="'required'"
            :error-messages="errors.collect('phone')"
            :disabled=isDisabled
            label="Phone"
            data-vv-name="phone"
            class="required"
            required
          ></v-text-field>

          <v-text-field
            v-model="work.category"
            v-validate="'required'"
            :error-messages="errors.collect('category')"
            :disabled=isDisabled
            label="Category"
            data-vv-name="category"
            class="required"
            required
          ></v-text-field>

          <v-textarea
            v-model="work.notes"
            :disabled=isDisabled
            label="Notes"
            data-vv-name="notes"
            multi-line
          ></v-textarea>
        </panel>

        <div class="danger-alert" v-if="error">
          {{error}}
        </div>

      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import WorksService from '@/services/WorksService'
// import Panel from '@/components/Panel'
import moment from 'moment'

export default {
  data () {
    return {
      work: {},
      originalDate: null,
      required: (value) => !!value || 'Required.', // TODO: Cambiar con vuelidate
      error: null,
      isDisabled: true,
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
    async edit () {
      this.isDisabled = false
    },
    async save () {
      var resultValidation = await this.$validator.validateAll()
      if (!resultValidation) {
        this.error = 'Please fill in all the required fields.'
        return
      }

      const workId = this.$store.state.route.params.workId
      const newDate = new Date(this.work.datePicked).valueOf()

      if (this.originalDate === newDate) {
        // Sin cambio en fecha
        const day = moment(Number(newDate)).format('YYYYMMDD')

        try {
          await WorksService.put(day, this.work)
          this.$router.push({
            name: 'work',
            params: {
              datePicked: new Date(this.work.datePicked).valueOf(),
              workId: this.work._id
            }
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        // Con cambio en fecha
        const newWork = {
          name: this.work.name,
          email: this.work.email,
          phone: this.work.phone,
          datePicked: new Date(this.work.datePicked),
          category: this.work.category,
          notes: this.work.notes,
          state: this.work.state
        }
        const oldDay = moment(Number(this.originalDate)).format('YYYYMMDD')

        try {
          await WorksService.post(newWork)
          await WorksService.delete(oldDay, workId)
          this.$router.push({
            name: 'work',
            params: {
              datePicked: new Date(this.work.datePicked).valueOf(),
              workId: this.work._id
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
      this.isDisabled = true
    },
    async remove () {
      const day = moment(this.$store.state.route.params.datePicked).format('YYYYMMDD')
      const workId = this.$store.state.route.params.workId

      try {
        await WorksService.delete(day, workId)
        this.$router.push({
          name: 'works'
        })
      } catch (err) {
        console.log(err)
      }
    },
    allowedDates: val => parseInt(val.split('-')[2], 10) % 2 === 0, // TODO: Hacerlo con los huecos que tengo libres en el calendario
    allowedStep: m => m % 30 === 0 // TODO: Hacerlo con los huecos que tengo libres en el calendario
  },
  async mounted () {
    // Get parameters from store
    const day = moment(parseInt(this.$store.state.route.params.datePicked)).format('YYYYMMDD')
    const workId = this.$store.state.route.params.workId
    // Get Work data from DB
    this.work = (await WorksService.show(day, workId)).data
    // this.work.datePicked = moment(this.work.datePicked).format('YYYY/MM/DD HH:mm')
    // Keep this to check if date was modified when saving
    this.originalDate = this.$store.state.route.params.datePicked
  }
}
</script>

<style scoped>

</style>
