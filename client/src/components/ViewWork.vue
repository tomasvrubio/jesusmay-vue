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
          disabled
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

      const workId = this.$store.state.route.params.workId
      const day = moment(this.$store.state.route.params.datePicked).format('YYYYMMDD')
      this.work.name = 'Jaime' // TODO: Quitar

      try {
        await WorksService.put(day, this.work)
        this.$router.push({
          name: 'work',
          params: {
            workId
          }
        })
      } catch (err) {
        console.log(err)
      }
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

    console.log(this.work)
  },
  components: {
    Panel
  }
}
</script>

<style scoped>

</style>
