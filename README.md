![Lingolin Logo](https://via.placeholder.com/150?text=Lingolin)

<!-- Replace with your actual logo -->

A browser extension that enhances language learning through interactive features
directly in your browser. Lingolin helps users practice languages while browsing
the web, with gamified elements and credit-based learning activities.

### Find all the repos:

- Website & Backend (NextJS):
  [https://github.com/lingolin-xyz/lingolin-xyz](https://github.com/lingolin-xyz/lingolin-xyz)

- Smart Contracts (hardhat + Solidity):
  [https://github.com/lingolin-xyz/lingolin-extension](https://github.com/lingolin-xyz/lingolin-extension)

# Lingolin Chrome Extension

## 🌟 Features

- **Seamless Integration**: Works directly in your browser while you browse
- **User Authentication**: Secure login system that syncs with your Lingolin
  account
- **Credit System**: Track and manage your learning credits
- **Interactive UI**: Modern, responsive interface with animations
- **Real-time Feedback**: Immediate responses to your language practice

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome, Firefox, or Edge browser

## 🚀 Installation

### For Development

1. Clone the repository:

   ```bash
   git clone https://github.com/lingolin-xyz/lingolin-extension.git
   cd lingolin-extension
   ```

2. Install dependencies:

   ```bash
   npm install --force
   ```

3. Build the `dist` folder for the Extention to work on your Browser:

   ```bash
   npm run build
   ```

4. Load the extension in your browser:
   - Chrome: Go to `chrome://extensions/`,
   - enable Developer mode,
   - click "Load unpacked",
   - and select the `dist` folder

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **3D Effects**: Three.js with React Three Fiber
- **Animations**: Framer Motion
- **UI Components**: Radix UI

## 🔧 Development

### Project Structure

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the
configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to
  `tseslint.configs.recommendedTypeChecked` or
  `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install
  [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and
  update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react"

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
})
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📱 Related Projects

- [Lingolin Web App](#) <!-- Add actual link when available -->
- [Lingolin Mobile App](#) <!-- Add actual link when available -->
- [Lingolin API](#) <!-- Add actual link when available -->

## 📄 Legal

- [Privacy Policy](./privacy-policy.md)
- [Terms of Use](./terms-of-use.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📬 Contact

- Website: [lingolin.xyz](https://lingolin.xyz)
  <!-- Replace with actual website -->
- Email: [contact@lingolin.xyz](mailto:contact@lingolin.xyz)
  <!-- Replace with actual email -->
- Twitter: [@lingolin](https://twitter.com/lingolin)
  <!-- Replace with actual Twitter -->

## 📃 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file
for details.

---

Built with ❤️ by the Lingolin Team
