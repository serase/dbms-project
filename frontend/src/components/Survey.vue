<template>
<div :key="componentKey" >
    <div v-if="!form.filled">
    <el-header class="">
        Survey
    </el-header>
    <el-main>
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item :model="form" label="Name" label-width="120px">
            <el-input
            v-model="form.name"
            :disabled="true">
            </el-input>
            </el-form-item>
            <el-form-item :model="form" label="First Name" label-width="120px">
            <el-input
            v-model="form.first_name"
            :disabled="true">
            </el-input>
            </el-form-item>
            <el-form-item :model="form" label="Email" label-width="120px">
            <el-input
            v-model="form.email_address"
            :disabled="true">
            </el-input>
            </el-form-item>
            <el-form-item :model="form" label="Age" label-width="120px">
                <el-input-number v-model="form.age" :min="18" :max="90"></el-input-number>
            </el-form-item>
            <el-form-item :model="form" label="Sex" label-width="120px">
                <el-radio v-model="form.sex" label=1>Male</el-radio>
                <el-radio v-model="form.sex" label=0>Female</el-radio>
            </el-form-item>
            <el-form-item :model="form" label="Married" label-width="120px">
                <el-switch v-model="form.married"></el-switch>
            </el-form-item>
            <el-form-item :model="form" label="Siblings" label-width="120px">
                <el-input-number v-model="form.siblings" :min="0" :max="20"></el-input-number>
            </el-form-item>
            <el-form-item :model="form" label="Children" label-width="120px">
                <el-input-number v-model="form.children" :min="0" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item :model="form" label="Work Experience in years" label-width="120px">
                <el-input-number v-model="form.experience" :min="0" :max="50"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="send_survey()">Send</el-button>
            </el-form-item>
        </el-form>
    </el-main>
  </div>
<div v-if="form.filled">
      This survey has already been filled in.
</div>
</div>
</template>

<script>
import api from '../api'
export default {
  name: 'Survey',
  data () {
    return {
      componentKey: 0,
      form: {
        age: 18,
        sex: 1,
        married: 1,
        siblings: 0,
        children: 0,
        experience: 0
      }
    }
  },
  mounted () {
    this.get_survey()
  },
  methods: {
    async get_survey () {
      this.form = await api.get_survey(this.$route.params.id)
    },
    async send_survey () {
      const result = await api.send_survey(this.$route.params.id, this.form.age, this.form.sex, this.form.married, this.form.siblings, this.form.children, this.form.experience)
      if (result.success) {
        this.$message(
          {message: result.message,
            type: 'success'})
      } else {
        this.$message.error(result.message)
      }
      this.forceRerender()
    },
    forceRerender () {
      this.get_survey()
      this.componentKey += 1
    }
  }
}
</script>

<style scoped>
</style>
