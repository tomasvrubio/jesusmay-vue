<template>
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
          name="work-name"
          label="Name"
          class="required"
          :rules="[required]"
          :disabled=isDisabled
          v-model="work.name"
        ></v-text-field>

        <v-text-field
          name="work-datePicked"
          label="Date Picked"
          class="required"
          :rules="[required]"
          :disabled=isDisabled
          v-model="work.datePicked"
        ></v-text-field>

        <v-text-field
          name="work-email"
          label="Email"
          class="required"
          :rules="[required]"
          :disabled=isDisabled
          v-model="work.email"
        ></v-text-field>

        <v-text-field
          name="work-phone"
          label="Phone"
          class="required"
          :rules="[required]"
          :disabled=isDisabled
          v-model="work.phone"
        ></v-text-field>

        <v-text-field
          name="work-category"
          label="Category"
          class="required"
          :rules="[required]"
          :disabled=isDisabled
          v-model="work.category"
        ></v-text-field>

        <v-textarea
          name="work-notes"
          label="Notes"
          multi-line
          :disabled=isDisabled
          :required=true
          v-model="work.notes"
        ></v-textarea>
      </panel>
      <div class="danger-alert" v-if="error">
        {{error}}
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import WorksService from '@/services/WorksService'
import Panel from '@/components/Panel'
import moment from 'moment'
// import { required, minLength, between } from 'vuelidate/lib/validators'

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
  // validations: {
  //   work.notes: {
  //     required
  //   }
  // },
  methods: {
    async edit () {
      this.isDisabled = false
    },
    async save () {
      // Deshabilitado por defecto
      // Envia info para guardar
      // Vuelve a estado inicial (deshabilitado y edit habilitado) o vuelve a listado de trabajos??

      console.log(this.required(this.work.notes))
      console.log(Object.keys(this.work))
      const areAllFieldsFilledIn = Object
        .keys(this.work)
        .every(key => {
          console.log(key)
          !!this.work[key]
        })
      if (!areAllFieldsFilledIn) {
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
    const day = moment(this.$store.state.route.params.datePicked).format('YYYYMMDD')
    const workId = this.$store.state.route.params.workId
    this.work = (await WorksService.show(day, workId)).data
    this.originalDate = this.$store.state.route.params.datePicked
  },
  components: {
    Panel
  }
}
</script>

<style scoped>

</style>
