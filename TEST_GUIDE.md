# Histamine Calculator Test Guide

## 🧪 How to Test Your Setup

### 1. Start the Development Server

Open PowerShell and navigate to the project:
```powershell
cd "C:\Users\toddf\Website\histamine-calc"
npm run dev
```

The server should start at `http://localhost:3000`

### 2. What You Should See

#### Home Page (`/`)
- 🧬 Histamine Calculator title
- Brief description
- "Get Started" and "Browse Foods" buttons

#### Dashboard (`/dashboard`) 
- **Daily HU Gauge**: Shows current histamine load
- **Meal Builder**: Interactive food selection
- **Real-time Calculations**: HU updates as you add foods
- **Sample Foods**: Chicken (low), Aged Cheddar (high), Tomato (medium + liberator)

### 3. Test the Core Features

#### ✅ HU Calculations
1. Go to `/dashboard`
2. Click "Fresh Chicken Breast" (should show ~0.03 HU for 150g)
3. Click "Aged Cheddar Cheese" (should show ~4.0 HU for 30g)
4. Click "Tomato" (should show ~1.2 HU due to liberator effect)

#### ✅ Modifiers
1. Adjust portion sizes (grams) - HU should update
2. Check "Alcohol with meal" - HU should increase by 30%
3. Add DAO units - should reduce total HU

#### ✅ Gauge Colors
- **Green**: Under 70 HU (70% of 100 HU tolerance)
- **Amber**: 70-90 HU 
- **Red**: Over 90 HU

### 4. What's Working Behind the Scenes

#### ✅ TypeScript Types
- All Food, HandlingModifier, and calculation types defined

#### ✅ HU Formula Implementation
```
HU = (base_mg_per_kg * grams / 1000) * handling_mult * liberator_mult * dao_blocker_mult
```

#### ✅ Offline Storage Setup
- Dexie IndexedDB schema ready
- Pending sync queues configured

#### ✅ Database Schema
- Complete SQL migrations in `/db/migrations/`
- Row Level Security policies ready

### 5. If Something Doesn't Work

#### Terminal Issues
If `npm run dev` fails, try:
```powershell
# Make sure you're in the right directory
Get-Location
# Should show: C:\Users\toddf\Website\histamine-calc

# Check if package.json exists
Test-Path "package.json"
# Should return: True

# Try starting with full path
npm --prefix "C:\Users\toddf\Website\histamine-calc" run dev
```

#### Build Issues
```powershell
# Check for TypeScript errors
npx tsc --noEmit

# Check for missing dependencies
npm install
```

### 6. Next Steps

Once the basic setup is working:

1. **Connect Supabase**: Add real database connection
2. **Add Authentication**: User login/signup
3. **Expand Food Database**: Import 300+ foods
4. **Implement Sync**: Online/offline synchronization
5. **Add More Pages**: Food search, symptom logging

### 7. File Structure Created

```
histamine-calc/
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx     ✅ Interactive demo
│   │   ├── layout.tsx             ✅ Navigation
│   │   └── page.tsx               ✅ Home page
│   ├── lib/
│   │   ├── hu.ts                  ✅ HU calculations
│   │   ├── tolerance.ts           ✅ EWMA algorithm
│   │   ├── dexie.ts              ✅ Offline storage
│   │   ├── types.ts              ✅ TypeScript types
│   │   └── utils.ts              ✅ Utilities
│   └── components/ui/             ✅ Basic UI components
└── db/
    └── migrations/                ✅ Database schema
```

## 🎉 Success Criteria

✅ **Home page loads** without errors
✅ **Dashboard shows** HU calculations  
✅ **Adding foods** updates HU in real-time
✅ **Modifiers work** (alcohol, DAO, portions)
✅ **Gauge changes color** based on HU level
✅ **No TypeScript errors** in console

Your Histamine Calculator foundation is ready! 🚀