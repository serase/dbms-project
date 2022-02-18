<template>
  <div class="login">
    <el-header>
        Login
    </el-header>
    <el-main>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="Identifier">
                    <el-input v-model="form.identifier"></el-input>
                </el-form-item>
                <el-form-item :model="form" label="Password" label-width="120px">
                    <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login()">Login</el-button>
                </el-form-item>
        </el-form>
    </el-main>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        identifier: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      const result = await api.login(this.form.identifier, this.form.password)
      if (result.success) {
        this.$message(
          {message: result.message,
            type: 'success'})
        this.$router.push(`hrview/${this.form.identifier}`)
      } else {
        this.$message.error(result.message)
      }
    }
  }
}
</script>
<style scoped>

</style>
