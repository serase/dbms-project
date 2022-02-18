<template>
    <center>
    <div>
    <el-header>
        Team members of Team Number {{ $route.params.team_id }}
    </el-header>
    <el-main>
        <el-table
        :data="members"
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
        label="Name"
        width="180">
        </el-table-column>
        <el-table-column
        prop="first_name"
        label="First name"
        width="180">
        </el-table-column>
        <el-table-column
        prop="email_address"
        label="Email"
        width="180">
        </el-table-column>
        <el-table-column
        prop="filled"
        label="Filled"
        width="180">
        </el-table-column>
        </el-table>
    </el-main>
    <el-header>
        Statistics
    </el-header>
    <el-main :key="componentKey">
    Select your dimension
    <el-select v-model="value" clearable placeholder="Select" @change="get_team_stats()">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
    </el-select>
        <apexchart ref="donut" width="350" type="donut" :options="donut.chartOptions" :series="donut.series"></apexchart>
        <apexchart width="500" height="350" type="bar" :options="bar.chartOptions" :series="bar.series"></apexchart>

    </el-main>
  </div>
  </center>
</template>

<script>
import api from '../api'
export default {
  name: 'StatisticsView',
  data () {
    return {
      componentKey: 0,
      members: [
      ],
      stats: [
        {name: 'Team Number 1',
          size: 4,
          company: 'Test GmbH'}
      ],
      donut: {
        chartOptions: {
          labels: []
        },
        series: []
      },
      bar: {
        chartOptions: {
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          xaxis: {
            categories: []
          }
        },
        series: [{
          name: '',
          data: []
        }]
      },
      options: [{
        value: 'age',
        label: 'Age'
      }, {
        value: 'sex',
        label: 'Sex'
      }, {
        value: 'children',
        label: 'Children'
      }, {
        value: 'siblings',
        label: 'Siblings'
      }, {
        value: 'married',
        label: 'Marital Status'
      }],
      value: ''
    }
  },
  mounted () {
    this.get_team_members()
  },
  methods: {
    async get_team_members () {
      this.members = await api.get_team_members(this.$route.params.hr_id, this.$route.params.team_id)
    },
    async get_team_stats () {
      const stats = await api.get_team_stats(this.$route.params.hr_id, this.$route.params.team_id, this.value)
      if (stats.length > 0) {
        let data = {}
        Object.keys(stats[0]).forEach(k => {
          data[k] = stats.map(o => o[k])
        })
        this.donut.series = data.cnt
        this.donut.chartOptions.labels = data[this.value]
        this.bar.series = [{name: this.value,
          data: data.cnt}]
        this.bar.chartOptions.xaxis.categories = data[this.value]
        console.log('render!')
        console.log(data)
        this.forceRerender()
      } else {
        this.$message.error('No data for this dimension')
      }
    },
    async team_stats_update () {
      this.forceRerender()
    },
    forceRerender () {
      this.componentKey += 1
    }
  }
}
</script>

<style scoped>
</style>
