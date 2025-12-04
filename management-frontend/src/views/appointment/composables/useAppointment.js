import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useAppointment() {
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
      staffRole: '医生',
      appointDate: selectedDate.value,
      timeSlot: '09:00',
      visitType: '复查',
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
      staffRole: '医生',
      appointDate: selectedDate.value,
      timeSlot: '10:00',
      visitType: '初诊',
      content: '常规洁牙',
      booker: '咨询',
      bookChannel: '咨询',
      isVisited: false,
      needFollow: false
    },
    {
      appointId: 3,
      patientId: 3,
      patientName: '王五',
      chairId: null, // 未分配牙椅
      staffId: 1,
      staffName: '张医生',
      staffRole: '医生',
      appointDate: selectedDate.value,
      timeSlot: '09:30',
      visitType: '初诊',
      content: '牙齿检查',
      booker: '渠道',
      bookChannel: '渠道',
      isVisited: false,
      needFollow: false
    },
    {
      appointId: 4,
      patientId: 4,
      patientName: '赵六',
      chairId: null, // 未分配牙椅
      staffId: 2,
      staffName: '李医生',
      staffRole: '医生',
      appointDate: selectedDate.value,
      timeSlot: '10:30',
      visitType: '洁牙',
      content: '深度洁牙',
      booker: '客服',
      bookChannel: '客服',
      isVisited: false,
      needFollow: true
    },
    {
      appointId: 5,
      patientId: 1,
      patientName: '张三',
      chairId: 3,
      staffId: 4,
      staffName: '刘洁牙师',
      staffRole: '洁牙师',
      appointDate: selectedDate.value,
      timeSlot: '14:00',
      visitType: '洁牙',
      content: '定期洁牙',
      booker: '前台',
      bookChannel: '前台',
      isVisited: false,
      needFollow: false
    },
    {
      appointId: 6,
      patientId: 2,
      patientName: '李四',
      chairId: null, // 未分配牙椅
      staffId: 3,
      staffName: '王助理',
      staffRole: '助理',
      appointDate: selectedDate.value,
      timeSlot: '15:00',
      visitType: '维保',
      content: '设备维护',
      booker: '咨询',
      bookChannel: '咨询',
      isVisited: false,
      needFollow: true
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

  // 获取指定医生和时间段的预约
  const getAppointment = (staffId, timeSlot) => {
    return appointments.value.find(
      apt => apt.staffId === staffId &&
      apt.timeSlot === timeSlot &&
      apt.appointDate === selectedDate.value
    )
  }

  // 按医生分组的预约数据
  const appointmentTableData = computed(() => {
    return timeSlots.value.map(timeSlot => {
      const rowData = { time: timeSlot.time }
      staff.value.forEach(doctor => {
        const appointment = getAppointment(doctor.staffId, timeSlot.time)
        rowData[doctor.staffId] = appointment
      })
      return rowData
    })
  })

  // 重置表单
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

  // 保存预约
  const saveAppointment = (formData) => {
    if (isEditing.value) {
      // 编辑预约
      const index = appointments.value.findIndex(apt => apt.appointId === formData.appointId)
      if (index !== -1) {
        appointments.value[index] = {
          ...appointments.value[index],
          ...formData,
          patientName: patients.value.find(p => p.patientId === formData.patientId)?.patientName,
          staffName: staff.value.find(s => s.staffId === formData.staffId)?.staffName
        }
      }
      ElMessage.success('预约更新成功')
    } else {
      // 新建预约
      const newAppointment = {
        ...formData,
        appointId: Date.now(),
        patientName: patients.value.find(p => p.patientId === formData.patientId)?.patientName,
        staffName: staff.value.find(s => s.staffId === formData.staffId)?.staffName,
        isVisited: false
      }
      appointments.value.push(newAppointment)
      ElMessage.success('预约创建成功')
    }

    appointmentDialogVisible.value = false
  }

  // 标记为就诊
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

  // 取消标记就诊
  const unmarkVisited = async (appointment) => {
    try {
      const index = appointments.value.findIndex(apt => apt.appointId === appointment.appointId)
      if (index !== -1) {
        appointments.value[index].isVisited = false
      }
      ElMessage.success('已取消标记就诊')
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }

  // 删除预约
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

  // 加载预约数据
  const loadAppointments = () => {
    loading.value = true
    // 这里应该调用API获取预约数据
    setTimeout(() => {
      loading.value = false
    }, 500)
  }

  // 刷新数据
  const refreshData = () => {
    loadAppointments()
  }

  // 显示新建预约对话框
  const showNewAppointmentDialog = (staffId = null, time = null) => {
    isEditing.value = false
    resetForm()
    if (staffId) {
      appointmentForm.staffId = staffId
    }
    if (time) {
      appointmentForm.timeSlot = time
    }
    appointmentForm.appointDate = selectedDate.value
    appointmentDialogVisible.value = true
  }

  // 显示编辑预约对话框
  const showEditAppointmentDialog = (appointment) => {
    isEditing.value = true
    Object.assign(appointmentForm, appointment)
    appointmentDialogVisible.value = true
  }

  return {
    // 数据
    loading,
    appointmentDialogVisible,
    isEditing,
    appointmentFormRef,
    selectedDate,
    chairs,
    staff,
    patients,
    timeSlots,
    appointments,
    appointmentForm,
    appointmentTableData,

    // 方法
    getAppointment,
    resetForm,
    saveAppointment,
    markAsVisited,
    unmarkVisited,
    deleteAppointment,
    loadAppointments,
    refreshData,
    showNewAppointmentDialog,
    showEditAppointmentDialog
  }
}