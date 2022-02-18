import axios from 'axios'
// eslint-disable-next-line no-path-concat

const client = axios.create({
  baseURL: 'http://localhost:3000/api/',
  json: true
})

export default {
  async execute (method, resource, data) {
    const url = resource
    return client({
      method,
      url: url,
      data
    }).then(req => {
      return req.data
    })
  },

  async get_hr_guys (adminId) {
    return this.execute('post', 'getHrGuys', { admin_id: adminId })
  },

  async show_quota_requests (adminId) {
    return this.execute('post', 'showQuotaRequests', { admin_id: adminId })
  },

  async deny_quota_request (hrGuyId) {
    return this.execute('post', 'denyQuotaRequest', { hr_guy_id: hrGuyId })
  },

  async send_quota_request (hrGuyId) {
    return this.execute('post', 'sendQuotaRequest', { hr_guy_id: hrGuyId })
  },

  async accept_quota_request (hrGuyId, quota) {
    return this.execute('post', 'acceptQuotaRequest', { hr_guy_id: hrGuyId, quota: quota })
  },

  async login (username, password) {
    return this.execute('post', 'login', { username: username, password: password })
  },

  async get_personal_data (id) {
    return this.execute('post', 'getPersonalData', { id: id })
  },

  async get_invitations (id) {
    return this.execute('post', 'getInvitations', { id: id })
  },

  async get_teams (id) {
    return this.execute('post', 'getTeams', { id: id })
  },

  async get_survey (id) {
    return this.execute('post', 'getSurvey', { id: id })
  },

  async get_team_members (hrGuyId, teamId) {
    return this.execute('post', 'getTeamMembers', { hr_guy_id: hrGuyId,
      team_id: teamId })
  },

  async get_team_stats (hrGuyId, teamId, metric) {
    return this.execute('post', 'getTeamStats', { hr_guy_id: hrGuyId,
      team_id: teamId,
      metric: metric })
  },
  async update_personal_data (id, name, firstName, company, emailAddress) {
    return this.execute('post', 'updatePersonalData', { identifier: id,
      name: name,
      first_name: firstName,
      company: company,
      email_address: emailAddress})
  },

  async send_survey (id, age, sex, married, siblings, children, experience) {
    return this.execute('post', 'sendSurvey', { id: id,
      age: age,
      sex: sex,
      married: married,
      siblings: siblings,
      children: children,
      experience: experience,
      filled: true
    })
  },

  async send_invite (hrGuyId, quotaLeft, name, firstName, emailAddress, teamName) {
    return this.execute('post', 'sendInvite', { hr_guy_id: hrGuyId,
      name: name,
      first_name: firstName,
      email_address: emailAddress,
      team: teamName,
      quota_left: quotaLeft})
  },

  async create_user (username, password, admin) {
    return this.execute('post', 'createUser', { username: username,
      password: password,
      admin: admin})
  }
}
