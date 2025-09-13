# EduIndia - Indian Education Platform

A comprehensive educational platform designed specifically for Indian students with offline-first capabilities, multilingual support, and low-bandwidth optimization.

## 🌟 Features

### 🎯 Core Functionality
- **Offline-First Design**: Complete functionality without internet connection
- **Multilingual Support**: English, Hindi, Marathi with easy expansion
- **Audio-First Learning**: Optimized for 2G/3G networks
- **PWA Capabilities**: Install as native app on any device
- **Real-time Sync**: Automatic synchronization when online

### 👨‍🎓 Student Features
- Interactive dashboard with progress tracking
- Audio lessons with slide synchronization
- Assignment submission via photos/files
- Achievement system and badges
- Parent progress reports
- Offline lesson downloads

### 👩‍🏫 Teacher Features
- Easy lesson recording interface
- Assignment grading with AI assistance
- Live class management
- Student progress monitoring
- Content publishing tools

### 📱 Technical Features
- Service Worker for offline caching
- IndexedDB for local data storage
- Responsive design for all devices
- Accessibility compliance (WCAG)
- Low bandwidth mode

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/BLUESOUL777/EduIndia.git
cd EduIndia

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Accounts
- **Student**: username: `student`, password: `demo123`
- **Teacher**: username: `teacher`, password: `demo123`

## 🎮 Demo Mode

### Offline Toggle
Click the network status button in the header to simulate offline conditions:
- **Green (Online)**: Full functionality with simulated network calls
- **Orange (Offline)**: Cached content only, demonstrates offline capabilities

### Language Switching
Use the language dropdown in the header to switch between:
- English
- हिंदी (Hindi)  
- मराठी (Marathi)

### Network Simulation
For realistic testing, use Chrome DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" or "Fast 3G"
4. Observe loading behaviors and optimizations

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LessonPlayer.tsx    # Audio lesson player
│   ├── RecorderStub.tsx    # Teacher recording interface
│   ├── OfflineToggle.tsx   # Offline mode control
│   └── SkeletonLoader.tsx  # Loading states
├── pages/              # Main application pages
│   ├── Dashboard.tsx      # Student/parent dashboard
│   ├── Lessons.tsx        # Lesson browser
│   ├── Assignments.tsx    # Assignment management
│   └── LiveClasses.tsx    # Virtual classroom
├── services/           # Data and API services
│   └── mockService.ts     # Mock backend with localStorage
├── hooks/              # Custom React hooks
│   └── useI18n.ts         # Internationalization
├── i18n/               # Translation files
│   ├── en.json           # English translations
│   ├── hi.json           # Hindi translations
│   └── mar.json          # Marathi translations
├── mock/               # Sample data
│   ├── courses.json      # Course catalog
│   ├── lessons.json      # Lesson content
│   ├── assignments.json  # Assignment data
│   └── students.json     # Student profiles
└── utils/              # Utility functions
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Languages
1. Create translation file in `src/i18n/{language}.json`
2. Add language option to `useI18n.ts`
3. Update language selector in header component

### Mock Data Management
- All data stored in `localStorage` with `eduindia_` prefix
- Reset data: `localStorage.clear()` in browser console
- Modify sample data in `src/mock/` directory

## 🎯 Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin, Workbox
- **Storage**: localStorage, IndexedDB
- **Audio**: Web Audio API, MediaRecorder API
- **Offline**: Service Workers, Cache API

## 📊 Performance Optimizations

### Bandwidth Optimization
- Audio-first content (80% smaller than video)
- WebP images with fallbacks
- Lazy loading for non-critical content
- Compression for all assets

### Offline Strategy
- Cache-first for static assets
- Network-first for dynamic content
- Background sync for uploads
- Graceful degradation

### Mobile Optimization
- Touch-friendly interface
- Responsive breakpoints
- Reduced motion support
- High contrast mode

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables
No environment variables required - fully client-side application.

## 🧪 Testing

### Manual Testing Checklist
- [ ] Offline mode toggle works
- [ ] Language switching persists
- [ ] Audio playback functions
- [ ] File uploads simulate correctly
- [ ] Progress tracking updates
- [ ] PWA installation prompt appears
- [ ] Mobile responsive design
- [ ] Keyboard navigation works

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Smart India Hackathon** for the opportunity
- **Rural educators** for insights and feedback
- **Open source community** for tools and libraries
- **Pexels** for demo images

## 📞 Support

For demo support or questions:
- Email: demo@eduindia.com
- GitHub Issues: [Create Issue](https://github.com/BLUESOUL777/EduIndia/issues)

---

**Built with ❤️ for India's educational future**