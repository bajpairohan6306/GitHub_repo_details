import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function Home() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [repoInfo, setRepoInfo] = useState(null)
  const [sortBy, setSortBy] = useState('contributions')
  const navigate = useNavigate()

  const fetchContributors = async (e) => {
    e.preventDefault()
    
    const trimmedOwner = owner.trim()
    const trimmedRepo = repo.trim()
    
    if (!trimmedOwner || !trimmedRepo) {
      setError('Please enter both owner and repository name')
      return
    }

    setLoading(true)
    setError('')
    setContributors([])
    setRepoInfo(null)

    try {
      // Fetch contributors
      const response = await fetch(
        `https://api.github.com/repos/${trimmedOwner}/${trimmedRepo}/contributors?per_page=100`
      )
      
      if (!response.ok) {
        throw new Error('Repository not found or is private')
      }

      const data = await response.json()
      
      // Fetch repo info
      try {
        const repoResponse = await fetch(
          `https://api.github.com/repos/${trimmedOwner}/${trimmedRepo}`
        )
        if (repoResponse.ok) {
          const repoData = await repoResponse.json()
          setRepoInfo(repoData)
        }
      } catch (err) {
        console.log('Could not fetch repo info')
      }

      setContributors(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sortedContributors = [...contributors].sort((a, b) => {
    if (sortBy === 'contributions') {
      return b.contributions - a.contributions
    } else if (sortBy === 'name') {
      return a.login.localeCompare(b.login)
    }
    return 0
  })

  const handleContributorClick = (username) => {
    navigate(`/user/${username}`)
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>🚀 GitHub Contributors Finder</h1>
          <p className="subtitle">Discover who's building amazing open-source projects</p>
        </div>
      </header>
      
      <form onSubmit={fetchContributors} className="search-form">
        <div className="form-wrapper">
          <div className="input-group">
            <label htmlFor="owner">Repository Owner</label>
            <input
              id="owner"
              type="text"
              placeholder="e.g., facebook, microsoft, torvalds"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="repo">Repository Name</label>
            <input
              id="repo"
              type="text"
              placeholder="e.g., react, vscode, linux"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              <>
                <span>🔍</span> Find Contributors
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert error-alert">
          <span>❌</span> {error}
        </div>
      )}

      {repoInfo && (
        <div className="repo-info">
          <div className="repo-header">
            <h2>{repoInfo.name}</h2>
            <div className="repo-stats">
              <div className="stat">
                <span className="stat-icon">⭐</span>
                <div>
                  <p className="stat-value">{repoInfo.stargazers_count.toLocaleString()}</p>
                  <p className="stat-label">Stars</p>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">🍴</span>
                <div>
                  <p className="stat-value">{repoInfo.forks_count.toLocaleString()}</p>
                  <p className="stat-label">Forks</p>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">👁️</span>
                <div>
                  <p className="stat-value">{repoInfo.watchers_count.toLocaleString()}</p>
                  <p className="stat-label">Watchers</p>
                </div>
              </div>
            </div>
          </div>
          {repoInfo.description && (
            <p className="repo-description">{repoInfo.description}</p>
          )}
        </div>
      )}

      {contributors.length > 0 && (
        <div className="contributors-section">
          <div className="section-header">
            <h2>👥 Contributors ({contributors.length})</h2>
            <div className="sort-controls">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="contributions">Contributions (High to Low)</option>
                <option value="name">Name (A to Z)</option>
              </select>
            </div>
          </div>
          
          <div className="contributors-list">
            {sortedContributors.map((contributor) => (
              <div 
                key={contributor.id} 
                className="contributor-card"
                onClick={() => handleContributorClick(contributor.login)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={contributor.avatar_url} 
                  alt={contributor.login}
                  className="avatar"
                />
                <div className="contributor-details">
                  <div className="username">
                    {contributor.login}
                  </div>
                  <div className="contributions-badge">
                    {contributor.contributions} {contributor.contributions === 1 ? 'contribution' : 'contributions'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && contributors.length === 0 && !error && (
        <div className="empty-state">
          <p className="empty-icon">🔎</p>
          <p className="empty-text">Search for a repository to see its contributors</p>
        </div>
      )}
    </div>
  )
}

export default Home
