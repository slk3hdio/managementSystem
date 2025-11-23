<template>
  <div class="chairs-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>牙椅管理</span>
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            新增牙椅
          </el-button>
        </div>
      </template>
      <div style="text-align: center; padding: 40px; color: #909399;">
        牙椅管理功能开发中...
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>