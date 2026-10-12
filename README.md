<div align="center">
# Snapshelf
 
### A responsive image gallery with a built-in photo editor
 
Built with plain HTML, CSS and JavaScript. No frameworks, no build step.
 
[**Live Demo**](https://snapshelfimagegallery.vercel.app/) · [**Source Code**](https://github.com/ashaxiong-lgtm/image_gallery_snapshelf)
 
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel&logoColor=white)
 
![Snapshelf screenshot](screenshot.png)
 
</div>
---
 
## Overview
 
Snapshelf is a photo gallery created as **Task 1** of my internship. Visitors can browse photos in a masonry grid, filter by category, search by title, and open any photo in a lightbox. Inside the lightbox they can edit the photo with live filters and download the result.
 
## Features
 
### Core requirements
| Requirement | How it is done |
|---|---|
| Image gallery with HTML and CSS | Masonry grid built with CSS columns, photos shown in "slide mount" cards |
| JavaScript navigation | Lightbox with next / previous buttons, keyboard arrows, Esc to close and touch swipe |
| Hover effects and transitions | Card lift and tilt, image zoom, fade-in loading and smooth lightbox changes |
| Responsive design | Layouts for phone, tablet and laptop using media queries |
 
### Bonus features
- **Category filters:** All, Nature, City, Portrait and Abstract
- **Live search:** find photos by title or category as you type
- **Photo editor** inside the lightbox:
  - Presets: Original, Vibrant, Dreamy, Vintage, B&W and Faded
  - Sliders: blur, brightness, contrast, vibrance, black & white, warmth and opacity
  - Reset button and **download of the edited photo as PNG**
  - Edits are saved in the browser with `localStorage`
- **Three themes:** Light, Dark and Blue mode, remembered between visits
### Extras
- Lazy loading with a loading shimmer
- Accessible controls with labels and visible focus outlines
- Respects the "reduce motion" system setting
## Tech Stack
- **HTML5:** semantic structure
- **CSS3:** columns, Flexbox, CSS variables, media queries, `color-mix()`
- **JavaScript (ES6):** DOM manipulation, events, Canvas API, `localStorage`
## Project Structure
```
image_gallery_snapshelf/
├── index.html    # page structure
├── style.css     # layout, themes, animations, responsive rules
├── script.js     # photo data, filters, lightbox, editor, themes
└── README.md
```
 
## Getting Started
 
1. Clone the repository
```bash
   git clone https://github.com/ashaxiong-lgtm/image_gallery_snapshelf.git
```
2. Open the folder and double-click `index.html`, or use the **Live Server** extension in VS Code.
> The "Download edit" button works best on the live site or through a local server.
 
## Use Your Own Photos
 
1. Create an `images/` folder and add your pictures.
2. In `script.js`, edit the `photos` array at the top of the file:
```js
   { title: "Forest Walk", category: "Nature", src: "images/forest.jpg", w: 800, h: 1000 }
```
3. Set `title`, `category`, `src` and the image size (`w`, `h`) for each photo.

## Author
**Sumya Akter Asha**
GitHub: [@ashaxiong-lgtm](https://github.com/ashaxiong-lgtm)
