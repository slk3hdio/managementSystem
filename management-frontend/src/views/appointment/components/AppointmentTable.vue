<template>
  <div class="appointment-table">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      height="600"
      v-loading="loading"
    >
      <el-table-column
        prop="time"
        label="时间"
        width="100"
        fixed
      />

      <el-table-column
        v-for="doctor in doctors"
        :key="doctor.staffId"
        :label="doctor.staffName"
        min-width="200"
      >
        <template #default="scope">
          <AppointmentCard
            :appointment="scope.row[doctor.staffId]"
            @cell-click="handleCellClick(doctor, scope.row.time)"
            @create-appointment="createAppointment(doctor, scope.row.time)"
            @edit-appointment="editAppointment(scope.row[doctor.staffId])"
            @mark-visited="markAsVisited(scope.row[doctor.staffId])"
            @delete-appointment="deleteAppointment(scope.row[doctor.staffId])"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import AppointmentCard from './AppointmentCard.vue'

defineProps({
  tableData: {
    type: Array,
    required: true
  },
  doctors: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cell-click', 'create-appointment', 'edit-appointment', 'mark-visited', 'delete-appointment'])

const handleCellClick = (doctor, time) => {
  emit('cell-click', doctor, time)
}

const createAppointment = (doctor, time) => {
  emit('create-appointment', doctor.staffId, time)
}

const editAppointment = (appointment) => {
  emit('edit-appointment', appointment)
}

const markAsVisited = (appointment) => {
  emit('mark-visited', appointment)
}

const deleteAppointment = (appointment) => {
  emit('delete-appointment', appointment)
}
</script>

<style scoped>
.appointment-table {
  background: white;
}
</style>