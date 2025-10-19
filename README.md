# Histamine Calculator

An advanced Progressive Web App for tracking histamine load from foods, with personalized tolerance learning and offline-first architecture.

## 🎯 Features

- **Real-time HU Calculations**: Instant histamine unit calculations with handling modifiers
- **Tolerance Learning**: EWMA algorithm adapts to your personal tolerance based on symptoms
- **Offline-First**: Works in supermarkets without internet, syncs when connected
- **Food Database**: Comprehensive database with 300+ foods and histamine levels
- **Context Tracking**: Sleep, stress, illness, alcohol, and DAO supplement tracking
- **Daily Gauges**: Visual red/amber/green indicators for meal and daily histamine load

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Offline Storage**: Dexie (IndexedDB)
- **State Management**: TanStack Query
- **Deployment**: Vercel
- **Analytics**: PostHog
- **Error Tracking**: Sentry

## 🏗 Architecture

- **Progressive Web App** with service worker
- **Row Level Security** for user data isolation  
- **Background sync** for offline meal logging
- **Real-time calculations** with server verification
- **EWMA tolerance adjustment** based on symptoms and context

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/ToddCole/histamine-calculator.git
cd histamine-calculator

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Initialize Supabase (optional - for local development)
pnpm dlx supabase init
pnpm dlx supabase start
pnpm dlx supabase db push

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📊 Core Formula

```typescript
HU_item = (base_mg_per_kg * grams / 1000) * handling_mult * liberator_mult * dao_blocker_mult

// Where:
// - liberator_mult = 1.2 if histamine liberator food
// - dao_blocker_mult = 1.3 if DAO blocker or alcohol with meal
// - handling_mult varies by preparation (fresh=1.0, leftovers=1.2-1.5, etc.)
```

## 🔧 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTHOG_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn
```

## 📱 Usage

1. **Search Foods**: Find foods in the comprehensive database
2. **Build Meals**: Add portions and handling methods
3. **Track Context**: Log sleep, stress, illness, supplements
4. **Monitor Symptoms**: Rate symptoms 0-10 with timing
5. **Learn Tolerance**: Algorithm adjusts your daily tolerance
6. **Export Data**: CSV export for healthcare providers

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm type-check
```

## 📈 Deployment

The app is designed for deployment on Vercel with Supabase backend:

1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## ⚖️ License

This project is for educational and personal use. Always consult healthcare professionals for medical advice.

## 🔗 Related Projects

- [HistamineHelp.com](https://github.com/ToddCole/HS_Website) - Simple educational website about histamine intolerance

---

**Note**: This application is for educational purposes only and should not replace professional medical advice.