<template>
  <div class="chair-schedule-table">
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
        v-for="chair in chairs"
        :key="chair.chairId"
        :label="`${chair.chairNum} (${chair.type})`"
        min-width="250"
      >
        <template #default="scope">
          <ChairScheduleCard
            :appointment="scope.row[chair.chairId]"
            @cell-click="handleCellClick(chair, scope.row.time)"
            @create-appointment="createAppointment(chair, scope.row.time)"
            @edit-appointment="editAppointment(scope.row[chair.chairId])"
            @mark-visited="markAsVisited(scope.row[chair.chairId])"
            @delete-appointment="deleteAppointment(scope.row[chair.chairId])"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import ChairScheduleCard from './ChairScheduleCard.vue'

defineProps({
  tableData: {
    type: Array,
    required: true
  },
  chairs: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cell-click', 'create-appointment', 'edit-appointment', 'mark-visited', 'delete-appointment'])

const handleCellClick = (chair, time) => {
  emit('cell-click', chair, time)
}

const createAppointment = (chair, time) => {
  emit('create-appointment', chair.chairId, time)
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
.chair-schedule-table {
  background: white;
}
</style>