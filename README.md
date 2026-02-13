# PacePass - Endurance Event Platform

Premium iOS glass UI platform for managing marathons, triathlons, and endurance events worldwide.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Athlete** | marcus.chen@email.com | any |
| **Organiser** | sarah@marathonpro.com | any |
| **Coach** | coach.david@runclub.com | any |

> Authentication is mocked - any password will work for existing demo accounts.

## ✨ Features

### For Athletes
- Browse and register for global events
- View race day pass with QR code and bib number
- Track performance with charts and analytics
- Manage privacy consent settings

### For Organisers
- Create and manage events
- View registrations and statistics
- Import timing results (mock)
- Manage incident logs

### For Coaches/Clubs
- View athlete roster
- Access performance data (with consent)
- Compare athletes
- Manage club members

## 🎨 Design

- **iOS Glass UI**: Frosted glass panels, blur effects, layered depth
- **Dark-first**: Premium dark mode with light mode toggle
- **Mobile-first**: Responsive design with iOS-style navigation
- **Animations**: Framer Motion micro-interactions
- **Typography**: Inter font family

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
app/                    # Next.js pages
├── page.tsx           # Landing page
├── events/            # Public events catalog
├── auth/              # Sign in/up
└── app/               # Authenticated app
    ├── athlete/       # Athlete portal
    ├── organiser/     # Organiser console
    └── coach/         # Coach portal

components/            # Reusable components
├── ui/               # Glass UI components
└── theme-toggle.tsx

lib/                   # Business logic
├── auth/             # Authentication & RBAC
├── data/             # Mock data store
├── types.ts          # TypeScript definitions
└── utils.ts          # Utilities
```

## 🔐 Security

- Role-based access control (RBAC)
- Permission gates for UI components
- Consent-based data sharing for coaches
- Route guards for authenticated pages

## 📊 Data

Mock data includes:
- 10 global events (London, NYC, Tokyo, Berlin, Dubai, etc.)
- 5 sample users across all roles
- Realistic registrations and results
- Club and consent data

## 🧪 Testing

See [walkthrough.md](./walkthrough.md) for detailed testing guide covering:
- Public flow (landing, events, event detail)
- Athlete flow (events, race pass, performance, profile)
- Organiser flow (dashboard, event creation)
- Coach flow (dashboard, roster, consent system)
- Responsive testing
- Theme toggle

## 📝 License

This is a prototype/demo application.

## 🙏 Credits

- Hero images from [Unsplash](https://unsplash.com)
- Avatars from [DiceBear](https://dicebear.com)
- Icons from [Lucide](https://lucide.dev)
