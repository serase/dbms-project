<template>
    <div>
    <el-header>
    HR guys for for Admin {{ $route.params.id }}
    </el-header>
    <el-main>
        <el-table
        :key="componentKey"
        :data="data"
        stripe
        style="width: 100%"
        empty-text="No Data">
        <el-table-column
        prop="identifier"
        label="ID"
        width="180">
        </el-table-column>
        <el-table-column
        prop="name"
        label="Name"
        width="180">
        </el-table-column>
        <el-table-column
        prop="first_name"
        label="First Name"
        width="180">
        </el-table-column>
        <el-table-column
        prop="company"
        label="Company">
        </el-table-column>
        <el-table-column
        prop="email_address"
        label="Email">
        </el-table-column>
        <el-table-column
        prop="quota_left"
        label="Quota Left">
        </el-table-column>
        </el-table>
    </el-main>
    <el-header class="">
        Add a new client
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
                    <el-button type="primary" @click="create_user()">Create</el-button>
                    <el-button>Cancel</el-button>
                </el-form-item>
        </el-form>
    </el-main>
    <el-header>
        Quota Requests
    </el-header>
    <el-main>
        <el-table
        :data="requests"
        stripe
        style="width: 100%"
        empty-text="No Data">
        <el-table-column
        prop="identifier"
        label="ID"
        width="180">
        </el-table-column>
        <el-table-column
        prop="name"
        label="Name"
        width="180">
        </el-table-column>
        <el-table-column
        prop="first_name"
        label="First Name"
        width="180">
        </el-table-column>
        <el-table-column
        prop="company"
        label="Company">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="Operations"
        width="120">
        <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" circle @click="accept(scope.row.identifier, scope.row.quota_left)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deny(scope.row.identifier)" ></el-button>
        </template>
        </el-table-column>
        </el-table>
    </el-main>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'AdminView',
  data () {
    return {
      componentKey: 0,
      'data': [
      ],
      form: {
        identifier: '',
        password: ''
      },
      requests: [
      ]
    }
  },
  async mounted () {
    this.show_hr_guys()
    this.show_quota_requests()
  },
  methods: {
    async create_user () {
      let result = await api.create_user(this.form.identifier, this.form.password, this.$route.params.id)
      console.log(result)
      if (result.success) {
        this.$message(
          {message: result.message,
            type: 'success'})
      } else {
        this.$message.error(result.message)
      }
      this.forceRerender()
    },
    async show_hr_guys () {
      this.data = await api.get_hr_guys(this.$route.params.id)
    },
    async show_quota_requests () {
      this.requests = await api.show_quota_requests(this.$route.params.id)
    },
    async deny (hrGuyId) {
      const result = await api.deny_quota_request(hrGuyId)
      if (result.success) {
        this.$message(
          {message: result.message,
            type: 'success'})
      } else {
        this.$message.error(result.message)
      }
      this.forceRerender()
    },
    async accept (hrGuyId, quota) {
      const result = await api.accept_quota_request(hrGuyId, quota)
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
      this.show_hr_guys()
      this.show_quota_requests()
      this.componentKey += 1
    }
  }
}
</script>

<style scoped>
</style>
