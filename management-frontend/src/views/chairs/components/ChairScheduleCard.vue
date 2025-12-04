<template>
  <UniversalAppointmentCard
    :appointment="appointment"
    :chairs="chairs"
    :show-elements="showElements"
    :show-actions="showActions"
    :action-labels="actionLabels"
    :custom-height="customHeight"
    :tag-effect="tagEffect"
    @cell-click="handleCellClick"
    @create-appointment="createNewAppointment"
    @edit-appointment="editAppointment"
    @mark-visited="markAsVisited"
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

const emit = defineEmits(['cell-click', 'create-appointment', 'edit-appointment', 'mark-visited', 'delete-appointment'])

// Chairs 界面的配置 - 显示牙椅视角的信息
const showElements = {
  patientName: true,
  staffName: true,   // 在牙椅视图中显示医生姓名
  staffIcon: true,
  visitType: true,
  chairInfo: false,  // 在牙椅视图中不显示牙椅信息（因为是按牙椅分列）
  chairIcon: false,
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

const customHeight = '130px'
const tagEffect = 'light'

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