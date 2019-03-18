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

          <!-- TODO: Poner validaciones de lo que falta (tlf, fecha...) -->
          <v-text-field
            v-model="work.phone"
            v-validate="'required'"
            :error-messages="errors.collect('phone')"
            label="Phone"
            data-vv-name="phone"
            class="required"
            required
          ></v-text-field>

          <!-- TODO: Aquí tengo que poner un datePicker -->
          <v-text-field
            v-model="work.datePicked"
            v-validate="'required'"
            :error-messages="errors.collect('datePicked')"
            label="Date Picked"
            data-vv-name="datePicked"
            class="required"
            required
          ></v-text-field>
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
import Panel from '@/components/Panel'
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
      error: null
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
        await WorksService.post(this.work)
        this.$router.push({
          name: 'works'
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  components: {
    Panel
  }
}
</script>

<style scoped>

</style>
