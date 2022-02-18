<template>
  <div>
  <div class="email" v-if="email.id">
    <el-header>
        Email
    </el-header>
    <el-main>
            <el-form ref="email" :model="email" label-width="120px">
                <el-form-item label="FROM">
                    <el-input v-model="mail_address" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :model="email" label="TO" label-width="120px">
                    <el-input v-model="email.email_address" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :model="email" label="SUBJECT" label-width="120px">
                    <el-input v-model="subject" :disabled="true"></el-input>
                </el-form-item>
                <div v-html=message></div>
        </el-form>
    </el-main>
  </div>
  <div v-if="!email.id">
  This email doesn't exist
  </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'Email',
  data () {
    return {
      mail_address: '',
      subject: '',
      email: {},
      message: ''
    }
  },
  mounted () {
    this.get_survey()
  },
  methods: {
    async get_survey () {
      this.email = await api.get_survey(this.$route.params.id)
      if (this.email) {
        this.mail_address = this.email.hr_guy_id.toString() + '@hrguys.com'
        this.message = `Hey ${this.email.first_name},<br> hope you are interested in filling in <a href="http://localhost:8080/#/survey/${this.$route.params.id}">this survey</a><br>Thanks in advance`
        this.subject = `Invitation for ${this.email.first_name} ${this.email.name}`
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
