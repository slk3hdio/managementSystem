<template>
  <el-dialog
    v-model="dialogVisible"
    title="分配牙椅"
    width="500px"
  >
    <div class="assignment-info">
      <el-form label-width="100px">
        <el-form-item label="牙椅">
          <span>{{ selectedChair?.chairNum }} ({{ selectedChair?.type }})</span>
        </el-form-item>
        <el-form-item label="时间">
          <span>{{ selectedDate }} {{ selectedTime }}</span>
        </el-form-item>
        <el-form-item label="可选预约">
          <div v-if="unassignedAppointments.length === 0" class="no-appointments">
            该时间段没有未分配牙椅的预约
          </div>
          <div v-else class="appointment-list">
            <div
              v-for="appointment in unassignedAppointments"
              :key="appointment.appointId"
              class="appointment-item"
              @click="selectAppointment(appointment)"
            >
              <div class="appointment-info-item">
                <span class="patient-name">{{ appointment.patientName }}</span>
                <span class="doctor-name">{{ appointment.staffName }} ({{ appointment.staffRole }})</span>
                <el-tag size="small" :type="getVisitTypeTagType(appointment.visitType)">
                  {{ appointment.visitType }}
                </el-tag>
              </div>
              <div class="appointment-content">{{ appointment.content }}</div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedChair: {
    type: Object,
    default: null
  },
  selectedTime: {
    type: String,
    default: ''
  },
  selectedDate: {
    type: String,
    default: ''
  },
  unassignedAppointments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'assign-chair'])

const dialogVisible = ref(false)

const getVisitTypeTagType = (visitType) => {
  const typeMap = {
    '初诊': 'primary',
    '复查': 'warning',
    '洁牙': 'success',
    '维保': 'info'
  }
  return typeMap[visitType] || 'info'
}

const selectAppointment = (appointment) => {
  emit('assign-chair', appointment.appointId)
}

const handleCancel = () => {
  dialogVisible.value = false
}

// 监听外部数据变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})
</script>

<style scoped>
.assignment-info {
  padding: 10px 0;
}

.no-appointments {
  color: #909399;
  font-style: italic;
  padding: 20px 0;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.appointment-list {
  max-height: 300px;
  overflow-y: auto;
}

.appointment-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.appointment-item:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.appointment-info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.patient-name {
  font-weight: 600;
  color: #303133;
}

.doctor-name {
  color: #606266;
  font-size: 14px;
}

.appointment-content {
  color: #909399;
  font-size: 13px;
  line-height: 1.4;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>