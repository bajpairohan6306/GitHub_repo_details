import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'

function UserContributions() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch user profile info
      const userResponse = await fetch(`https://api.github.com/users/${username}`)
      if (!userResponse.ok) {
        throw new Error('User not found')
      }
      const userData = await userResponse.json()
      setUserInfo(userData)

      // Fetch user's repositories sorted by stars
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&per_page=5&direction=desc`
      )
      if (reposResponse.ok) {
        const reposData = await reposResponse.json()
        setRepositories(reposData)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading user information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Search
        </button>
        <div className="alert error-alert" style={{ marginTop: '20px' }}>
          <span>❌</span> {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Search
      </button>

      {userInfo && (
        <div className="user-profile">
          <div className="profile-header">
            <img 
              src={userInfo.avatar_url} 
              alt={userInfo.login}
              className="profile-avatar"
            />
            <div className="profile-info">
              <h1>{userInfo.name || userInfo.login}</h1>
              <p className="profile-login">@{userInfo.login}</p>
              {userInfo.bio && <p className="profile-bio">{userInfo.bio}</p>}
              
              <div className="profile-stats">
                <a 
                  href={userInfo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  View on GitHub
                </a>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-icon">📦</span>
                  <div>
                    <p className="detail-value">{userInfo.public_repos}</p>
                    <p className="detail-label">Public Repos</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <div>
                    <p className="detail-value">{userInfo.followers}</p>
                    <p className="detail-label">Followers</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">➕</span>
                  <div>
                    <p className="detail-value">{userInfo.following}</p>
                    <p className="detail-label">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {repositories.length > 0 && (
        <div className="top-repos-section">
          <h2>⭐ Top 5 Repositories</h2>
          <div className="repos-grid">
            {repositories.map((repo) => (
              <div key={repo.id} className="repo-card">
                <div className="repo-card-header">
                  <h3>{repo.name}</h3>
                  <span className="star-count">⭐ {repo.stargazers_count}</span>
                </div>
                {repo.description && (
                  <p className="repo-card-description">{repo.description}</p>
                )}
                <div className="repo-card-footer">
                  {repo.language && (
                    <span className="language-badge">{repo.language}</span>
                  )}
                  <a 
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repo-link"
                  >
                    Visit Repo →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserContributions
