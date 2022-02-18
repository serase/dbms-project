<template>
    <div>
    <div :key="componentKey" v-if="personal != {}">
    <el-header class="">
        My information
    </el-header>
    <el-main>
        <el-form ref="personal" :model="personal" label-width="120px">
            <el-form-item label="Name">
                <el-input v-model="personal.name"></el-input>
            </el-form-item>
            <el-form-item :model="personal" label="First Name" label-width="120px">
                <el-input v-model="personal.first_name"></el-input>
            </el-form-item>
            <el-form-item :model="personal" label="Email" label-width="120px">
                <el-input v-model="personal.email_address"></el-input>
            </el-form-item>
            <el-form-item :model="personal" label="Company" label-width="120px">
                <el-input v-model="personal.company"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="update_personal_data()">Update</el-button>
            </el-form-item>
        </el-form>
    </el-main>
    <el-main>
    <el-row>
    <el-col :span="12"><div class="grid-content">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
        <span>Invitations Sent</span>
        </div>
        <div v-text="invitations.message" class="text item">
        </div>
        </el-card>
    </div>
    </el-col>
    <el-col :span="12"><div class="grid-content">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
        <span>Quota Left</span>
        </div>
        <div v-text="personal.quota_left" class="text item">
        </div>
        </el-card>
    </div>
    </el-col>
    </el-row>
    </el-main>
    <el-main>
    <el-button type="primary" v-if="!personal.request_open" @click="request_quota()">Request more quota</el-button>
    </el-main>
    <el-header>
        Send out invite
    </el-header>
    <el-main>
        <el-form ref="invite" :model="invite" label-width="120px">
            <el-form-item label="Name">
                <el-input v-model="invite.name"></el-input>
            </el-form-item>
            <el-form-item :model="invite" label="First Name" label-width="120px">
                <el-input v-model="invite.first_name"></el-input>
            </el-form-item>
            <el-form-item :model="invite" label="Email" label-width="120px">
                <el-input v-model="invite.email_address"></el-input>
            </el-form-item>
            <el-form-item :model="invite" label="Team Name" label-width="120px">
                <el-input v-model="invite.team"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-if="personal.quota_left > 0" @click="send_invite()">Invite</el-button>
                <el-button type="primary" v-if="personal.quota_left <= 0" disabled>Invite</el-button>
            </el-form-item>
        </el-form>
    </el-main>
    <el-header>
        Teams for HR Guy
    </el-header>
    <el-main>
        <center>
        <el-table
        :data="teams"
        stripe
        style="width: 100%"
        empty-text="No Data">
        <el-table-column
        prop="id"
        label="ID"
        width="180">
        </el-table-column>
        <el-table-column
        prop="name"
        label="Team Name"
        width="180">
        </el-table-column>
        <el-table-column
        prop="team_size"
        label="Team Size"
        width="180">
        </el-table-column>
        <el-table-column
        label="Operations"
        width="120">
        <template slot-scope="scope">
            <el-button type="info" @click="go_to_stats(scope.row.id)">Info</el-button>
        </template>
        </el-table-column>
        </el-table>
        </center>
    </el-main>
  </div>
  <div v-if="!personal.name">
      HR Guy doesn't exist
  </div>
</div>
</template>

<script>
import api from '../api'
export default {
  name: 'HrView',
  data () {
    return {
      componentKey: 0,
      personal: {},
      invitations: 99,
      teams: [
      ],
      invite: {
        name: '',
        first_name: '',
        email_address: '@example.com',
        team: ''
      }
    }
  },
  mounted () {
    this.get_personal_data()
    this.get_invitations()
    this.get_teams()
  },
  methods: {
    async get_personal_data () {
      this.personal = await api.get_personal_data(this.$route.params.id)
    },
    async get_teams () {
      this.teams = await api.get_teams(this.$route.params.id)
    },
    async update_personal_data () {
      const result = await api.update_personal_data(this.$route.params.id, this.personal.name, this.personal.first_name, this.personal.company, this.personal.email_address)
      if (result.success) {
        this.$message(
          {message: result.message,
            type: 'success'})
      } else {
        this.$message.error(result.message)
      }
      this.forceRerender()
    },
    async get_invitations () {
      this.invitations = await api.get_invitations(this.$route.params.id)
    },
    async request_quota () {
      const result = await api.send_quota_request(this.$route.params.id)
      if (result.success) {
        this.$message(
          {message: result.message,
            type: 'success'})
      } else {
        this.$message.error(result.message)
      }
      this.forceRerender()
    },
    async send_invite () {
      const result = await api.send_invite(this.$route.params.id, this.personal.quota_left, this.invite.name, this.invite.first_name, this.invite.email_address, this.invite.team)
      if (result.success) {
        this.$message(
          {message: result.message,
            type: 'success'})
      } else {
        this.$message.error(result.message)
      }
      this.forceRerender()
    },
    async go_to_stats (id) {
      this.$router.push(`/teams/${this.$route.params.id}/${id}/statistics/`)
    },
    forceRerender () {
      this.get_personal_data()
      this.get_teams()
      this.get_invitations()
      this.componentKey += 1
    }
  }
}
</script>

<style scoped>
</style>
