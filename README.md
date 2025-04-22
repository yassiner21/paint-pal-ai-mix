# Pigment Mixer

A powerful web application that helps artists and painters find the perfect mixture of primary colors to achieve any desired color. Whether you're working with acrylic, oil, or watercolor paints, Pigment Mixer provides precise mixing ratios to help you create the exact color you need.

## Features

- **Color Code Input**: Enter specific color codes in HEX or RGB format
- **Photo Upload**: Upload images to extract colors directly from them
- **Interactive Color Controls**: 
  - HSL (Hue, Saturation, Lightness) sliders
  - RGB value inputs
  - Visual color preview
- **Saved Mixes**: Save and manage your favorite color combinations
- **Mobile-First Design**: Optimized for both mobile and desktop use
- **User-Friendly Interface**: Clean and intuitive design for all skill levels

## Screenshots

### Home Screen
![Home Screen](public/images/home-screen.png)
*The main interface with photo upload and color code input options*

### Color Picker
![Color Picker](public/images/color-picker.png)
*Interactive color selection with HSL controls and RGB values*

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Capacitor for Android build
- React Router DOM
- React Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (included with Node.js)
- For Android development: Android Studio and JDK

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yassiner21/pigment-mixer.git
```

2. Navigate to the project directory:
```bash
cd pigment-mixer
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`

## Building for Production

### Web Build
```bash
npm run build
```

### Android Build
```bash
npm run build
npx cap sync android
npx cap open android
```

## License

MIT License

Copyright (c) 2024 Yassine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contact

Yassine
- Email: yassinerachdi058@gmail.com
- GitHub: [@yassiner21](https://github.com/yassiner21)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request