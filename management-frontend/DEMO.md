# 牙科医院管理系统 - 前端演示

## 项目概述

基于 Vue 3 + Element Plus 实现的牙科医院管理系统前端演示版本，包含预约管理和牙椅使用率统计核心功能。

## 功能特性

### ✅ 已实现功能

1. **预约管理模块** (`/appointment`)
   - 可视化预约时间表：以牙椅为列、时间为段的表格视图
   - 新建预约：支持选择患者、牙椅、人员、时间、就诊类型等
   - 编辑预约：修改预约信息和状态
   - 就诊状态管理：标记患者是否已就诊
   - 删除预约：支持预约记录删除
   - 日期筛选：查看不同日期的预约安排

2. **牙椅使用率统计** (`/statistics`)
   - 统计概览：总牙椅数、活跃牙椅、总使用时长、平均使用率
   - 时间范围筛选：今日、本周、本月、自定义日期
   - 牙椅筛选：多选牙椅进行对比分析
   - 图表展示：使用率趋势图（支持折线图/柱状图）
   - 详细数据表格：每张牙椅的使用率和完成情况
   - 数据搜索：快速查找特定牙椅数据

3. **基础布局和导航**
   - 响应式侧边导航栏
   - 面包屑导航
   - 用户信息展示
   - 角色化工作台首页

### 🚧 开发中功能

- 患者管理模块
- 人员管理模块
- 牙椅管理模块
- 数据导出功能
- 图表集成（ECharts）

## 快速开始

### 安装依赖
```bash
cd management-frontend
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 查看演示

### 构建生产版本
```bash
npm run build
```

## 故障排除

### 图标导入错误
如果遇到 `does not provide an export named` 错误，这是因为某些图标名称在 Element Plus 中不存在。解决方案：

1. 检查正确的图标名称：[Element Plus Icons](https://element-plus.org/en-US/component/icon.html)
2. 常用图标替换：
   - `Chair` → `OfficeBuilding`
   - `CircleCheck` → `SuccessFilled`
   - `TrendCharts` → `DataAnalysis`

### 运行时错误
开发服务器应该正常运行，输出如下：
```
VITE v7.2.4 ready in 528 ms
➜  Local:   http://localhost:5173/
```

## 演示说明

### 预约管理演示

1. **查看预约**
   - 访问 `/appointment` 页面
   - 默认显示当日预约安排
   - 绿色背景表示已就诊，灰色背景表示待就诊

2. **新建预约**
   - 点击顶部"新建预约"按钮
   - 或点击空白单元格快速创建
   - 填写患者、牙椅、人员、时间等信息
   - 支持选择就诊类型：初诊、复查、洁牙、维保

3. **管理预约**
   - 点击预约单元格进行编辑
   - 使用"标记就诊"按钮更新状态
   - 支持删除预约记录

### 牙椅统计演示

1. **查看统计**
   - 访问 `/statistics` 页面
   - 查看顶部统计卡片了解整体使用情况

2. **筛选数据**
   - 选择时间范围（本周/本月）
   - 多选牙椅进行对比
   - 使用搜索框快速定位

3. **分析趋势**
   - 查看使用率趋势图表
   - 分析牙椅使用效率
   - 查看详细数据表格

## 数据结构

### 预约数据模型
```javascript
{
  appointId: 1,           // 预约ID
  patientId: 1,           // 患者ID
  patientName: "张三",     // 患者姓名
  chairId: 1,             // 牙椅ID
  staffId: 1,             // 医生ID
  staffName: "张医生",    // 医生姓名
  appointDate: "2024-01-01", // 预约日期
  timeSlot: "09:00",      // 时间段
  visitType: "初诊",      // 就诊类型
  content: "多生牙复查",   // 就诊内容
  booker: "前台",         // 预约人
  bookChannel: "前台",     // 预约渠道
  isVisited: false,       // 是否就诊
  needFollow: true        // 需要跟进
}
```

### 牙椅统计数据模型
```javascript
{
  chairId: 1,             // 牙椅ID
  chairNum: "001",        // 牙椅编号
  type: "诊疗",           // 牙椅类型
  totalTime: 480,         // 总可用时长(分钟)
  usedTime: 360,          // 实际使用时长(分钟)
  usageRate: 75,          // 使用率(%)
  appointmentCount: 8,    // 预约数量
  completedCount: 6,      // 完成数量
  completionRate: 75,     // 完成率(%)
  trend: 5               // 趋势变化(%)
}
```

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI 组件库**: Element Plus
- **路由管理**: Vue Router 4
- **构建工具**: Vite
- **图标库**: Element Plus Icons

## 项目结构

```
src/
├── layout/                 # 布局组件
│   └── index.vue          # 主布局
├── router/                # 路由配置
│   └── index.js           # 路由定义
├── views/                 # 页面组件
│   ├── appointment/       # 预约管理
│   │   └── index.vue
│   ├── statistics/        # 统计分析
│   │   └── index.vue
│   ├── dashboard/         # 工作台
│   │   └── index.vue
│   ├── patients/          # 患者管理
│   │   └── index.vue
│   ├── staff/             # 人员管理
│   │   └── index.vue
│   └── chairs/            # 牙椅管理
│       └── index.vue
├── App.vue                # 根组件
└── main.js               # 入口文件
```

## 下一步开发计划

1. **集成图表库**: 添加 ECharts 支持数据可视化
2. **后端API对接**: 连接真实的后端数据接口
3. **用户权限**: 实现基于角色的权限控制
4. **数据持久化**: 添加本地存储或状态管理
5. **响应式优化**: 完善移动端适配
6. **测试覆盖**: 添加单元测试和集成测试

## 注意事项

- 当前版本使用模拟数据，实际部署时需要对接真实API
- 图表功能预留了接口，需要安装 ECharts 后完善
- 部分管理功能为占位实现，可根据需要继续开发