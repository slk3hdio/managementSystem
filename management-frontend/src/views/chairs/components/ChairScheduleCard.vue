<template>
  <div
    class="appointment-cell"
    @click="handleCellClick"
  >
    <div
      v-if="appointment"
      class="appointment-content"
      :class="{ 'visited': appointment.isVisited }"
    >
      
      <div class="treatment-info">
        
        <span class="patient-name">
        {{ appointment.patientName }}
        </span>
        <span class="treatment-content">
        <el-tag size="small" :type="getVisitTypeTagType(appointment.visitType) || 'info'">
          {{ appointment.visitType }}
        </el-tag>
        {{ appointment.content }}
      </span>
        
      </div>
      <div class="staff-name">{{ appointment.staffName }}</div>

      
      
      <div class="appointment-actions">
        <el-button
          v-if="!appointment.isVisited"
          size="small"
          type="success"
          @click.stop="markAsVisited"
        >
          标记就诊
        </el-button>
        <el-button
          size="small"
          @click.stop="editAppointment"
        >
          编辑
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click.stop="deleteAppointment"
        >
          删除
        </el-button>
      </div>
    </div>
    <div v-else class="empty-cell" @click.stop="createNewAppointment">
      <el-icon><Plus /></el-icon>
      <span>新建预约</span>
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'

defineProps({
  appointment: {
    type: Object,
    default: null
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
  height: 100px;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.appointment-cell:hover {
  background-color: #f5f7fa;
}

.appointment-content {
  height: 100%;
  padding: 6px;
  border-radius: 4px;
  background-color: #e1f3d8;
  border-left: 3px solid #67c23a;
}

.appointment-content.visited {
  background-color: #f4f4f5;
  border-left-color: #909399;
}

.patient-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.appointment-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.staff-name {
  font-size: 12px;
  color: #606266;
}

.treatment-content {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appointment-actions {
  display: flex;
  gap: 4px;
}

.appointment-actions .el-button {
  padding: 2px 6px;
  font-size: 11px;
}

.empty-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  border: 1px dashed #c0c4cc;
  border-radius: 4px;
  transition: all 0.2s;
}

.empty-cell:hover {
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
}

.empty-cell .el-icon {
  font-size: 16px;
  margin-bottom: 2px;
}

.empty-cell span {
  font-size: 12px;
}
</style>