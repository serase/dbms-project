import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import AdminView from '@/components/AdminView'
import Login from '@/components/Login'
import HrView from '@/components/HrView'
import Email from '@/components/Email'
import StatisticsView from '@/components/StatisticsView'
import Survey from '@/components/Survey'
import VueApexCharts from 'vue-apexcharts'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/admin/:id',
      name: 'AdminView',
      component: AdminView
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/hrview/:id',
      name: 'HrView',
      component: HrView
    },
    {
      path: '/email/:id',
      name: 'Email',
      component: Email
    },
    {
      path: '/teams/:hr_id/:team_id/statistics',
      name: 'StatisticsView',
      component: StatisticsView
    },
    {
      path: '/survey/:id',
      name: 'Survey',
      component: Survey
    }
  ]
})
