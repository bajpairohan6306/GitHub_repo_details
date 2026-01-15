import { useState } from 'react'
import './App.css'

function App() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    try {
      const response = await fetch(
        `https://api.github.com/repos/${trimmedOwner}/${trimmedRepo}/contributors`
      )
      
      if (!response.ok) {
        throw new Error('Repository not found or is private')
      }

      const data = await response.json()
      console.log(data,data.length)
      setContributors(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>GitHub Repository Contributors</h1>
      
      <form onSubmit={fetchContributors}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Repository owner (username or organization)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Repository name"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Get Contributors'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {contributors.length > 0 && (
        <div className="contributors-list">
          <h2>Contributors ({contributors.length})</h2>
          <ul>
            {contributors.map((contributor) => (
              <li key={contributor.id}>
                <img src={contributor.avatar_url} alt={contributor.login} />
                <div className="contributor-info">
                  <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                    {contributor.login}
                  </a>
                  <p>Contributions: {contributor.contributions}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
