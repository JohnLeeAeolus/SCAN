# ScanConnect

A React Native mobile application for managing security scans and reports.

## Features

- User authentication
- Schedule management
- Report generation and viewing
- Admin dashboard with analytics
- Modern and intuitive UI

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment setup
- Firebase account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scanconnect
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Update the Firebase configuration in `firebase/config.ts`

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
# For iOS
npm run ios

# For Android
npm run android
```

## Project Structure

```
scanconnect/
├── assets/                     # Static assets like images, icons
├── components/                 # Reusable UI components
│   └── Header.tsx
├── screens/                    # Screens used in navigation
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ScheduleScreen.tsx
│   ├── ReportScreen.tsx
│   └── AdminDashboard.tsx
├── firebase/                   # Firebase configuration
│   └── config.ts
├── types/                      # Type definitions
│   └── navigation.ts
├── App.tsx                     # Root of your app
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.