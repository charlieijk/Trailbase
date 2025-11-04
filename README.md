# Trailbase - Full-Stack Campsite Booking Platform

A production-ready, TypeScript-first booking platform for campsite reservations, built with Next.js 14, PostgreSQL, and modern React patterns.

## Project Overview

Trailbase is a comprehensive campsite booking platform with:

- **Full TypeScript Coverage** - Type-safe from database to UI
- **Modern Stack** - Next.js 14 App Router, Prisma ORM, React Query
- **Production Features** - Authentication, payments, real-time availability
- **Scalable Architecture** - Built for growth and maintainability

## Project Files

### Documentation
- [README.md](README.md) - This file (project overview)
- [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) - **START HERE** - Step-by-step setup guide
- [TYPESCRIPT_SETUP_SUMMARY.md](TYPESCRIPT_SETUP_SUMMARY.md) - Technical decisions and rationale
- [TRAILBASE_MIGRATION_PLAN.md](TRAILBASE_MIGRATION_PLAN.md) - Full migration roadmap

### Configuration Files
- [package.json](package.json) - Dependencies and scripts
- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [next.config.js](next.config.js) - Next.js configuration
- [env.example.txt](env.example.txt) - Environment variables template

### TypeScript Types (src/types/)
- [types-campsite.ts](src/types/types-campsite.ts) - Campsite models
- [types-user.ts](src/types/types-user.ts) - User and authentication types
- [types-booking.ts](src/types/types-booking.ts) - Booking system types
- [types-review.ts](src/types/types-review.ts) - Review and rating types
- [types-api.ts](src/types/types-api.ts) - API response types

### Validation & Utils (src/lib/)
- [validations-auth.ts](src/lib/validations-auth.ts) - Auth form validation
- [validations-campsite-booking.ts](src/lib/validations-campsite-booking.ts) - Booking validation
- [utils.ts](src/lib/utils.ts) - Utility functions (30+ helpers)

### Database
- [schema.prisma](prisma/schema.prisma) - Complete database schema

## Key Features

### User Management
- Three user roles: Camper, Owner, Admin
- NextAuth.js authentication
- Profile management with avatar upload
- Email verification
- Password reset flow

### Campsite Management
- Rich campsite listings with images
- Advanced search and filters
- Map integration
- Amenities and pricing
- Seasonal rates
- Owner dashboard

### Booking System
- Real-time availability calendar
- Multi-date selection
- Guest management
- Booking modifications
- Cancellation handling
- Payment processing (Stripe)

### Reviews & Ratings
- 5-star rating system
- Photo uploads
- Owner responses
- Verified stays
- Helpful votes

### Additional Features
- Messaging system
- Admin dashboard
- Analytics
- Email notifications
- Mobile responsive
- Dark mode

## Tech Stack

### Frontend
- **Next.js 14** - App Router, Server Components, Server Actions
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless backend
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Production database
- **NextAuth.js** - Authentication
- **Stripe** - Payment processing
- **Cloudinary** - Image hosting

### DevOps
- **Vercel** - Deployment
- **GitHub Actions** - CI/CD
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Quick Start

1. **Read the Quick Start Checklist**
   ```bash
   cat QUICK_START_CHECKLIST.md
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp env.example.txt .env.local
   # Edit .env.local with your values
   ```

4. **Setup Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
trailbase/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages
│   │   ├── (dashboard)/      # Dashboard pages
│   │   ├── campsites/        # Campsite pages
│   │   ├── bookings/         # Booking pages
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── forms/           # Form components
│   │   └── shared/          # Shared components
│   ├── lib/                 # Utilities and helpers
│   │   ├── validations-auth.ts
│   │   ├── validations-campsite-booking.ts
│   │   └── utils.ts
│   ├── types/              # TypeScript types
│   │   ├── types-campsite.ts
│   │   ├── types-user.ts
│   │   ├── types-booking.ts
│   │   ├── types-review.ts
│   │   └── types-api.ts
│   ├── hooks/              # Custom React hooks
│   └── stores/             # Zustand stores
├── env.example.txt         # Environment template
├── next.config.js          # Next.js config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm run dev

# Commit with conventional commits
git commit -m "feat: add feature description"
```

### 2. Type Safety
```bash
# Check types
npm run type-check

# Generate Prisma types
npx prisma generate
```

### 3. Database Changes
```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

### 4. Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm run format` - Format code with Prettier

## Environment Variables

See [env.example.txt](env.example.txt) for all required environment variables.

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - App URL

### Optional
- `STRIPE_SECRET_KEY` - Stripe payments
- `CLOUDINARY_URL` - Image uploads
- `EMAIL_SERVER` - Email notifications

## Development Roadmap

Your campsite booking platform can be built using the TypeScript/Next.js structure. See [TRAILBASE_MIGRATION_PLAN.md](TRAILBASE_MIGRATION_PLAN.md) for the complete implementation roadmap.

### Migration Phases
1. **Setup** - TypeScript, Next.js, database
2. **Core Features** - Auth, campsites, bookings
3. **Advanced Features** - Payments, messaging, admin
4. **Polish** - Performance, SEO, testing

## Learning Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### React Query
- [TanStack Query Docs](https://tanstack.com/query/latest)

## Contributing

This is a personal project for portfolio purposes. Feel free to fork and adapt for your own use.

## License

MIT License - See LICENSE file for details

## Support

For questions or issues:
1. Check the documentation files
2. Review the TypeScript types
3. Consult the migration plan
4. Check Next.js and Prisma docs

## Next Steps

1. Read [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)
2. Follow the setup steps
3. Review [TYPESCRIPT_SETUP_SUMMARY.md](TYPESCRIPT_SETUP_SUMMARY.md)
4. Start coding!

---

Built with Next.js 14, TypeScript, and Prisma
