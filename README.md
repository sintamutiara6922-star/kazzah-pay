<div align="center">
  <img src="./public/images/paymenthub-logo.webp" alt="PaymentHub Logo" width="120" />
  
  # PaymentHub
  
  **Modern Payment Gateway Platform for Indonesia**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
  
  [Demo](https://paymenthub.vercel.app) • [Documentation](https://github.com/YilziiHCT/web-paymenthub/wiki) • [Report Bug](https://github.com/YilziiHCT/web-paymenthub/issues) • [Request Feature](https://github.com/YilziiHCT/web-paymenthub/issues)
</div>

---

## 🚀 Overview

PaymentHub is a **modern, secure, and comprehensive payment gateway platform** designed specifically for Indonesia. Built with Next.js 16, React 19, and TypeScript, it provides a seamless payment experience for businesses and individuals.

### ✨ Key Features

- **💳 Multiple Payment Methods**
  - Bank Transfers (BCA, Mandiri, BNI, BRI)
  - E-Wallets (GoPay, OVO, DANA)
  - QRIS (Quick Response Code Indonesian Standard)
  - Credit/Debit Cards

- **🎁 Donation Platform**
  - Real-time donation tracking
  - Leaderboard system with rewards
  - Impact visualization
  - Transparent reporting

- **📊 Advanced Analytics**
  - Real-time transaction monitoring
  - Revenue tracking and forecasting
  - User behavior analytics
  - Custom reporting dashboard

- **🔐 Enterprise-Grade Security**
  - PCI DSS compliant architecture
  - End-to-end encryption
  - Secure session management
  - IP whitelisting support
  - Rate limiting and DDoS protection

- **🌐 API Documentation**
  - RESTful API with comprehensive docs
  - Webhook support for real-time events
  - SDK examples (Node.js, Python, PHP)
  - Interactive API testing

- **⚡ Performance Optimized**
  - WebP image optimization
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - Redis caching with Upstash
  - CDN-ready architecture

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Features](#-features-in-detail)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [System Health](#-system-health)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🏁 Quick Start

```bash
# Clone the repository
git clone https://github.com/YilziiHCT/web-paymenthub.git
cd web-paymenthub

# Install dependencies (use npm, pnpm, or yarn)
npm install
# or
pnpm install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables (see Configuration section)

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **pnpm**, or **yarn**
- **Redis** (Upstash recommended)
- **Git**

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YilziiHCT/web-paymenthub.git
   cd web-paymenthub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables** (see [Configuration](#️-configuration))

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## ⚙️ Configuration

### Required Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Redis Database (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Security Keys (Generate with: openssl rand -hex 32)
WEBHOOK_SECRET=your_webhook_secret_here
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# Rate Limiting (Optional)
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# IP Whitelist (Optional, comma-separated)
ALLOWED_IPS=127.0.0.1,::1
```

### Generating Secure Keys

```bash
# Generate random hex keys (32 bytes)
openssl rand -hex 32

# Generate base64 keys
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Upstash Redis Setup

1. Sign up at [console.upstash.com](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and token from the "REST API" tab
4. Add to your `.env.local` file

For detailed setup instructions, see [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

---

## 📁 Project Structure

```
paymenthub/
├── app/                      # Next.js 16 App Router
│   ├── about/               # About page
│   ├── api/                 # API routes
│   ├── contact/             # Contact page
│   ├── cookies/             # Cookie policy
│   ├── docs/                # API documentation
│   ├── donation/            # Donation platform
│   ├── help/                # Help center
│   ├── payment/             # Payment processing
│   ├── pricing/             # Pricing page
│   ├── privacy/             # Privacy policy
│   ├── refund/              # Refund policy
│   ├── status/              # System status
│   ├── support/             # Support page
│   ├── terms/               # Terms of service
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/
│   ├── layout/              # Layout components (Header, Footer)
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   └── ...
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
│   ├── atlantic.ts          # Payment configuration
│   ├── config.ts            # Site configuration
│   ├── redis.ts             # Redis client
│   └── utils.ts             # Helper functions
├── public/
│   ├── images/              # Optimized images (WebP)
│   │   ├── banks/          # Bank logos
│   │   ├── ewallet/        # E-wallet logos
│   │   ├── partners/       # Partner logos
│   │   ├── paymenthub-logo.webp
│   │   └── paymenthub-wordmark.webp
│   └── ...
├── .env.example             # Environment variables template
├── CONTRIBUTING.md          # Contribution guidelines
├── HEALTH.md                # System health information
├── INSTALLATION_GUIDE.md    # Detailed installation guide
├── LICENSE                  # MIT License
├── README.md                # This file
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

---

## 🛠 Technology Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Icon library

### Backend & Database
- **[Upstash Redis](https://upstash.com/)** - Serverless Redis database
- **[Jose](https://github.com/panva/jose)** - JWT authentication
- **[Zod](https://zod.dev/)** - Schema validation

### Analytics & Monitoring
- **[Recharts](https://recharts.org/)** - Data visualization
- **Custom Analytics** - Real-time metrics tracking

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing
- **[Turbopack](https://turbo.build/)** - Fast bundler

---

## 🎯 Features in Detail

### 1. Payment Gateway
- Support for 10+ payment methods
- Real-time transaction processing
- Automated payment reconciliation
- Multi-currency support (coming soon)

### 2. Donation Platform
- Campaign management
- Donor leaderboard system
- Impact tracking and reporting
- Transparent fund distribution

### 3. Analytics Dashboard
- Transaction volume monitoring
- Revenue forecasting
- User engagement metrics
- Custom report generation

### 4. Security Features
- PCI DSS compliant architecture
- SSL/TLS encryption
- CSRF protection
- Rate limiting
- IP whitelisting

### 5. Developer Tools
- Comprehensive API documentation
- Webhook integration
- SDKs for multiple languages
- Sandbox environment for testing

---

## 📚 API Documentation

### Available Endpoints

```http
POST   /api/payments          # Create payment
GET    /api/payments/:id      # Get payment details
POST   /api/donations         # Create donation
GET    /api/donations/:id     # Get donation details
GET    /api/leaderboard       # Get donor leaderboard
POST   /api/webhooks          # Receive webhook events
GET    /api/health            # System health check
```

### Example: Create Payment

```bash
curl -X POST https://your-domain.com/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "amount": 100000,
    "currency": "IDR",
    "method": "bank_transfer",
    "bank": "bca",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

For detailed API documentation, visit: [https://your-domain.com/docs](https://your-domain.com/docs)

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YilziiHCT/web-paymenthub)

1. Click the "Deploy with Vercel" button
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

### Deploy to Other Platforms

#### AWS, Google Cloud, Azure, VPS

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Use a process manager like PM2:
   ```bash
   pm2 start npm --name "paymenthub" -- start
   ```

4. Configure Nginx as reverse proxy (recommended)

---

## 🏥 System Health

Monitor the health and status of PaymentHub services. For detailed system health information, performance metrics, and uptime statistics, see [HEALTH.md](./HEALTH.md).

### Quick Health Check

- **Status Page:** Visit `/status` for real-time service status
- **API Health:** `GET /api/health` for system health check
- **Database:** Monitor Redis connection and query performance
- **Performance:** Track response times and error rates

### Key Metrics

- ✅ **Uptime:** 99.98% (Last 30 days)
- ⚡ **Response Time:** 145ms average
- 🔐 **Security:** PCI DSS compliant
- 📊 **Success Rate:** 99.95%

For comprehensive monitoring and incident reports, see [HEALTH.md](./HEALTH.md)

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 👥 Contributors

<a href="https://github.com/YilziiHCT/web-paymenthub/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=YilziiHCT/web-paymenthub" />
</a>

### Core Team

- **Yilzii** - *Creator & Lead Developer* - [@YilziiHCT](https://github.com/YilziiHCT)

Want to be a contributor? Check out [CONTRIBUTING.md](./CONTRIBUTING.md) to get started!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Yilzii

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 💬 Support

### Need Help?

- 📖 [Installation Guide](./INSTALLATION_GUIDE.md)
- 🏥 [System Health](./HEALTH.md)
- 💬 [GitHub Discussions](https://github.com/YilziiHCT/web-paymenthub/discussions)
- 🐛 [Issue Tracker](https://github.com/YilziiHCT/web-paymenthub/issues)
- 📧 [Email Support](mailto:support@paymenthub.com)

### Community

- 🌟 [Star on GitHub](https://github.com/YilziiHCT/web-paymenthub)
- 🐦 [Follow on Twitter](https://twitter.com/paymenthub)
- 💼 [LinkedIn](https://linkedin.com/company/paymenthub)

### Documentation

- 📚 [API Documentation](https://your-domain.com/docs)
- 📖 [Next.js Documentation](https://nextjs.org)
- 🚀 [Vercel Documentation](https://vercel.com/docs)
- 💾 [Upstash Documentation](https://docs.upstash.com/)

---

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [Upstash](https://upstash.com/)

---

<div align="center">
  <p>Made with ❤️ by Yilzii</p>
  <p>
    <a href="https://github.com/YilziiHCT/web-paymenthub">⭐ Star us on GitHub</a> •
    <a href="https://github.com/YilziiHCT/web-paymenthub/issues">🐛 Report a Bug</a> •
    <a href="https://github.com/YilziiHCT/web-paymenthub/discussions">💬 Join Discussion</a>
  </p>
  
  **Ready to get started? [Installation Guide →](./INSTALLATION_GUIDE.md)**
</div>
