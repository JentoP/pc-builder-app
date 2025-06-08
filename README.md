# PC Builder Application
[Deploy](https://pc-builder-app-tau.vercel.app/)

The PC Builder is a modern, user-friendly web application that enables users to build their own PCs. It uses a visual builder where components such as CPU, GPU, RAM, and storage can be selected. The application is targeted towards tech enthusiasts, gamers, and students who want to customize their ideal PC setup.

## Features

### 1. Authentication and User Management
- Login and registration via Supabase Auth
- Profile page with saved builds

### 2. Component Library
- Browse components like CPU, GPU, Motherboard, RAM, SSD, PSU, Case, Cooling
- Filter by brand, price, and other specifications
- Sort by various attributes

### 3. PC Builder Interface
- Intuitive selection for each component
- Live price calculation
- Dynamic preview of your build

### 4. Save and Share Builds
- Users can save builds in their profile
- Share via a unique link

### 5. Compatibility Check
- Automatic compatibility checking between components
- Warnings for conflicts (e.g., wrong socket or insufficient wattage)

| Component   | Depends on              | Check                                              |
|-------------|-------------------------|----------------------------------------------------|
| Processor   | Motherboard             | Socket must match                                  |
| Motherboard | Processor, Memory, Case | Socket, RAM type (e.g., DDR4/DDR5), form factor    |
| Memory      | Motherboard             | RAM type (e.g., DDR4 vs DDR5) and slots (optional) |
| GPU         | Case, Motherboard       | PCIe slot, GPU length vs case max GPU length       |
| Storage     | Motherboard             | SATA vs M.2 availability                           |
| PSU         | GPU, Case               | Wattage capacity, PSU form factor                  |
| Case        | Motherboard, GPU, PSU   | Motherboard form factor, GPU length, PSU size      |

## Nice to have features

### 1. Admin Environment
- Admin can manage components
- Logs for builds and activity
  
### 2. Wishlist and Comparison
- Option to compare components
- Wishlist for future purchases

### 3. API Integration
- External API used to fetch real-time component data (price, specs, availability)

### 4. Image fetching
- Component Details could display an image of the corresponding part that's fetched through an API.

### 5. More customization options
- Profile customization
- Uploading profile images
- Dynamic management of components (builds & profile)
  
### 6. Advanced Compatibility Check
- For example more checks like watt usages, RAM slot size, GPU length, etc...
- Better handling compatibility

# Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 13+ (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)


# Contributing
Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Documentation
For detailed developer documentation, including project structure, component architecture, and styling guidelines, see the [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).

The application is deployed on [Vercel](https://vercel.com/). You can view a live demo at [https://pc-builder-app-tau.vercel.app/](https://pc-builder-app-tau.vercel.app/).

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Feedback and Issues

Please file feedback and issues over on the [GitHub issue page](https://github.com/JentoP/pc-builder-app/issues).
