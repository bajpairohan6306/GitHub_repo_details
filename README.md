# 🚀 GitHub Contributors Finder

A modern web application built with React and Vite that helps you discover contributors of any public GitHub repository and explore their top projects.

## ✨ Features

### 🔍 Repository Search
- Search for any public GitHub repository by owner and repository name
- View repository statistics including:
  - Star count ⭐
  - Fork count 🍴
  - Watcher count 👁️
  - Repository description

### 👥 Contributors Discovery
- Display all contributors of a repository
- See the number of contributions per contributor
- **Sort contributors by:**
  - Contributions (High to Low) - Default
  - Name (Alphabetically)
- Click on any contributor to view their profile

### 👤 User Profile Page
When you click on a contributor, you can view:
- **User Information:**
  - Profile picture
  - Full name and GitHub username
  - User bio/description
  - Direct link to GitHub profile

- **User Statistics:**
  - Total public repositories
  - Follower count
  - Following count

- **Top 5 Repositories:**
  - Sorted by star count (most popular first)
  - Shows repository name, description, and programming language
  - Direct link to each repository
  - Star count for each project

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM
- **Styling:** Pure CSS with modern design patterns
- **API:** GitHub REST API (Public)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bajpairohan6306/GitHub_repo_details.git
   cd GitHub_repo_details
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 🚀 Usage

### Search for Contributors
1. Open the application
2. Enter the **Repository Owner** (e.g., `facebook`, `microsoft`, `torvalds`)
3. Enter the **Repository Name** (e.g., `react`, `vscode`, `linux`)
4. Click **"Find Contributors"** button
5. View the list of contributors for that repository

### Explore a Contributor
1. Click on any contributor card
2. You'll be taken to their profile page showing:
   - Their GitHub profile information
   - Their top 5 most-starred repositories
3. Click on any repository to visit it on GitHub
4. Use the **"Back to Search"** button to return to the main page

### Sort Contributors
- Use the **"Sort by"** dropdown on the contributors section to:
  - Sort by contributions (descending)
  - Sort alphabetically by name

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (small screens)
- 📱 Tablets (medium screens)
- 🖥️ Desktop computers (large screens)

## 🎨 Design Features

- **Modern Dark Theme:** Dark blue and gradient backgrounds with accent colors
- **Glass Morphism:** Semi-transparent cards with backdrop blur effects
- **Smooth Animations:** Fade-in effects and hover animations
- **Interactive Cards:** Hover effects on contributor and repository cards
- **Intuitive UI:** Clear visual hierarchy and user-friendly interface

## 🔧 Project Structure

```
GitHub_repo_details/
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Repository search page
│   │   └── UserContributions.jsx # User profile page
│   ├── App.jsx                   # Main app with routing
│   ├── App.css                   # Global styles
│   ├── index.css                 # Base styles
│   └── main.jsx                  # Entry point
├── public/                       # Static assets
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── netlify.toml                 # Netlify deployment config
└── README.md                    # This file
```

## 🌐 API Integration

The app uses the **GitHub REST API** to fetch:
- Repository information
- List of contributors
- User profiles and statistics
- User repositories

**Note:** GitHub API has rate limits for unauthenticated requests:
- 60 requests per hour for unauthenticated requests
- 5,000 requests per hour with authentication

To increase rate limits, you can add a GitHub personal access token in future updates.

## 🚀 Deployment

### Deploy on Netlify

The project is configured for easy deployment on Netlify:

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Netlify will automatically:
   - Install dependencies
   - Build the project
   - Deploy it with auto-deployment on push

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

The app will be live at a Netlify domain (e.g., `https://yourapp.netlify.app`)

## 📝 Available Scripts

In the project directory, you can run:

### `npm run dev`
Starts the development server with hot module reloading

### `npm run build`
Builds the app for production to the `dist` folder

### `npm run preview`
Preview the production build locally

### `npm run lint`
Run ESLint to check code quality

## 🐛 Error Handling

The app handles various error scenarios:
- **Repository Not Found:** Displays error message if repository doesn't exist
- **Private Repository:** Shows appropriate error for private repositories
- **Network Errors:** Handles API failures gracefully
- **User Not Found:** Shows error if user profile cannot be found

## ✨ Key Improvements Made

- ✅ Trim whitespace from inputs before API calls
- ✅ Modern dark theme with gradient backgrounds
- ✅ Sort functionality for contributors
- ✅ Repository statistics display
- ✅ Responsive grid layout
- ✅ Click-through navigation to user profiles
- ✅ Top 5 repositories display
- ✅ Improved dropdown styling
- ✅ Loading states and animations
- ✅ Git version control with meaningful commits

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Amit Bajpai**
- GitHub: [@bajpairohan6306](https://github.com/bajpairohan6306)
- Repository: [GitHub_repo_details](https://github.com/bajpairohan6306/GitHub_repo_details)

## 🙏 Acknowledgments

- GitHub for providing the REST API
- React community for excellent documentation
- Vite for lightning-fast build tool
- All contributors and users of this app

## 📞 Support

If you encounter any issues or have suggestions, please:
- Open an issue on GitHub
- Check existing issues for similar problems
- Provide detailed description of the problem

## 🎯 Future Enhancements

Planned features for future releases:
- [ ] Add GitHub authentication for higher rate limits
- [ ] User timeline/contribution graph
- [ ] Repository language statistics
- [ ] Commit history visualization
- [ ] Advanced search filters
- [ ] Favorite/bookmark repositories
- [ ] Dark/Light theme toggle
- [ ] User search functionality
- [ ] Organization support
- [ ] Trending repositories

---

**Happy exploring! 🚀** If you find this app useful, please give it a ⭐ on GitHub!
