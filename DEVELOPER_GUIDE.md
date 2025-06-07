# PC Builder - Developer Guide

Welcome to the PC Builder application! This guide will help you understand the project structure, key components, and development workflow.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Component Documentation](#component-documentation)
5. [State Management](#state-management)
6. [Data Flow](#data-flow)
7. [API Routes](#api-routes)
8. [Styling Guide](#styling-guide)
9. [Development Workflow](#development-workflow)
10. [Testing](#testing)
11. [Deployment](#deployment)

## Project Overview
### Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/             # Authentication related pages
│   ├── (dashboard)/        # Dashboard pages
│   ├── (main)/             # Main application pages
│   ├── api/                # API routes
│   └── parts/              # PC part related pages
├── components/             # Reusable UI components
│   ├── parts/              # Part-specific components
│   └── ui/                  # Shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configs
├── public/                 # Static assets
└── utils/                  # Helper functions
```

### Tech Stack

- **Frontend Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Database & Auth**: Supabase
- **State Management**: React Context + Custom Hooks
- **Type Safety**: TypeScript
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

### Architecture Overview

The application follows a modern Next.js architecture with:

1. **App Router**: For file-based routing and server components
2. **Server Components**: For data fetching and server-side rendering
3. **Client Components**: For interactive UI elements
4. **API Routes**: For backend functionality
5. **Custom Hooks**: For reusable logic

### Components

#### Core Components

1. **Build Components**
   - `BuildDisplay`: Shows the current PC build with selected components
   - `BuildDrawer`: Sidebar for managing the build
   - `ComponentSelector`: For selecting PC parts

2. **Part Components**
   - Located in `components/parts/`
   - Each part (CPU, GPU, etc.) has its own detail component
   - Follow consistent styling patterns (see Styling Guide)

3. **UI Components**
   - Uses Shadcn/ui components
   - Custom components should follow the same patterns

### State Management

- **Build State**: Managed via `useBuild` hook (in `hooks/useBuild.ts`)
- **Auth State**: Handled by Supabase Auth
- **UI State**: Local component state or Context API

### Data Flow

1. **Data Fetching**:
   - Server components fetch data directly from Supabase
   - Client components use `useEffect` for client-side data fetching

2. **Data Mutations**:
   - Use Supabase client for database operations
   - Update local state optimistically
   - Handle errors gracefully

### API Routes

- Located in `app/api/`
- Used for server-side operations
- Protected routes check for authentication

## Styling Guide

### Component Styling

1. **Detail Components**:
   ```jsx
   <div className="bg-sidebar shadow rounded-lg p-6 border">
     <div className="flex items-start gap-4">
       {/* Left: Image */}
       <div className="w-24 h-24">
         <Image src={image} alt={name} className="object-contain" />
       </div>
       {/* Right: Specs */}
       <div className="p-4 rounded-lg w-full">
         {/* Specs */}
       </div>
     </div>
   </div>
   ```

2. **Colors**:
   - Primary: `blue-700`
   - Secondary: `purple-700`
   - Background: `bg-sidebar` || `bg-background`

## Development Workflow

1. **Setup**:
   ```bash
   npm install
   cp .env.local.example .env.local
   # Update environment variables
   ```

2. **Development**:
   ```bash
   npm run dev
   ```

3. **Building**:
   ```bash
   npm run build
   ```

4. **Linting**:
   ```bash
   npm run lint
   ```

## Testing

- Write unit tests for utility functions
- Test components with React Testing Library
- E2E tests with Cypress (to be implemented)

## Deployment

The application is deployed on Vercel with automatic deployments from the `main` branch.

## Contributing

1. Create a new branch
2. Make your changes
3. Write tests if applicable
4. Submit a pull request

## Troubleshooting

- **Database connection issues**: Verify Supabase credentials in `.env.local`
- **Styling issues**: Check for conflicting Tailwind classes
- **Build errors**: Ensure all TypeScript types are correctly defined
