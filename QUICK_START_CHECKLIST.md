# Trailbase Quick Start Checklist

**START HERE** - Follow these steps to set up your Trailbase TypeScript foundation.

## Overview

This checklist will guide you through setting up a production-ready Next.js 14 + TypeScript project from your existing Create React App setup.

**Estimated Time:** 2-3 hours

---

## Phase 1: Understanding (15 minutes)

### Step 1: Review Documentation

- [ ] Read this checklist completely
- [ ] Skim [README.md](README.md) for project overview
- [ ] Review [TYPESCRIPT_SETUP_SUMMARY.md](TYPESCRIPT_SETUP_SUMMARY.md) for technical details
- [ ] Bookmark [TRAILBASE_MIGRATION_PLAN.md](TRAILBASE_MIGRATION_PLAN.md) for later

### Step 2: Understand Your Current Project

You currently have:
- Create React App with Redux
- Bootstrap/Reactstrap for styling
- Basic campsite listing and comments
- Local data files (no database)

You will have:
- Next.js 14 App Router
- TypeScript throughout
- PostgreSQL database with Prisma
- Modern UI with Tailwind + shadcn/ui
- Full booking system with payments

---

## Phase 2: Initial Setup (30 minutes)

### Step 3: Backup Your Current Project

```bash
# Create a backup
cd /Users/charlie/Desktop
cp -r Trailbase Trailbase-backup

# Or commit current state to git
cd Trailbase
git add .
git commit -m "backup: before Trailbase migration"
```

- [ ] Backup created

### Step 4: Review Type Definitions

The following type files are ready to use:
- [ ] Check [src/types/types-campsite.ts](src/types/types-campsite.ts)
- [ ] Check [src/types/types-user.ts](src/types/types-user.ts)
- [ ] Check [src/types/types-booking.ts](src/types/types-booking.ts)
- [ ] Check [src/types/types-review.ts](src/types/types-review.ts)
- [ ] Check [src/types/types-api.ts](src/types/types-api.ts)

### Step 5: Review Configuration Files

The following config files are ready to use:
- [ ] Check [tsconfig.json](tsconfig.json) - TypeScript settings
- [ ] Check [next.config.js](next.config.js) - Next.js settings
- [ ] Check [env.example.txt](env.example.txt) - Environment variables
- [ ] Review updated [package.json](package.json) - Dependencies

---

## Phase 3: Database Setup (30 minutes)

### Step 6: Install PostgreSQL

Choose one option:

**Option A: Local PostgreSQL (Recommended for learning)**
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb trailbase
```

**Option B: Docker (Easiest)**
```bash
# Create docker-compose.yml
docker-compose up -d
```

**Option C: Cloud Database (Production-like)**
- Sign up at [Supabase](https://supabase.com) (free tier)
- Create new project
- Copy connection string

- [ ] PostgreSQL installed
- [ ] Database created
- [ ] Connection string ready

### Step 7: Configure Environment Variables

```bash
# Copy the example file
cp env.example.txt .env.local

# Edit .env.local with your values
# Required:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (run: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000)
```

- [ ] `.env.local` created
- [ ] `DATABASE_URL` set
- [ ] `NEXTAUTH_SECRET` generated
- [ ] All required variables set

### Step 8: Initialize Prisma

```bash
# Install dependencies first
npm install

# Generate Prisma client
npx prisma generate

# Run initial migration
npx prisma migrate dev --name init

# Seed database with sample data (optional)
npx prisma db seed
```

- [ ] Prisma client generated
- [ ] Database migrated
- [ ] Schema applied successfully

### Step 9: Verify Database

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

Open http://localhost:5555 and verify:
- [ ] All tables created (User, Campsite, Booking, Review, etc.)
- [ ] Sample data loaded (if seeded)

---

## Phase 4: TypeScript Configuration (15 minutes)

### Step 10: Install TypeScript Dependencies

All dependencies are already in [package.json](package.json):

```bash
npm install
```

This installs:
- TypeScript
- Next.js 14
- Prisma
- React Query
- Zod validation
- shadcn/ui components
- And more...

- [ ] `npm install` completed without errors
- [ ] `node_modules` folder created

### Step 11: Verify TypeScript Setup

```bash
# Check TypeScript version
npx tsc --version

# Verify tsconfig.json
cat tsconfig.json
```

- [ ] TypeScript 5.3+ installed
- [ ] tsconfig.json valid

---

## Phase 5: Validation & Utils (15 minutes)

### Step 12: Review Validation Schemas

Pre-built validation with Zod:
- [ ] [src/lib/validations-auth.ts](src/lib/validations-auth.ts) - Login, signup, password reset
- [ ] [src/lib/validations-campsite-booking.ts](src/lib/validations-campsite-booking.ts) - Campsite and booking forms

### Step 13: Review Utility Functions

30+ helper functions ready to use:
- [ ] [src/lib/utils.ts](src/lib/utils.ts) - Date formatting, price calculations, etc.

---

## Phase 6: First Test Run (15 minutes)

### Step 14: Start Development Server

```bash
npm run dev
```

- [ ] Server starts on http://localhost:3000
- [ ] No TypeScript errors
- [ ] No build errors

### Step 15: Test Type Safety

Create a test file to verify TypeScript is working:

```typescript
// src/test-types.ts
import type { Campsite } from '@/types/types-campsite';
import type { User } from '@/types/types-user';

const testCampsite: Campsite = {
  id: '1',
  name: 'Test Camp',
  slug: 'test-camp',
  description: 'A test campsite',
  // ... TypeScript will autocomplete and validate!
};
```

- [ ] TypeScript autocomplete works
- [ ] Type errors show correctly
- [ ] Imports resolve

---

## Phase 7: Next Steps Planning (30 minutes)

### Step 16: Choose Your Path

**Path A: Build New Features (Recommended)**
Start fresh with Next.js App Router:
1. Create authentication pages
2. Build campsite listing page
3. Implement booking flow
4. Add payment processing

**Path B: Migrate Existing Components**
Convert your React components to TypeScript:
1. Start with simple components (Footer, Header)
2. Convert pages one by one
3. Update state management
4. Connect to database

**Path C: Hybrid Approach**
Keep some old components while building new features:
1. Set up authentication first
2. Build database-backed campsite listings
3. Gradually replace old components

- [ ] Path chosen: ______________

### Step 17: Set Up Your Development Environment

**VS Code Extensions (Recommended):**
- [ ] Prisma (Prisma.prisma)
- [ ] TypeScript Vue Plugin (Vue.volar)
- [ ] Tailwind CSS IntelliSense
- [ ] ESLint
- [ ] Prettier

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

- [ ] Extensions installed
- [ ] Settings configured

---

## Phase 8: First Feature (Variable)

### Step 18: Build Your First TypeScript Feature

Choose a starter feature:

**Option A: Authentication Pages**
- [ ] Create login page
- [ ] Create signup page
- [ ] Implement NextAuth.js
- [ ] Test authentication flow

**Option B: Campsite Listing**
- [ ] Create campsite list page
- [ ] Fetch from database
- [ ] Display with type safety
- [ ] Add search/filter

**Option C: User Profile**
- [ ] Create profile page
- [ ] Form with validation
- [ ] Image upload
- [ ] Update database

See [TRAILBASE_MIGRATION_PLAN.md](TRAILBASE_MIGRATION_PLAN.md) for detailed implementation guides.

- [ ] First feature chosen
- [ ] Implementation started

---

## Verification Checklist

Before moving forward, verify:

### Configuration
- [ ] TypeScript compiles without errors
- [ ] Database connection works
- [ ] Environment variables set
- [ ] Dev server runs

### Files Ready
- [ ] All type definitions available
- [ ] Validation schemas ready
- [ ] Utils functions available
- [ ] Prisma schema applied

### Understanding
- [ ] Understand project structure
- [ ] Know where to find types
- [ ] Can run database commands
- [ ] Can create migrations

### Development
- [ ] VS Code set up
- [ ] Can start dev server
- [ ] Can view database
- [ ] Ready to code!

---

## Common Issues & Solutions

### Issue: Database connection fails
**Solution:** Check your `DATABASE_URL` format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Issue: Prisma types not found
**Solution:** Regenerate Prisma client:
```bash
npx prisma generate
```

### Issue: TypeScript errors everywhere
**Solution:** Restart TypeScript server in VS Code:
- Press Cmd+Shift+P
- Type "TypeScript: Restart TS Server"

### Issue: Port 3000 already in use
**Solution:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Issue: Module not found
**Solution:** Check your `tsconfig.json` paths and restart dev server

---

## What You've Accomplished

After completing this checklist:

- Full TypeScript development environment
- Production-ready database with Prisma
- Type-safe data models for entire app
- Validation schemas for forms
- Utility functions for common tasks
- Modern Next.js 14 setup
- Ready to build features!

---

## Next Steps

1. **Read** [TRAILBASE_MIGRATION_PLAN.md](TRAILBASE_MIGRATION_PLAN.md)
2. **Choose** your first feature to build
3. **Start** coding with full type safety!
4. **Reference** types and validations as you go

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zod Documentation](https://zod.dev)
- [React Query Docs](https://tanstack.com/query/latest)

---

## Questions?

- Review the documentation files
- Check the type definitions
- Look at the Prisma schema
- Consult the migration plan

You're all set! Happy coding!
