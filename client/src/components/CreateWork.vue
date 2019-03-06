<template>
  <v-layout row>
    <v-flex xs6>
      <panel title="Work basic">
        <v-text-field
          label="Name"
          class="required"
          :rules="[required]"
          v-model="work.name"
        ></v-text-field>

        <v-text-field
          label="Email"
          class="required"
          :rules="[required]"
          v-model="work.email"
        ></v-text-field>

        <v-text-field
          label="Phone"
          class="required"
          :rules="[required]"
          v-model="work.phone"
        ></v-text-field>

        <v-text-field
          label="Date Picked"
          class="required"
          :rules="[required]"
          v-model="work.datePicked"
        ></v-text-field>
      </panel>
    </v-flex>

    <v-flex xs6>
      <panel title="Work details" class="ml-2">
        <v-text-field
          label="Category"
          v-model="work.category"
          class="required"
          :rules="[required]"
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

      <v-btn
        class="cyan"
        dark
        @click='create'>
        Create Work
      </v-btn>
    </v-flex>
  </v-layout>
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
      required: (value) => !!value || 'Required.', // TODO: Cambiar con vuelidate
      error: null
    }
  },
  methods: {
    async create () {
      this.error = null
      // TODO: Cambiar con vuelidate
      const areAllFieldsFilledIn = Object
        .keys(this.work)
        .every(key => !!this.work[key])
      if (!areAllFieldsFilledIn) {
        this.error = 'Please fill in all the required fields.'
        return
      }

      try {
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
