<template>
  <div class="chairs-container">
    <!-- 顶部操作区 -->
    <ChairScheduleHeader
      v-model:selectedDate="selectedDate"
      @date-change="handleDateChange"
      @new-appointment="handleNewAppointment"
      @refresh="refreshData"
    />

    <!-- 牙椅预约表格 -->
    <ChairScheduleTable
      :table-data="chairScheduleData"
      :chairs="chairs"
      :loading="loading"
      @cell-click="handleCellClick"
      @create-appointment="createAppointment"
      @edit-appointment="editAppointment"
      @mark-visited="markAsVisited"
      @delete-appointment="deleteAppointment"
    />

    <!-- 新建/编辑预约对话框 -->
    <ChairScheduleDialog
      v-model:visible="appointmentDialogVisible"
      :is-editing="isEditing"
      :form-data="appointmentForm"
      :patients="patients"
      :chairs="chairs"
      :staff="staff"
      :time-slots="timeSlots"
      @save="saveAppointment"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ChairScheduleHeader from './components/ChairScheduleHeader.vue'
import ChairScheduleTable from './components/ChairScheduleTable.vue'
import ChairScheduleDialog from './components/ChairScheduleDialog.vue'
import { useChairSchedule } from './composables/useChairSchedule'

// 使用组合式函数
const {
  loading,
  appointmentDialogVisible,
  isEditing,
  selectedDate,
  chairs,
  staff,
  patients,
  timeSlots,
  appointments,
  appointmentForm,
  chairScheduleData,
  saveAppointment: saveAppointmentData,
  markAsVisited,
  deleteAppointment,
  loadAppointments,
  refreshData,
  showNewAppointmentDialog: showNewAppointmentDialogData,
  showEditAppointmentDialog,
  resetForm
} = useChairSchedule()

// 事件处理方法
const handleDateChange = (date) => {
  loadAppointments()
}

const handleCellClick = (chair, time) => {
  const appointment = appointments.value.find(
    apt => apt.chairId === chair.chairId &&
    apt.timeSlot === time &&
    apt.appointDate === selectedDate.value
  )
  if (appointment) {
    editAppointment(appointment)
  } else {
    createAppointment(chair.chairId, time)
  }
}

const handleNewAppointment = () => {
  showNewAppointmentDialogData()
}

const createAppointment = (chairId, time) => {
  showNewAppointmentDialogData(chairId, time)
}

const editAppointment = (appointment) => {
  showEditAppointmentDialog(appointment)
}

const saveAppointment = (formData) => {
  saveAppointmentData(formData)
}

const handleDialogCancel = () => {
  resetForm()
}

onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
.chairs-container {
  height: 100%;
}
</style>