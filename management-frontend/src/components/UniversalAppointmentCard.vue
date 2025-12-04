<template>
  <div class="appointment-cell" :class="{ 'custom-height': customHeight }" :style="{ height: customHeight || 'auto' }"
    @click="handleCellClick">
    <div v-if="appointment" class="appointment-content" :class="{ 'visited': appointment.isVisited, ...customClasses }">
      <!-- 自定义内容区域 -->
      <div class="appointment-custom-content">
        <!-- 患者姓名 -->
        <div v-if="showElements.patientName" class="patient-name">
          {{ appointment.patientName }}
        </div>

        <!-- 医生姓名 -->
        <div v-if="showElements.staffName" class="staff-name">
          <el-icon v-if="showElements.staffIcon" class="staff-icon">
            <User />
          </el-icon>
          {{ appointment.staffName }}
        </div>

        <div class="treatment-info">
          <!-- 就诊类型标签 -->
          <span v-if="showElements.visitType" class="visit-type">
            <el-tag size="small" :type="getVisitTypeTagType(appointment.visitType) || 'info'" :effect="tagEffect">
              {{ appointment.visitType }}
            </el-tag>

            <!-- 治疗内容 -->
            <span v-if="showElements.content" class="treatment-content">
              {{ appointment.content }}
            </span>
          </span>
        </div>

        <!-- 牙椅信息 -->
        <div v-if="showElements.chairInfo" class="chair-info">
          <el-icon v-if="showElements.chairIcon" class="chair-icon">
            <Monitor />
          </el-icon>
          {{ getChairDisplay(appointment.chairId) }}
        </div>

        <!-- 预约信息 -->
        <div v-if="showElements.bookingInfo" class="booking-info">
          <span class="booker">{{ appointment.booker }}</span>
          <span class="channel">• {{ appointment.bookChannel }}</span>
          <el-tag v-if="appointment.needFollow" size="small" type="warning" effect="plain">需跟进</el-tag>
        </div>

        <!-- 时间信息 -->
        <div v-if="showElements.timeInfo" class="time-info">
          <el-icon>
            <Clock />
          </el-icon>
          {{ appointment.timeSlot }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div v-if="showElements.actions" class="appointment-actions">
        <el-button v-if="!appointment.isVisited && showActions.markVisited" size="small" type="success"
          @click.stop="markAsVisited">
          {{ actionLabels.markVisited }}
        </el-button>
        <el-button v-if="showActions.edit" size="small" @click.stop="editAppointment">
          {{ actionLabels.edit }}
        </el-button>
        <el-button v-if="showActions.delete" size="small" type="danger" @click.stop="deleteAppointment">
          {{ actionLabels.delete }}
        </el-button>
      </div>
    </div>

    <!-- 空白状态 -->
    <div v-else class="empty-cell" @click.stop="createNewAppointment">
      <el-icon>
        <Plus />
      </el-icon>
      <span>{{ emptyText }}</span>
    </div>
  </div>
</template>

<script setup>
import { Plus, User, Monitor, Clock } from '@element-plus/icons-vue'
import { computed } from 'vue'

const props = defineProps({
  // 预约数据
  appointment: {
    type: Object,
    default: null
  },

  // 显示元素配置
  showElements: {
    type: Object,
    default: () => ({
      patientName: true,
      staffName: true,
      staffIcon: false,
      visitType: true,
      chairInfo: false,
      chairIcon: false,
      content: true,
      bookingInfo: false,
      timeInfo: false,
      actions: true
    })
  },

  // 操作按钮配置
  showActions: {
    type: Object,
    default: () => ({
      markVisited: true,
      edit: true,
      delete: true
    })
  },

  // 按钮标签
  actionLabels: {
    type: Object,
    default: () => ({
      markVisited: '标记就诊',
      edit: '编辑',
      delete: '删除'
    })
  },

  // 样式配置
  customHeight: {
    type: String,
    default: null
  },

  customClasses: {
    type: Object,
    default: () => ({})
  },

  tagEffect: {
    type: String,
    default: 'light' // light, dark, plain
  },

  emptyText: {
    type: String,
    default: '新建预约'
  },

  // 牙椅数据（用于显示牙椅信息）
  chairs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cell-click', 'create-appointment', 'edit-appointment', 'mark-visited', 'delete-appointment'])

const getVisitTypeTagType = (visitType) => {
  const typeMap = {
    '初诊': 'primary',
    '复查': 'warning',
    '洁牙': 'success',
    '维保': 'info'
  }
  return typeMap[visitType] || 'info'
}

const getChairDisplay = computed(() => {
  return (chairId) => {
    const chair = props.chairs.find(c => c.chairId === chairId)
    return chair ? `${chair.chairNum} (${chair.type})` : ''
  }
})

const handleCellClick = () => {
  emit('cell-click')
}

const createNewAppointment = () => {
  emit('create-appointment')
}

const editAppointment = () => {
  emit('edit-appointment')
}

const markAsVisited = () => {
  emit('mark-visited')
}

const deleteAppointment = () => {
  emit('delete-appointment')
}
</script>

<style scoped>
.appointment-cell {
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-height: 80px;
}

.appointment-cell:hover {
  background-color: #f5f7fa;
}

.appointment-content {
  height: 100%;
  padding: 8px;
  border-radius: 6px;
  background-color: #e1f3d8;
  border-left: 3px solid #67c23a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.appointment-content.visited {
  background-color: #f4f4f5;
  border-left-color: #909399;
}

.appointment-custom-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.patient-name {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
  line-height: 1.2;
}

.staff-name {
  font-size: 12px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 4px;
}

.staff-icon,
.chair-icon {
  font-size: 12px;
  color: #909399;
}

.visit-type {
  display: flex;
  align-items: center;
}

.chair-info {
  font-size: 12px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 4px;
}

.treatment-content {
  font-size: 12px;
  color: #909399;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.booking-info {
  font-size: 11px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 6px;
}

.booking-info .channel {
  color: #c0c4cc;
}

.time-info {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.appointment-actions {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.appointment-actions .el-button {
  padding: 2px 8px;
  font-size: 11px;
  height: 24px;
}

.empty-cell {
  height: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  border: 1px dashed #c0c4cc;
  border-radius: 6px;
  transition: all 0.2s;
  gap: 4px;
}

.empty-cell:hover {
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
}

.empty-cell .el-icon {
  font-size: 16px;
}

.empty-cell span {
  font-size: 12px;
}

/* 自定义高度类 */
.custom-height {
  overflow: hidden;
}
</style>