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

          <v-text-field
            v-model="work.datePicked"
            v-validate="'required|date_format:yyyy/MM/dd HH:mm'"
            :error-messages="errors.collect('datePicked')"
            :disabled=isDisabled
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
      isDisabled: true
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
    }
  },
  async mounted () {
    const day = moment(parseInt(this.$store.state.route.params.datePicked)).format('YYYYMMDD')
    const workId = this.$store.state.route.params.workId
    this.work = (await WorksService.show(day, workId)).data
    this.work.datePicked = moment(this.work.datePicked).format('YYYY/MM/DD HH:mm')
    this.originalDate = this.$store.state.route.params.datePicked
  }
}
</script>

<style scoped>

</style>
