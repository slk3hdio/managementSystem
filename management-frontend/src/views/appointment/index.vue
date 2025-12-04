<template>
  <div class="appointment-container">
    <!-- 顶部操作区 -->
    <AppointmentHeader
      v-model:selectedDate="selectedDate"
      @date-change="handleDateChange"
      @new-appointment="handleNewAppointment"
      @refresh="refreshData"
    />

    <!-- 预约表格 -->
    <AppointmentTable
      :table-data="appointmentTableData"
      :doctors="doctors"
      :chairs="chairs"
      :loading="loading"
      @cell-click="handleCellClick"
      @edit-appointment="editAppointment"
      @mark-visited="markAsVisited"
      @delete-appointment="deleteAppointment"
    />

    <!-- 新建/编辑预约对话框 -->
    <AppointmentDialog
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
import { onMounted, computed } from 'vue'
import AppointmentHeader from './components/AppointmentHeader.vue'
import AppointmentTable from './components/AppointmentTable.vue'
import AppointmentDialog from './components/AppointmentDialog.vue'
import { useAppointment } from './composables/useAppointment'

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
  appointmentTableData,
  saveAppointment: saveAppointmentData,
  markAsVisited,
  deleteAppointment,
  loadAppointments,
  refreshData,
  showNewAppointmentDialog: showNewAppointmentDialogData,
  showEditAppointmentDialog,
  resetForm
} = useAppointment()

// 过滤出医生（只有role为'医生'的员工）
const doctors = computed(() => {
  return staff.value.filter(employee => employee.role === '医生')
})

// 事件处理方法
const handleDateChange = (date) => {
  loadAppointments()
}

const handleCellClick = (doctor, time) => {
  const appointment = appointments.value.find(
    apt => apt.staffId === doctor.staffId &&
    apt.timeSlot === time &&
    apt.appointDate === selectedDate.value
  )
  if (appointment) {
    editAppointment(appointment)
  } else {
    createAppointment(doctor.staffId, time)
  }
}

const handleNewAppointment = () => {
  showNewAppointmentDialogData()
}

const createAppointment = (staffId, time) => {
  showNewAppointmentDialogData(staffId, time)
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
.appointment-container {
  height: 100%;
}
</style>