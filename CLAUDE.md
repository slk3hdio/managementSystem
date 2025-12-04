# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **dental hospital management system** (牙科医院管理系统) built as a full-stack application:

- **Frontend**: Vue 3 + Element Plus SPA (Single Page Application)
- **Backend**: Spring Boot 4.0.0 (Java 21)
- **Domain**: Dental appointment scheduling, chair management, patient records, and usage statistics

## Development Commands

### Frontend (management-frontend/)
```bash
cd management-frontend
npm install          # Install dependencies
npm run dev         # Start development server (localhost:5173)
npm run build       # Build for production
npm run preview     # Preview production build
```

### Backend (management/)
```bash
cd management
./gradlew bootRun       # Run Spring Boot application
./gradlew test          # Run tests
./gradlew build         # Build JAR
./gradlew clean         # Clean build artifacts
```

## Architecture & Code Structure

### Frontend Architecture
- **Vue 3 Composition API**: All components use `<script setup>` syntax
- **State Management**: Custom composables for each domain (useAppointment, useChairSchedule)
- **Component Pattern**: Highly reusable components with prop/emit communication
- **Mock Data**: Comprehensive mock datasets for development (no backend integration yet)

### Key Frontend Directories
```
src/
├── layout/             # Main application layout with navigation
├── router/             # Vue Router 4 configuration
├── views/              # Page components organized by feature
│   ├── appointment/    # Appointment management with visual scheduling
│   ├── chairs/         # Dental chair management
│   ├── dashboard/      # Role-based dashboard
│   ├── statistics/     # Usage analytics and reports
│   ├── patients/       # Patient management (placeholder)
│   └── staff/          # Staff management (placeholder)
├── components/         # Shared reusable components
└── composables/        # Custom hooks for state management
```

### Backend Architecture
- **Spring Boot 4.0.0**: Minimal setup with Java 21
- **Build System**: Gradle with Java toolchain
- **Current Status**: Basic Spring Boot application, ready for API development
- **Package Structure**: `com.yida.management`

## Domain Model & Business Logic

### Core Entities
1. **Appointments** (`预约`): Central business entity linking patients, staff, chairs, and time slots
2. **Dental Chairs** (`牙椅`): Equipment management with usage tracking
3. **Staff** (`人员`): Role-based resource management (医生/助理/洁牙师)
4. **Patients** (`患者`): Customer management and records
5. **Time Slots** (`时间段`): 30-minute intervals (08:00-16:30) for scheduling

### Visit Types
- `初诊` (Initial Visit)
- `复查` (Follow-up)
- `洁牙` (Teeth Cleaning)
- `维保` (Maintenance)

### Chair Types
- `诊疗` (Treatment)
- `洁牙维保` (Cleaning/Maintenance)

## Key Technical Patterns

### Frontend Patterns
- **Composition API**: All components use `<script setup>` with reactive state
- **Composables**: Domain-specific state management (e.g., `useAppointment`, `useChairSchedule`)
- **Component Reusability**: `UniversalAppointmentCard` used across different views
- **Mock Data**: Comprehensive datasets in `mock/` directories for development

### Data Flow
- Unidirectional data flow with props down, events up
- State managed in composables, shared across components
- Mock data structure matches planned backend API responses

## Current Implementation Status

### ✅ Completed Features
- Visual appointment scheduling with table-based interface
- Dual perspective views (doctor-focused vs chair-focused)
- Real-time status management and visual indicators
- Basic CRUD operations for appointments
- Usage statistics with filtering and analysis
- Responsive design with Element Plus

### 🚧 In Progress
- Backend API implementation (currently using mock data)
- Database schema and integration
- Authentication and authorization
- Data export functionality

### 📋 Planned Features
- Patient management module
- Staff management module
- Enhanced chair management
- Statistical analysis with ECharts integration
- Mobile optimization

## Development Notes

### Mock Data Structure
The frontend uses comprehensive mock data that matches the planned backend API structure. When implementing backend endpoints, refer to the mock data formats in:
- `management-frontend/src/mock/appointments.js`
- `management-frontend/src/mock/chairs.js`
- `management-frontend/src/mock/statistics.js`

### Component Patterns
- Use `UniversalAppointmentCard` for any appointment display
- Follow the established composable patterns for state management
- Maintain the existing prop/emit communication patterns
- Use Element Plus components consistently

### Icon Usage
Some Element Plus icon names may differ from what's expected. Check the [Element Plus Icons documentation](https://element-plus.org/en-US/component/icon.html) for correct names if encountering import errors.

### File Naming
- Vue components use PascalCase: `AppointmentCard.vue`
- Composables use camelCase with "use" prefix: `useAppointment.js`
- Mock data files are named after their domain: `appointments.js`

## Important Files to Understand

### Frontend Key Files
- `management-frontend/src/layout/index.vue` - Main application layout
- `management-frontend/src/router/index.js` - Route configuration
- `management-frontend/src/views/appointment/index.vue` - Core appointment management
- `management-frontend/src/views/chairs/index.vue` - Chair-focused scheduling view
- `management-frontend/src/components/UniversalAppointmentCard.vue` - Reusable appointment component

### Backend Key Files
- `management/src/main/java/com/yida/management/ManagementApplication.java` - Application entry point
- `management/build.gradle` - Gradle configuration and dependencies

### Documentation
- `management-frontend/DEMO.md` - Detailed frontend documentation with features and data models
- `更新日志.md` - Chinese changelog with recent updates

## Development Workflow

1. **Frontend Development**: Work primarily in the Vue 3 frontend with mock data
2. **Component Development**: Create reusable components following established patterns
3. **API Integration**: When backend is ready, replace mock data with API calls
4. **Testing**: Focus on frontend functionality; backend testing structure exists but minimal

## Testing

- **Frontend**: No testing framework currently configured
- **Backend**: Uses Spring Boot Test with JUnit
- **Development**: Manual testing through the development server

## Deployment Notes

- Frontend builds to static files for web deployment
- Backend builds to executable JAR file
- Currently designed for development with mock data
- Production deployment will require backend API integration and database setup