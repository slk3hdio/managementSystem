<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="card-content">
              <div class="card-icon appointment">
                <el-icon size="30"><Calendar /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">24</div>
                <div class="card-label">今日预约</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="card-content">
              <div class="card-icon chair">
                <el-icon size="30"><OfficeBuilding /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">78%</div>
                <div class="card-label">牙椅使用率</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="card-content">
              <div class="card-icon patient">
                <el-icon size="30"><User /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">8</div>
                <div class="card-label">待跟进患者</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="card-content">
              <div class="card-icon doctor">
                <el-icon size="30"><UserFilled /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">12</div>
                <div class="card-label">在岗医生</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 今日预约概览 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>今日预约安排</span>
                <el-button type="primary" size="small" @click="$router.push('/appointment')">
                  查看详情
                </el-button>
              </div>
            </template>
            <div class="appointment-list">
              <div v-for="item in todayAppointments" :key="item.id" class="appointment-item">
                <div class="time-info">
                  <div class="time">{{ item.time }}</div>
                  <div class="chair">{{ item.chair }}</div>
                </div>
                <div class="patient-info">
                  <div class="patient-name">{{ item.patient }}</div>
                  <div class="treatment">{{ item.treatment }}</div>
                </div>
                <div class="status-info">
                  <el-tag :type="item.status === '已就诊' ? 'success' : 'warning'" size="small">
                    {{ item.status }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>快速操作</span>
            </template>
            <div class="quick-actions">
              <el-button type="primary" icon="Plus" @click="$router.push('/appointment')" class="action-btn">
                新建预约
              </el-button>
              <el-button icon="User" @click="$router.push('/patients')" class="action-btn">
                患者建档
              </el-button>
              <el-button icon="DataAnalysis" @click="$router.push('/statistics')" class="action-btn">
                查看统计
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { Calendar, OfficeBuilding, User, UserFilled, Plus, DataAnalysis } from '@element-plus/icons-vue'

const todayAppointments = [
  {
    id: 1,
    time: '09:00',
    chair: '001号牙椅',
    patient: '张三',
    treatment: '多生牙复查',
    status: '待就诊'
  },
  {
    id: 2,
    time: '10:00',
    chair: '002号牙椅',
    patient: '李四',
    treatment: '常规洁牙',
    status: '已就诊'
  },
  {
    id: 3,
    time: '14:00',
    chair: '003号牙椅',
    patient: '王五',
    treatment: '牙齿矫正咨询',
    status: '待就诊'
  }
]
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  height: 120px;
}

.card-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.card-icon.appointment {
  background-color: #e1f3d8;
  color: #67c23a;
}

.card-icon.chair {
  background-color: #ecf5ff;
  color: #409eff;
}

.card-icon.patient {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.card-icon.doctor {
  background-color: #f4f4f5;
  color: #909399;
}

.card-info {
  flex: 1;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 5px;
}

.card-label {
  font-size: 14px;
  color: #909399;
}

.overview-section {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.appointment-list {
  max-height: 400px;
  overflow-y: auto;
}

.appointment-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.appointment-item:last-child {
  border-bottom: none;
}

.time-info {
  width: 100px;
  text-align: center;
}

.time {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.chair {
  font-size: 12px;
  color: #909399;
}

.patient-info {
  flex: 1;
  margin-left: 20px;
}

.patient-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.treatment {
  font-size: 12px;
  color: #606266;
}

.status-info {
  width: 80px;
  text-align: right;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-btn {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>