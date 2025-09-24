# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Commands

### Development
```bash
# Start development server with hot reload
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Watch and compile SASS files
npm run sass
```

### Docker
```bash
# Build Docker image
docker build -t koinos-website .

# Run Docker container
docker run -p 3000:3000 koinos-website
```

## Architecture Overview

This is the marketing website for the Koinos blockchain, built with Next.js 15 and React 18. It serves as the public-facing portal for the Koinos ecosystem.

### Key Technology Stack
- **Framework**: Next.js 15.0.2 with React 18.3.1
- **Styling**: SASS/SCSS with Bootstrap grid system
- **State Management**: Zustand for client-side state
- **Animations**: AOS (Animate On Scroll) and Swiper carousels
- **Analytics**: Google Tag Manager integration
- **Deployment**: Docker with Node.js 18 Alpine

### Project Structure

```
components/
├── layout/       # Header, Footer, BackToTop, MobileMenu
├── sections/     # Page sections (Hero, Features, Wallets, etc.)
├── elements/     # Reusable UI components
└── slider/       # Carousel components (TestimonialSlider, BrandSlider)

pages/
├── api/          # API routes (blog proxy, exchanges data)
├── programs/     # Program detail pages (koindx-farm, taskon-quest)
└── [pages].js    # Main pages (index, ecosystem, wallets, node)

store/            # Zustand stores for programs and exchanges
utils/            # GTM utilities
public/           # Static assets (images, CSS, fonts)
```

### Key Components and Pages

#### Main Pages
- **index.js**: Homepage with hero, features, and ecosystem overview
- **ecosystem.js**: Showcases dApps and projects built on Koinos
- **wallets.js**: Lists available wallets (Kondor, Portal, etc.)
- **programs/**: Promotional programs (KoinDX Farm, TaskOn quests)

#### API Routes
- **/api/blog**: Proxies Medium RSS feed for blog posts
- **/api/exchanges**: Returns exchange listings data
- **/api/programs**: Returns active programs information

#### Section Components
- **KoinosHero**: Main landing hero section
- **FeatureEcosystem**: Ecosystem highlights
- **ChainStatistics**: Blockchain metrics display
- **Wallets**: Wallet showcase section
- **EcosystemApps**: Grid of ecosystem applications
- **ProgramsSection**: Active programs display

### Content Management

#### Static Data Locations
- **Ecosystem Apps**: Hardcoded in `components/sections/EcosystemApps.js`
- **Wallets**: Defined in `components/sections/Wallets.js`
- **Chain Statistics**: Static in `components/sections/ChainStatistics.js`
- **Programs**: Managed via Zustand store in `store/programsStore.js`

#### Dynamic Content
- **Blog Posts**: Fetched from Medium via `/api/blog`
- **Exchange Data**: Loaded from `/api/exchanges`

### Development Workflow

1. **Adding New Ecosystem Apps**: Edit `components/sections/EcosystemApps.js`
2. **Adding New Wallets**: Modify `components/sections/Wallets.js`
3. **Creating New Programs**: Add to `pages/programs/` and update store
4. **Styling Changes**: Edit SCSS files in `public/assets/scss/`

### Important Implementation Details

- All images are served from `/assets/images/`
- GTM tracking is initialized in `_app.js`
- Mobile menu state is managed in layout components
- AOS animations are initialized globally
- Docker build creates standalone Next.js output for production

### Common Tasks

#### Adding a New Program
1. Create new page in `pages/programs/[program-name].js`
2. Update `store/programsStore.js` with program data
3. Add program images to `public/assets/images/programs/`

#### Updating Ecosystem Apps
1. Edit the `apps` array in `components/sections/EcosystemApps.js`
2. Add app logo to `public/assets/images/ecosystem/`

#### Modifying Navigation
1. Edit `components/layout/header/Header.js` for desktop menu
2. Update `components/layout/header/MobileMenu.js` for mobile navigation