# ImageHub

**ImageHub** is an easy-to-use image gallery that allows you to display and explore images dynamically. The project provides a backend API to serve images, a random image feature, and an intuitive frontend interface for browsing, zooming, and fullscreen views.

### Features:
- **Image Gallery**: Browse through an interactive image gallery with thumbnail previews.
- **Random Image**: View random images by clicking the "Random Image" button.
- **Image Zoom**: Zoom in on an image for a closer look.
- **Fullscreen View**: View images in fullscreen mode for better visibility.
- **Copy Image URL**: Easily copy the current image or random image URL.

### API Endpoints:
- **GET `/api/image?img={index}`**: Fetch an image by index number.
- **GET `/api/random-image`**: Fetch a random image URL from the server.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ImageHub.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```

### Usage
- Visit the project in your browser (default: http://localhost:3000).
- Use the provided controls to browse through images, view them in fullscreen, or copy the URL.
