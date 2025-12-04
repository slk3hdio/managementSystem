<template>
  <UniversalAppointmentCard
    :appointment="appointment"
    :chairs="chairs"
    :show-elements="showElements"
    :show-actions="showActions"
    :action-labels="actionLabels"
    :custom-height="customHeight"
    :tag-effect="tagEffect"
    :empty-text="emptyText"
    @cell-click="handleCellClick"
    @edit-appointment="editAppointment"
    @mark-visited="markAsVisited"
    @unmark-visited="unmarkVisited"
    @delete-appointment="deleteAppointment"
    @cancel-chair-assignment="cancelChairAssignment"
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

const emit = defineEmits(['cell-click', 'edit-appointment', 'mark-visited', 'unmark-visited', 'delete-appointment', 'cancel-chair-assignment'])

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
  delete: true,
  cancelChairAssignment: true
}

const actionLabels = {
  markVisited: '标记就诊',
  edit: '编辑',
  delete: '删除',
  cancelChairAssignment: '取消分配'
}

const customHeight = '130px'
const tagEffect = 'light'
const emptyText = '分配预约'

const handleCellClick = () => {
  emit('cell-click')
}


const editAppointment = () => {
  emit('edit-appointment')
}

const markAsVisited = () => {
  emit('mark-visited')
}

const unmarkVisited = () => {
  emit('unmark-visited')
}

const deleteAppointment = () => {
  emit('delete-appointment')
}

const cancelChairAssignment = () => {
  emit('cancel-chair-assignment')
}
</script>