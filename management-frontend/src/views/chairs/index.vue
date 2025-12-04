<template>
  <div class="chairs-container">
    <!-- 顶部操作区 -->
    <ChairScheduleHeader
      v-model:selectedDate="selectedDate"
      @date-change="handleDateChange"
      @refresh="refreshData"
    />

    <!-- 牙椅预约表格 -->
    <ChairScheduleTable
      :table-data="chairScheduleData"
      :chairs="chairs"
      :loading="loading"
      @cell-click="handleCellClick"
      @edit-appointment="editAppointment"
      @mark-visited="markAsVisited"
      @delete-appointment="deleteAppointment"
      @cancel-chair-assignment="cancelChairAssignment"
    />

    <!-- 牙椅分配对话框 -->
    <ChairAssignmentDialog
      v-model:visible="assignmentDialogVisible"
      :selected-chair="selectedChair"
      :selected-time="selectedTime"
      :selected-date="selectedDate"
      :unassigned-appointments="unassignedAppointments"
      @assign-chair="handleAssignChair"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import ChairScheduleHeader from './components/ChairScheduleHeader.vue'
import ChairScheduleTable from './components/ChairScheduleTable.vue'
import { useChairSchedule } from './composables/useChairSchedule'
import ChairAssignmentDialog from './components/ChairAssignmentDialog.vue'

// 牙椅分配对话框状态
const assignmentDialogVisible = ref(false)
const selectedChair = ref(null)
const selectedTime = ref(null)

// 使用组合式函数
const {
  loading,
  selectedDate,
  chairs,
  staff,
  patients,
  timeSlots,
  appointments,
  chairScheduleData,
  markAsVisited,
  deleteAppointment,
  loadAppointments,
  refreshData
} = useChairSchedule()

// 获取未分配牙椅的预约（在当前日期和时间段）
const unassignedAppointments = computed(() => {
  return appointments.value.filter(apt =>
    !apt.chairId &&
    apt.appointDate === selectedDate.value &&
    apt.timeSlot === selectedTime.value
  )
})

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
    // 点击空闲位置，显示分配预约对话框
    selectedChair.value = chair
    selectedTime.value = time
    assignmentDialogVisible.value = true
  }
}

const editAppointment = (appointment) => {
  // 这里可以添加编辑逻辑，暂时只处理取消分配
  console.log('编辑预约:', appointment)
}

const handleAssignChair = (appointmentId) => {
  // 分配牙椅的逻辑
  console.log('分配牙椅:', {
    chairId: selectedChair.value.chairId,
    appointmentId,
    timeSlot: selectedTime.value,
    date: selectedDate.value
  })

  // 这里需要调用更新预约的API
  // 暂时只是关闭对话框
  assignmentDialogVisible.value = false
}

const cancelChairAssignment = (appointment) => {
  // 取消分配的逻辑
  console.log('取消分配牙椅:', appointment.appointId)
  // 这里需要调用更新预约的API，将chairId设为null
  // 暂时只打印日志
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