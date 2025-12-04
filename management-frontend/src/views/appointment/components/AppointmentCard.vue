<template>
  <UniversalAppointmentCard
    :appointment="appointment"
    :chairs="chairs"
    :show-elements="showElements"
    :show-actions="showActions"
    :action-labels="actionLabels"
    :custom-height="customHeight"
    :tag-effect="tagEffect"
    empty-text="新建预约"
    @cell-click="handleCellClick"
    @mark-visited="markAsVisited"
    @edit-appointment="editAppointment"
    @delete-appointment="deleteAppointment"
  />
</template>

<script setup>
import UniversalAppointmentCard from '../../../components/UniversalAppointmentCard.vue'

const props = defineProps({
  appointment: {
    type: Object,
    default: null
  },
  chairs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cell-click', 'edit-appointment','mark-visited', 'delete-appointment'])

// Appointment 界面的配置 - 显示医生视角的信息
const showElements = {
  patientName: true,
  staffName: false,  // 在医生视图中不显示医生姓名（因为是按医生分列）
  staffIcon: false,
  visitType: true,
  chairInfo: false,  
  chairIcon: true,
  content: true,
  bookingInfo: false,
  timeInfo: false,
  actions: true
}

const showActions = {
  markVisited: true,
  edit: false,
  delete: true
}

const actionLabels = {
  markVisited: '标记就诊',
  edit: '编辑',
  delete: '删除'
}

const customHeight = '100px'
const tagEffect = 'light'

const handleCellClick = () => {
  emit('cell-click')
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
  height: 80px;
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