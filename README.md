# Project Manager - Angular Application

A modern project management application built with Angular 21, featuring a beautiful UI with Tailwind CSS and real-time data management.

## ✨ Features

### Core Features
- **📊 Dashboard** - Comprehensive statistics and analytics view
  - Total projects overview
  - Project status distribution (Completed, In Progress, Pending)
  - Task statistics and completion rates
  - Visual progress bars and metrics
  
- **📁 Project Management**
  - Create new projects with detailed information
  - Edit existing projects
  - Delete projects with confirmation
  - Search and filter projects by name, description, or status
  - View project details and associated tasks
  
- **✅ Task Management**
  - Add tasks to projects
  - Update task status (Pending → In Progress → Completed)
  - Delete tasks
  - Priority levels (High, Medium, Low)
  - Color-coded priority indicators

### Technical Features
- **State Management** - Centralized service-based architecture
- **Reactive Programming** - RxJS observables for data flow
- **Optimistic Updates** - Instant UI feedback with rollback on error
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during API calls
- **Routing** - Navigation between Dashboard and Projects views
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Custom Directives & Pipes** - Reusable UI enhancements

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the JSON Server (in a separate terminal):
```bash
npm run api
```
This starts the mock API server on `http://localhost:3000`

3. Start the Angular development server:
```bash
npm start
```
The application will be available at `http://localhost:4200`

## 📖 Usage

### Navigation
- **Dashboard** (`/dashboard`) - View statistics and overview
- **Projects** (`/projects`) - Manage your projects

### Managing Projects

#### Creating a Project
1. Navigate to the Projects page
2. Fill in the project form:
   - Project name
   - Description
   - Status (Pending, In Progress, Completed)
3. Click "Create Project"

#### Editing a Project
1. Click "View Details" on a project card
2. Click "Edit Project" button
3. Modify the project information
4. Save changes

#### Deleting a Project
1. Click the trash icon (🗑️) on a project card
2. Confirm the deletion in the dialog

#### Searching and Filtering
- Use the search bar to filter by project name or description
- Use the status dropdown to filter by project status

### Managing Tasks

#### Adding Tasks
1. View project details
2. Click "Add Task"
3. Enter task title and select priority
4. Submit the task

#### Updating Task Status
- Click on a task to cycle through statuses:
  - En attente (Pending) → En cours (In Progress) → Terminé (Completed)

#### Deleting Tasks
- Click the delete button next to a task

## 🏗️ Architecture

### Project Structure
```
src/app/
├── core/
│   └── services/
│       └── project.service.ts    # Centralized data management
├── features/
│   └── projects/
│       ├── components/
│       │   ├── dashboard/        # Statistics dashboard
│       │   ├── project-list/     # Project listing with filters
│       │   ├── project-detail/   # Detailed project view
│       │   ├── add-project/      # Create project form
│       │   ├── edit-project/     # Edit project form
│       │   └── task-list/        # Task management
│       ├── directives/
│       │   └── highlight-status.directive.ts
│       └── pipes/
│           └── priority-color.pipe.ts
├── app.routes.ts                 # Application routes
├── app.ts                        # Root component
└── app.html                      # Main layout with navigation
```

### Key Components

#### ProjectService
Centralized service managing all project data using RxJS BehaviorSubject for reactive state management.

#### Dashboard Component
Displays comprehensive statistics including:
- Project counts by status
- Task metrics
- Completion rates
- Visual progress indicators

#### Project List Component
Features:
- Real-time search filtering
- Status-based filtering
- Optimistic updates for CRUD operations
- Error handling with user feedback

## 🎨 Styling

The application uses **Tailwind CSS v4** for styling with:
- Gradient backgrounds
- Modern card designs
- Smooth transitions and hover effects
- Responsive grid layouts
- Color-coded status indicators

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Watch Mode
```bash
npm run watch
```

## 📦 Dependencies

### Production
- `@angular/*` (v21.1.0) - Angular framework
- `rxjs` (~7.8.0) - Reactive programming
- `json-server` (^1.0.0-beta.15) - Mock REST API
- `express` (^5.1.0) - Server framework

### Development
- `@angular/cli` (^21.1.3) - Angular CLI
- `typescript` (~5.9.2) - TypeScript compiler
- `tailwindcss` (^4.1.12) - Utility-first CSS framework
- `vitest` (^4.0.8) - Testing framework

## 🌐 API Endpoints

The application uses JSON Server with the following endpoints:

- `GET /projects` - Get all projects
- `POST /projects` - Create a new project
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project

## 🎯 Future Enhancements

Potential features to add:
- [ ] User authentication and authorization
- [ ] Real-time collaboration
- [ ] File attachments to projects
- [ ] Due dates and reminders
- [ ] Export reports (PDF, CSV)
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Advanced analytics and charts
- [ ] Drag-and-drop task reordering
- [ ] Comments on tasks

## 👥 Authors

University Project - Framework Web Front-End Course

## 📄 License

This project is part of academic coursework.
