<template>
  <div class="header-actions">
    <div class="left-actions">
      <el-date-picker
        :model-value="selectedDate"
        @update:model-value="handleDateUpdate"
        type="date"
        placeholder="选择日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="handleDateChange"
      />
    </div>
    <div class="right-actions">
      <el-button @click="refreshData">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Refresh } from '@element-plus/icons-vue'

defineProps({
  selectedDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:selectedDate', 'date-change', 'refresh'])

const handleDateUpdate = (date) => {
  emit('update:selectedDate', date)
}

const handleDateChange = (date) => {
  emit('date-change', date)
}


const refreshData = () => {
  emit('refresh')
}
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left-actions {
  display: flex;
  gap: 10px;
}
</style>