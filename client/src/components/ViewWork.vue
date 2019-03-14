<template>
  <v-layout row>
    <v-flex>
      <panel title="Work info">
        <v-btn
          class="cyan"
          @click='edit'
          small
          fab>
          <v-icon>edit</v-icon>
        </v-btn>

        <v-btn
          class="green"
          @click='save'
          small
          fab>
          <v-icon>save</v-icon>
        </v-btn>

        <v-btn
          class="red"
          @click='remove'
          small
          fab>
          <v-icon>delete</v-icon>
        </v-btn>

        <v-text-field
          label="Name"
          class="required"
          disabled
          :rules="[required]"
          v-model="work.name"
        ></v-text-field>

        <v-text-field
          label="Date Picked"
          class="required"
          :rules="[required]"
          v-model="work.datePicked"
        ></v-text-field>

        <v-text-field
          label="Email"
          class="required"
          disabled
          :rules="[required]"
          v-model="work.email"
        ></v-text-field>

        <v-text-field
          label="Phone"
          class="required"
          disabled
          :rules="[required]"
          v-model="work.phone"
        ></v-text-field>

        <v-text-field
          label="Category"
          class="required"
          :rules="[required]"
          v-model="work.category"
        ></v-text-field>

        <v-textarea
          label="Notes"
          multi-line
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

export default {
  data () {
    return {
      work: {},
      originalDate: null,
      required: (value) => !!value || 'Required.', // TODO: Cambiar con vuelidate
      error: null
    }
  },
  methods: {
    async edit () {
      console.log('Editing')
      // Habilitar formulario
      // Deshabilitar botones Edit / Delete
      // Habilitar boton Save

      // try {
      //   await WorksService.post(this.work)
      //   this.$router.push({
      //     name: 'works'
      //   })
      // } catch (err) {
      //   console.log(err)
      // }
    },
    async save () {
      console.log('Saving')
      // Deshabilitado por defecto
      // Envia info para guardar
      // Vuelve a estado inicial (deshabilitado y edit habilitado)

      // const areAllFieldsFilledIn = Object
      //   .keys(this.work)
      //   .every(key => !!this.work[key])
      // if (!areAllFieldsFilledIn) {
      //   this.error = 'Please fill in all the required fields.'
      //   return
      // }

      console.log(this.originalDate)
      const workId = this.$store.state.route.params.workId
      const newDate = new Date(this.work.datePicked).valueOf()
      const day = moment(Number(newDate)).format('YYYYMMDD')

      if (this.originalDate === newDate) {
        console.log('No ha cambiado la fecha')
        const day = moment(Number(newDate)).format('YYYYMMDD')
        try {
          await WorksService.put(day, this.work)
          this.$router.push({
            name: 'work',
            params: {
              datePicked: newDate,
              workId
            }
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log('La fecha ha cambiado')
        // Aquí lo que tengo que hacer es crear la nueva reserva (quitando el _id del objeto). Si la he podido crear tengo que borrar la actual.
        console.log(this.work)
        const oldDay = moment(Number(this.originalDate)).format('YYYYMMDD')
        const newWork = {
          name: this.work.name,
          email: this.work.email,
          phone: this.work.phone,
          datePicked: new Date(this.work.datePicked),
          category: this.work.category,
          notes: this.work.notes,
          state: this.work.state
        }
        console.log(newWork)
        try {
          await WorksService.post(newWork)
          await WorksService.delete(oldDay, workId)
          // Si ha ido bien aquí tengo que borrar el trabajo original
          this.$router.push({
            name: 'works'
          })
        } catch (err) {
          console.log(err)
        }
      }

      // const workId = this.$store.state.route.params.workId
      // const day = moment(this.$store.state.route.params.datePicked).format('YYYYMMDD')
      // this.work.name = 'Jaime' // TODO: Quitar

      // try {
      //   await WorksService.put(day, this.work)
      //   this.$router.push({
      //     name: 'work',
      //     params: {
      //       workId
      //     }
      //   })
      // } catch (err) {
      //   console.log(err)
      // }
    },
    async remove () {
      console.log('Removing')
      // Al pulsar sale un overlay para confirmar borrado
      // Si se pulsa no vuelve a donde estaba
      // Si se pulsa si se manda peticion para borrar
      // Con OK volvemos a listado

    //   try {
    //     await WorksService.post(this.work)
    //     this.$router.push({
    //       name: 'works'
    //     })
    //   } catch (err) {
    //     console.log(err)
    //   }
    }
  },
  async mounted () {
    const day = moment(this.$store.state.route.params.datePicked).format('YYYYMMDD')
    const workId = this.$store.state.route.params.workId
    this.work = (await WorksService.show(day, workId)).data
    this.originalDate = this.$store.state.route.params.datePicked

    // console.log(originalDate)
  },
  components: {
    Panel
  }
}
</script>

<style scoped>

</style>
