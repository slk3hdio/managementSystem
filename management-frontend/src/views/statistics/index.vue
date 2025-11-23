<template>
  <div class="statistics-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-card>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="时间范围">
              <el-select v-model="timeRange" placeholder="选择时间范围" style="width: 100%">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="timeRange === 'custom'">
            <el-form-item label="日期区间">
              <el-date-picker
                v-model="customDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="牙椅筛选">
              <el-select v-model="selectedChairs" placeholder="选择牙椅" multiple style="width: 100%">
                <el-option
                  v-for="chair in chairs"
                  :key="chair.chairId"
                  :label="`${chair.chairNum} (${chair.type})`"
                  :value="chair.chairId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="loadStatistics">
                <el-icon><Search /></el-icon>
                查询
              </el-button>
              <el-button @click="exportData">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 统计概览卡片 -->
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon">
                <el-icon size="32"><OfficeBuilding /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">{{ totalChairs }}</div>
                <div class="card-label">总牙椅数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon active">
                <el-icon size="32"><SuccessFilled /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">{{ activeChairs }}</div>
                <div class="card-label">活跃牙椅</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon">
                <el-icon size="32"><Timer /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">{{ totalUsageTime }}h</div>
                <div class="card-label">总使用时长</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon rate">
                <el-icon size="32"><DataAnalysis /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">{{ averageUsageRate }}%</div>
                <div class="card-label">平均使用率</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>牙椅使用率趋势</span>
                <el-radio-group v-model="chartType" size="small">
                  <el-radio-button label="line">折线图</el-radio-button>
                  <el-radio-button label="bar">柱状图</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div id="usageChart" style="height: 400px; position: relative;"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>牙椅使用率对比</span>
            </template>
            <div id="pieChart" style="height: 400px; position: relative;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 详细数据表格 -->
    <div class="table-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>牙椅使用详细数据</span>
            <div class="header-actions">
              <el-input
                v-model="searchText"
                placeholder="搜索牙椅编号"
                prefix-icon="Search"
                style="width: 200px; margin-right: 10px;"
                clearable
              />
              <el-button size="small" @click="refreshData">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <el-table
          :data="filteredUsageData"
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="chairNum" label="牙椅编号" width="100" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.type === '诊疗' ? '' : 'info'">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalTime" label="总可用时长" width="120">
            <template #default="scope">
              {{ scope.row.totalTime }}分钟
            </template>
          </el-table-column>
          <el-table-column prop="usedTime" label="实际使用时长" width="140">
            <template #default="scope">
              {{ scope.row.usedTime }}分钟
            </template>
          </el-table-column>
          <el-table-column prop="usageRate" label="使用率" width="100">
            <template #default="scope">
              <el-progress
                :percentage="scope.row.usageRate"
                :color="getUsageRateColor(scope.row.usageRate)"
                :stroke-width="6"
              />
            </template>
          </el-table-column>
          <el-table-column prop="appointmentCount" label="预约数量" width="100" />
          <el-table-column prop="completedCount" label="完成数量" width="100" />
          <el-table-column prop="completionRate" label="完成率" width="100">
            <template #default="scope">
              {{ scope.row.completionRate }}%
            </template>
          </el-table-column>
          <el-table-column label="趋势" width="120">
            <template #default="scope">
              <span :class="getTrendClass(scope.row.trend)">
                {{ scope.row.trend }}%
                <el-icon>
                  <CaretTop v-if="scope.row.trend > 0" />
                  <CaretBottom v-if="scope.row.trend < 0" />
                </el-icon>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetails(scope.row)">
                详情
              </el-button>
              <el-button size="small" type="primary" @click="viewChart(scope.row)">
                图表
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search,
  Download,
  OfficeBuilding,
  SuccessFilled,
  Timer,
  DataAnalysis,
  Refresh,
  CaretTop,
  CaretBottom
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const timeRange = ref('week')
const customDateRange = ref([])
const selectedChairs = ref([])
const chartType = ref('line')
const searchText = ref('')

// 牙椅数据
const chairs = ref([
  { chairId: 1, chairNum: '001', type: '诊疗' },
  { chairId: 2, chairNum: '002', type: '诊疗' },
  { chairId: 3, chairNum: '003', type: '洁牙维保' },
  { chairId: 4, chairNum: '004', type: '诊疗' },
  { chairId: 5, chairNum: '005', type: '洁牙维保' },
])

// 使用率统计数据
const usageData = ref([
  {
    chairId: 1,
    chairNum: '001',
    type: '诊疗',
    totalTime: 480,
    usedTime: 360,
    usageRate: 75,
    appointmentCount: 8,
    completedCount: 6,
    completionRate: 75,
    trend: 5
  },
  {
    chairId: 2,
    chairNum: '002',
    type: '诊疗',
    totalTime: 480,
    usedTime: 420,
    usageRate: 88,
    appointmentCount: 10,
    completedCount: 9,
    completionRate: 90,
    trend: -2
  },
  {
    chairId: 3,
    chairNum: '003',
    type: '洁牙维保',
    totalTime: 480,
    usedTime: 240,
    usageRate: 50,
    appointmentCount: 5,
    completedCount: 4,
    completionRate: 80,
    trend: 8
  },
  {
    chairId: 4,
    chairNum: '004',
    type: '诊疗',
    totalTime: 480,
    usedTime: 380,
    usageRate: 79,
    appointmentCount: 9,
    completedCount: 7,
    completionRate: 78,
    trend: 3
  },
  {
    chairId: 5,
    chairNum: '005',
    type: '洁牙维保',
    totalTime: 480,
    usedTime: 200,
    usageRate: 42,
    appointmentCount: 4,
    completedCount: 3,
    completionRate: 75,
    trend: -5
  },
])

// 计算属性
const filteredUsageData = computed(() => {
  let data = usageData.value

  if (searchText.value) {
    data = data.filter(item => item.chairNum.includes(searchText.value))
  }

  if (selectedChairs.value.length > 0) {
    data = data.filter(item => selectedChairs.value.includes(item.chairId))
  }

  return data
})

const totalChairs = computed(() => chairs.value.length)

const activeChairs = computed(() => {
  return usageData.value.filter(item => item.usageRate > 0).length
})

const totalUsageTime = computed(() => {
  return Math.round(usageData.value.reduce((sum, item) => sum + item.usedTime, 0) / 60)
})

const averageUsageRate = computed(() => {
  if (usageData.value.length === 0) return 0
  const totalRate = usageData.value.reduce((sum, item) => sum + item.usageRate, 0)
  return Math.round(totalRate / usageData.value.length)
})

// 方法
const getUsageRateColor = (rate) => {
  if (rate >= 80) return '#67c23a'
  if (rate >= 60) return '#e6a23c'
  return '#f56c6c'
}

const getTrendClass = (trend) => {
  if (trend > 0) return 'trend-up'
  if (trend < 0) return 'trend-down'
  return 'trend-flat'
}

const loadStatistics = () => {
  loading.value = true
  // 这里应该调用API获取统计数据
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据加载完成')
    updateCharts()
  }, 1000)
}

const refreshData = () => {
  loadStatistics()
}

const exportData = () => {
  ElMessage.success('导出功能开发中...')
}

const viewDetails = (row) => {
  ElMessage.info(`查看 ${row.chairNum} 牙椅详情`)
}

const viewChart = (row) => {
  ElMessage.info(`查看 ${row.chairNum} 牙椅图表`)
}

const updateCharts = () => {
  // 这里可以集成 ECharts 或其他图表库
  // 由于没有安装图表库，这里只是占位
  console.log('更新图表')
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.statistics-container {
  padding: 0;
}

.filter-section {
  margin-bottom: 20px;
}

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  height: 120px;
}

.card-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ecf5ff;
  color: #409eff;
  margin-right: 15px;
}

.card-icon.active {
  background-color: #f0f9ff;
  color: #67c23a;
}

.card-icon.rate {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.card-info {
  flex: 1;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.card-label {
  font-size: 16px;
  color: #909399;
}

.charts-section {
  margin-bottom: 20px;
}

.table-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.trend-flat {
  color: #909399;
}

/* 图表容器占位样式 */
#usageChart, #pieChart {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  background-color: #fafafa;
  border-radius: 4px;
}

#usageChart::before, #pieChart::before {
  content: '图表区域（可集成 ECharts）';
}
</style>