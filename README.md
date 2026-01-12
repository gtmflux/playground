# Vinay Tambe - GTM Engineer Portfolio

A professional resume website showcasing GTM engineering expertise, built with React and modern web technologies.

## Tech Stack

- **React 19** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## Features

- Responsive design for all devices
- Modern, clean UI with dark theme
- Smooth animations and transitions
- SEO optimized
- Fast loading times

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn (v1.22 or higher)

### Installation

```bash
cd frontend
yarn install
```

### Development

```bash
yarn start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build

```bash
yarn build
```

Creates an optimized production build in the `build` folder.

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   │   ├── ui/      # Reusable UI components
│   │   └── workflows/ # Workflow diagram components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── mockData.js  # Portfolio content data
│   ├── App.js       # Main application component
│   └── index.js     # Entry point
└── package.json
```

## Customization

To update the portfolio content, edit the data in `src/mockData.js`:

- **quickFacts**: Location, focus, strengths, tech stacks
- **workingPrinciples**: Your working methodologies
- **experience**: Work history and achievements
- **coreSkills**: Technical skills with impact metrics
- **contactInfo**: Contact information

## Deployment

This is a static front-end application and can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drop the `build` folder or connect your git repo
- **GitHub Pages**: Configure in repository settings
- **AWS S3 + CloudFront**: Upload build folder to S3

## License

Personal portfolio website © 2026 Vinay Tambe
