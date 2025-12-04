<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditing ? '编辑预约' : '新建预约'"
    width="600px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="患者" prop="patientId">
        <el-select
          v-model="form.patientId"
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
        <el-select v-model="form.chairId" placeholder="可选择牙椅，也可稍后分配" style="width: 100%" clearable>
          <el-option
            v-for="chair in chairs"
            :key="chair.chairId"
            :label="`${chair.chairNum} (${chair.type})`"
            :value="chair.chairId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="接诊人员" prop="staffId">
        <el-select v-model="form.staffId" placeholder="选择接诊人员" style="width: 100%">
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
              v-model="form.appointDate"
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
            <el-select v-model="form.timeSlot" placeholder="选择时间" style="width: 100%">
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
        <el-select v-model="form.visitType" placeholder="选择就诊类型" style="width: 100%">
          <el-option label="初诊" value="初诊" />
          <el-option label="复查" value="复查" />
          <el-option label="洁牙" value="洁牙" />
          <el-option label="维保" value="维保" />
        </el-select>
      </el-form-item>

      <el-form-item label="就诊内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          placeholder="请输入就诊内容"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="预约渠道" prop="bookChannel">
        <el-select v-model="form.bookChannel" placeholder="选择预约渠道" style="width: 100%">
          <el-option label="前台" value="前台" />
          <el-option label="咨询" value="咨询" />
          <el-option label="渠道" value="渠道" />
          <el-option label="客服" value="客服" />
        </el-select>
      </el-form-item>

      <el-form-item label="预约人" prop="booker">
        <el-input v-model="form.booker" placeholder="请输入预约人姓名" />
      </el-form-item>

      <el-form-item label="是否需要跟进">
        <el-switch v-model="form.needFollow" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  patients: {
    type: Array,
    default: () => []
  },
  chairs: {
    type: Array,
    default: () => []
  },
  staff: {
    type: Array,
    default: () => []
  },
  timeSlots: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'save', 'cancel'])

const formRef = ref()
const dialogVisible = ref(false)
const form = reactive({
  appointId: null,
  patientId: null,
  chairId: null,
  staffId: null,
  appointDate: '',
  timeSlot: null,
  visitType: '',
  content: '',
  booker: '',
  bookChannel: '',
  needFollow: false
})

const rules = reactive({
  patientId: [{ required: true, message: '请选择患者', trigger: 'change' }],
  staffId: [{ required: true, message: '请选择接诊人员', trigger: 'change' }],
  appointDate: [{ required: true, message: '请选择预约日期', trigger: 'change' }],
  timeSlot: [{ required: true, message: '请选择时间', trigger: 'change' }],
  visitType: [{ required: true, message: '请选择就诊类型', trigger: 'change' }],
  bookChannel: [{ required: true, message: '请选择预约渠道', trigger: 'change' }]
})

// 监听外部数据变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

watch(() => props.formData, (newData) => {
  if (newData) {
    Object.assign(form, newData)
  }
}, { deep: true, immediate: true })

const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('save', { ...form })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>