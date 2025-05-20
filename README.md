# PC Builder Application
The PC Builder is a modern, user-friendly web application that enables users to build their own PCs. It uses a visual builder where components such as CPU, GPU, RAM, and storage can be selected. The application is targeted towards tech enthusiasts, gamers, and students who want to customize and compare their ideal PC setups.

## Features in development
### 1. Authentication and User Management (MVP)
- Login and registration via Supabase Auth
- Profile page with saved builds

### 2. Component Library (MVP)
- Components retrieved via a manually imported database
- Pages for components like: CPU, GPU, Motherboard, RAM, SSD, PSU, Case, Cooling,...
- Filters for brand, price, compatibility, etc.
- Image fetching through API as a fallback.

### 3. PC Builder Interface (MVP)
- Selection for each component
- Live price calculation
- Dynamic preview of the build
  
### 3. Admin Environment (MVP)
- Admin can manage or edit components in the Supabase database
- Logs for builds and user activity

### 4. Save and Share Builds (nice to have)
- Users can save builds in their profile
- Share via a unique link
- Option to copy and modify builds

### 5. Compatibility Check (MVP)
- Logic integrated to check if components are compatible
- Warnings for conflicts (e.g., wrong socket or insufficient wattage)

### 6. Wishlist and Comparison (nice to have)
- Option to compare components
- Wishlist for future purchases

### API Integration (nice to have)
- External API used to fetch real-time component data (price, specs, availability)

## Tech Stack
- [Next.js](https://nextjs.org)
- Database using [Supabase](https://supabase.com/). Includes package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)

## Demo
### Deployed to Vercel
You can view a fully working demo at [this link](https://pc-builder-app-tau.vercel.app/).


### Feedback and issues
Please file feedback and issues over on the [GitHub issue page](https://github.com/JentoP/pc-builder-app/issues).
