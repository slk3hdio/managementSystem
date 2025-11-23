<template>
  <div class="appointment-container">
    <!-- 顶部操作区 -->
    <div class="header-actions">
      <div class="left-actions">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
        />
        <el-button type="primary" @click="showNewAppointmentDialog">
          <el-icon><Plus /></el-icon>
          新建预约
        </el-button>
      </div>
      <div class="right-actions">
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 预约表格 -->
    <div class="appointment-table">
      <el-table
        :data="timeSlots"
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
          min-width="200"
        >
          <template #default="scope">
            <div class="appointment-cell" @click="handleCellClick(chair, scope.row.time)">
              <div
                v-if="getAppointment(chair.chairId, scope.row.time)"
                class="appointment-content"
                :class="{ 'visited': getAppointment(chair.chairId, scope.row.time).isVisited }"
              >
                <div class="patient-name">
                  {{ getAppointment(chair.chairId, scope.row.time).patientName }}
                </div>
                <div class="appointment-info">
                  <el-tag size="small" :type="getVisitTypeTagType(getAppointment(chair.chairId, scope.row.time).visitType)">
                    {{ getAppointment(chair.chairId, scope.row.time).visitType }}
                  </el-tag>
                  <span class="staff-name">{{ getAppointment(chair.chairId, scope.row.time).staffName }}</span>
                </div>
                <div class="treatment-content">
                  {{ getAppointment(chair.chairId, scope.row.time).content }}
                </div>
                <div class="appointment-actions">
                  <el-button
                    v-if="!getAppointment(chair.chairId, scope.row.time).isVisited"
                    size="small"
                    type="success"
                    @click.stop="markAsVisited(getAppointment(chair.chairId, scope.row.time))"
                  >
                    标记就诊
                  </el-button>
                  <el-button
                    size="small"
                    @click.stop="editAppointment(getAppointment(chair.chairId, scope.row.time))"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click.stop="deleteAppointment(getAppointment(chair.chairId, scope.row.time))"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div v-else class="empty-cell" @click.stop="showNewAppointmentDialog(chair, scope.row.time)">
                <el-icon><Plus /></el-icon>
                <span>新建预约</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新建/编辑预约对话框 -->
    <el-dialog
      v-model="appointmentDialogVisible"
      :title="isEditing ? '编辑预约' : '新建预约'"
      width="600px"
    >
      <el-form
        ref="appointmentFormRef"
        :model="appointmentForm"
        :rules="appointmentRules"
        label-width="100px"
      >
        <el-form-item label="患者" prop="patientId">
          <el-select
            v-model="appointmentForm.patientId"
            placeholder="选择患者"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="patient in patients"
              :key="patient.patientId"
              :label="`${patient.patientName} (${patient.phone})`"
              :value="patient.patientId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="牙椅" prop="chairId">
          <el-select v-model="appointmentForm.chairId" placeholder="选择牙椅" style="width: 100%">
            <el-option
              v-for="chair in chairs"
              :key="chair.chairId"
              :label="`${chair.chairNum} (${chair.type})`"
              :value="chair.chairId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="接诊人员" prop="staffId">
          <el-select v-model="appointmentForm.staffId" placeholder="选择接诊人员" style="width: 100%">
            <el-option
              v-for="staff in staff"
              :key="staff.staffId"
              :label="`${staff.staffName} (${staff.role})`"
              :value="staff.staffId"
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预约日期" prop="appointDate">
              <el-date-picker
                v-model="appointmentForm.appointDate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" prop="timeSlot">
              <el-select v-model="appointmentForm.timeSlot" placeholder="选择时间" style="width: 100%">
                <el-option
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  :label="slot.time"
                  :value="slot.time"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="就诊类型" prop="visitType">
          <el-select v-model="appointmentForm.visitType" placeholder="选择就诊类型" style="width: 100%">
            <el-option label="初诊" value="初诊" />
            <el-option label="复查" value="复查" />
            <el-option label="洁牙" value="洁牙" />
            <el-option label="维保" value="维保" />
          </el-select>
        </el-form-item>

        <el-form-item label="就诊内容" prop="content">
          <el-input
            v-model="appointmentForm.content"
            type="textarea"
            placeholder="请输入就诊内容"
            :rows="3"
          />
        </el-form-item>

        <el-form-item label="预约渠道" prop="bookChannel">
          <el-select v-model="appointmentForm.bookChannel" placeholder="选择预约渠道" style="width: 100%">
            <el-option label="前台" value="前台" />
            <el-option label="咨询" value="咨询" />
            <el-option label="渠道" value="渠道" />
            <el-option label="客服" value="客服" />
          </el-select>
        </el-form-item>

        <el-form-item label="预约人" prop="booker">
          <el-input v-model="appointmentForm.booker" placeholder="请输入预约人姓名" />
        </el-form-item>

        <el-form-item label="是否需要跟进">
          <el-switch v-model="appointmentForm.needFollow" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="appointmentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAppointment">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const appointmentDialogVisible = ref(false)
const isEditing = ref(false)
const appointmentFormRef = ref()
const selectedDate = ref(new Date().toISOString().split('T')[0])

// 模拟数据
const chairs = ref([
  { chairId: 1, chairNum: '001', type: '诊疗', status: 1 },
  { chairId: 2, chairNum: '002', type: '诊疗', status: 1 },
  { chairId: 3, chairNum: '003', type: '洁牙维保', status: 1 },
  { chairId: 4, chairNum: '004', type: '诊疗', status: 1 },
  { chairId: 5, chairNum: '005', type: '洁牙维保', status: 1 },
])

const staff = ref([
  { staffId: 1, staffName: '张医生', role: '医生', phone: '13800138001' },
  { staffId: 2, staffName: '李医生', role: '医生', phone: '13800138002' },
  { staffId: 3, staffName: '王助理', role: '助理', phone: '13800138003' },
  { staffId: 4, staffName: '刘洁牙师', role: '洁牙师', phone: '13800138004' },
])

const patients = ref([
  { patientId: 1, patientName: '张三', phone: '13800138001', age: 25 },
  { patientId: 2, patientName: '李四', phone: '13800138002', age: 30 },
  { patientId: 3, patientName: '王五', phone: '13800138003', age: 35 },
  { patientId: 4, patientName: '赵六', phone: '13800138004', age: 28 },
])

const timeSlots = ref([
  { time: '08:00' },
  { time: '08:30' },
  { time: '09:00' },
  { time: '09:30' },
  { time: '10:00' },
  { time: '10:30' },
  { time: '11:00' },
  { time: '11:30' },
  { time: '14:00' },
  { time: '14:30' },
  { time: '15:00' },
  { time: '15:30' },
  { time: '16:00' },
  { time: '16:30' },
])

const appointments = ref([
  {
    appointId: 1,
    patientId: 1,
    patientName: '张三',
    chairId: 1,
    staffId: 1,
    staffName: '张医生',
    appointDate: selectedDate.value,
    timeSlot: '09:00',
    visitType: '初诊',
    content: '多生牙复查',
    booker: '前台',
    bookChannel: '前台',
    isVisited: false,
    needFollow: true
  },
  {
    appointId: 2,
    patientId: 2,
    patientName: '李四',
    chairId: 2,
    staffId: 2,
    staffName: '李医生',
    appointDate: selectedDate.value,
    timeSlot: '10:00',
    visitType: '洁牙',
    content: '常规洁牙',
    booker: '咨询',
    bookChannel: '咨询',
    isVisited: true,
    needFollow: false
  }
])

// 表单数据
const appointmentForm = reactive({
  appointId: null,
  patientId: null,
  chairId: null,
  staffId: null,
  appointDate: selectedDate.value,
  timeSlot: null,
  visitType: '',
  content: '',
  booker: '',
  bookChannel: '',
  needFollow: false
})

// 表单验证规则
const appointmentRules = reactive({
  patientId: [{ required: true, message: '请选择患者', trigger: 'change' }],
  chairId: [{ required: true, message: '请选择牙椅', trigger: 'change' }],
  staffId: [{ required: true, message: '请选择接诊人员', trigger: 'change' }],
  appointDate: [{ required: true, message: '请选择预约日期', trigger: 'change' }],
  timeSlot: [{ required: true, message: '请选择时间', trigger: 'change' }],
  visitType: [{ required: true, message: '请选择就诊类型', trigger: 'change' }],
  bookChannel: [{ required: true, message: '请选择预约渠道', trigger: 'change' }]
})

// 计算属性和方法
const getAppointment = (chairId, timeSlot) => {
  return appointments.value.find(
    apt => apt.chairId === chairId &&
    apt.timeSlot === timeSlot &&
    apt.appointDate === selectedDate.value
  )
}

const getVisitTypeTagType = (visitType) => {
  const typeMap = {
    '初诊': '',
    '复查': 'warning',
    '洁牙': 'success',
    '维保': 'info'
  }
  return typeMap[visitType] || ''
}

const handleDateChange = (date) => {
  selectedDate.value = date
  loadAppointments()
}

const handleCellClick = (chair, time) => {
  const appointment = getAppointment(chair.chairId, time)
  if (appointment) {
    editAppointment(appointment)
  } else {
    showNewAppointmentDialog(chair, time)
  }
}

const showNewAppointmentDialog = (chair = null, time = null) => {
  isEditing.value = false
  resetForm()
  if (chair) {
    appointmentForm.chairId = chair.chairId
  }
  if (time) {
    appointmentForm.timeSlot = time
  }
  appointmentForm.appointDate = selectedDate.value
  appointmentDialogVisible.value = true
}

const editAppointment = (appointment) => {
  isEditing.value = true
  Object.assign(appointmentForm, appointment)
  appointmentDialogVisible.value = true
}

const resetForm = () => {
  Object.assign(appointmentForm, {
    appointId: null,
    patientId: null,
    chairId: null,
    staffId: null,
    appointDate: selectedDate.value,
    timeSlot: null,
    visitType: '',
    content: '',
    booker: '',
    bookChannel: '',
    needFollow: false
  })
}

const saveAppointment = async () => {
  if (!appointmentFormRef.value) return

  try {
    await appointmentFormRef.value.validate()

    if (isEditing.value) {
      // 编辑预约
      const index = appointments.value.findIndex(apt => apt.appointId === appointmentForm.appointId)
      if (index !== -1) {
        appointments.value[index] = {
          ...appointments.value[index],
          ...appointmentForm,
          patientName: patients.value.find(p => p.patientId === appointmentForm.patientId)?.patientName,
          staffName: staff.value.find(s => s.staffId === appointmentForm.staffId)?.staffName
        }
      }
      ElMessage.success('预约更新成功')
    } else {
      // 新建预约
      const newAppointment = {
        ...appointmentForm,
        appointId: Date.now(),
        patientName: patients.value.find(p => p.patientId === appointmentForm.patientId)?.patientName,
        staffName: staff.value.find(s => s.staffId === appointmentForm.staffId)?.staffName,
        isVisited: false
      }
      appointments.value.push(newAppointment)
      ElMessage.success('预约创建成功')
    }

    appointmentDialogVisible.value = false
  } catch (error) {
    console.error('保存预约失败:', error)
  }
}

const markAsVisited = async (appointment) => {
  try {
    const index = appointments.value.findIndex(apt => apt.appointId === appointment.appointId)
    if (index !== -1) {
      appointments.value[index].isVisited = true
    }
    ElMessage.success('已标记为就诊')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteAppointment = async (appointment) => {
  try {
    await ElMessageBox.confirm('确定要删除这个预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const index = appointments.value.findIndex(apt => apt.appointId === appointment.appointId)
    if (index !== -1) {
      appointments.value.splice(index, 1)
    }
    ElMessage.success('预约删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

const loadAppointments = () => {
  loading.value = true
  // 这里应该调用API获取预约数据
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const refreshData = () => {
  loadAppointments()
}

onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
.appointment-container {
  height: 100%;
}

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

.appointment-table {
  background: white;
}

.appointment-cell {
  height: 80px;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.appointment-cell:hover {
  background-color: #f5f7fa;
}

.appointment-content {
  height: 100%;
  padding: 6px;
  border-radius: 4px;
  background-color: #e1f3d8;
  border-left: 3px solid #67c23a;
}

.appointment-content.visited {
  background-color: #f4f4f5;
  border-left-color: #909399;
}

.patient-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.appointment-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.staff-name {
  font-size: 12px;
  color: #606266;
}

.treatment-content {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appointment-actions {
  display: flex;
  gap: 4px;
}

.appointment-actions .el-button {
  padding: 2px 6px;
  font-size: 11px;
}

.empty-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  border: 1px dashed #c0c4cc;
  border-radius: 4px;
  transition: all 0.2s;
}

.empty-cell:hover {
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
}

.empty-cell .el-icon {
  font-size: 16px;
  margin-bottom: 2px;
}

.empty-cell span {
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>