import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'

// Mock fetch globally
global.fetch = vi.fn()

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders the header with correct title', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const title = screen.getByText(/GitHub Contributors Finder/i)
    expect(title).toBeInTheDocument()
  })

  it('renders input fields for owner and repo', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const ownerInput = screen.getByPlaceholderText(/e.g., facebook, microsoft/i)
    const repoInput = screen.getByPlaceholderText(/e.g., react, vscode/i)
    
    expect(ownerInput).toBeInTheDocument()
    expect(repoInput).toBeInTheDocument()
  })

  it('renders search button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const searchBtn = screen.getByRole('button', { name: /Find Contributors/i })
    expect(searchBtn).toBeInTheDocument()
  })

  it('shows error message when inputs are empty', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const searchBtn = screen.getByRole('button', { name: /Find Contributors/i })
    fireEvent.click(searchBtn)
    
    await waitFor(() => {
      const errorMsg = screen.getByText(/Please enter both owner and repository name/i)
      expect(errorMsg).toBeInTheDocument()
    })
  })

  it('disables inputs and button while loading', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => null,
      },
      json: async () => [
        {
          id: 1,
          login: 'user1',
          avatar_url: 'https://example.com/avatar.jpg',
          contributions: 10,
        },
      ],
    })

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'test-repo',
        stargazers_count: 100,
        forks_count: 50,
        watchers_count: 75,
        description: 'Test repository',
      }),
    })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const ownerInput = screen.getByPlaceholderText(/e.g., facebook, microsoft/i)
    const repoInput = screen.getByPlaceholderText(/e.g., react, vscode/i)
    const searchBtn = screen.getByRole('button', { name: /Find Contributors/i })
    
    fireEvent.change(ownerInput, { target: { value: 'facebook' } })
    fireEvent.change(repoInput, { target: { value: 'react' } })
    fireEvent.click(searchBtn)
    
    await waitFor(() => {
      expect(ownerInput).toBeDisabled()
      expect(repoInput).toBeDisabled()
      expect(searchBtn).toBeDisabled()
    })
  })

  it('displays error message on API failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Repository not found or is private'))
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const ownerInput = screen.getByPlaceholderText(/e.g., facebook, microsoft/i)
    const repoInput = screen.getByPlaceholderText(/e.g., react, vscode/i)
    const searchBtn = screen.getByRole('button', { name: /Find Contributors/i })
    
    fireEvent.change(ownerInput, { target: { value: 'invalid' } })
    fireEvent.change(repoInput, { target: { value: 'repo' } })
    fireEvent.click(searchBtn)
    
    await waitFor(() => {
      const errorMsg = screen.getByText(/Repository not found or is private/i)
      expect(errorMsg).toBeInTheDocument()
    })
  })

  it('fetches and displays contributors on successful search', async () => {
    const mockContributors = [
      {
        id: 1,
        login: 'user1',
        avatar_url: 'https://example.com/avatar1.jpg',
        contributions: 100,
        html_url: 'https://github.com/user1',
      },
      {
        id: 2,
        login: 'user2',
        avatar_url: 'https://example.com/avatar2.jpg',
        contributions: 50,
        html_url: 'https://github.com/user2',
      },
    ]

    const mockRepoInfo = {
      name: 'react',
      stargazers_count: 200000,
      forks_count: 50000,
      watchers_count: 10000,
      description: 'A JavaScript library for building user interfaces',
    }

    fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => null,
        },
        json: async () => mockContributors,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepoInfo,
      })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const ownerInput = screen.getByPlaceholderText(/e.g., facebook, microsoft/i)
    const repoInput = screen.getByPlaceholderText(/e.g., react, vscode/i)
    const searchBtn = screen.getByRole('button', { name: /Find Contributors/i })
    
    fireEvent.change(ownerInput, { target: { value: 'facebook' } })
    fireEvent.change(repoInput, { target: { value: 'react' } })
    fireEvent.click(searchBtn)
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument()
      expect(screen.getByText('user2')).toBeInTheDocument()
    })
  })

  it('sorts contributors by name', async () => {
    const mockContributors = [
      {
        id: 1,
        login: 'charlie',
        avatar_url: 'https://example.com/avatar1.jpg',
        contributions: 10,
        html_url: 'https://github.com/charlie',
      },
      {
        id: 2,
        login: 'alice',
        avatar_url: 'https://example.com/avatar2.jpg',
        contributions: 20,
        html_url: 'https://github.com/alice',
      },
      {
        id: 3,
        login: 'bob',
        avatar_url: 'https://example.com/avatar3.jpg',
        contributions: 15,
        html_url: 'https://github.com/bob',
      },
    ]

    fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => null,
        },
        json: async () => mockContributors,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'test',
          stargazers_count: 100,
          forks_count: 50,
          watchers_count: 75,
          description: 'Test',
        }),
      })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const ownerInput = screen.getByPlaceholderText(/e.g., facebook, microsoft/i)
    const repoInput = screen.getByPlaceholderText(/e.g., react, vscode/i)
    
    fireEvent.change(ownerInput, { target: { value: 'test' } })
    fireEvent.change(repoInput, { target: { value: 'repo' } })
    fireEvent.click(screen.getByRole('button', { name: /Find Contributors/i }))
    
    await waitFor(() => {
      expect(screen.getByText('charlie')).toBeInTheDocument()
    })

    const sortSelect = screen.getByDisplayValue('Contributions (High to Low)')
    fireEvent.change(sortSelect, { target: { value: 'name' } })

    await waitFor(() => {
      const contributors = screen.getAllByText(/alice|bob|charlie/)
      expect(contributors[0]).toHaveTextContent('alice')
    })
  })

  it('displays empty state when no search performed', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const emptyMsg = screen.getByText(/Search for a repository to see its contributors/i)
    expect(emptyMsg).toBeInTheDocument()
  })

  it('shows pagination controls when there are many contributors', async () => {
    const mockContributors = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      login: `user${i + 1}`,
      avatar_url: `https://example.com/avatar${i + 1}.jpg`,
      contributions: 100 - i,
      html_url: `https://github.com/user${i + 1}`,
    }))

    fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'page=5>; rel="last"',
        },
        json: async () => mockContributors,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'test',
          stargazers_count: 100,
          forks_count: 50,
          watchers_count: 75,
          description: 'Test',
        }),
      })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const ownerInput = screen.getByPlaceholderText(/e.g., facebook, microsoft/i)
    const repoInput = screen.getByPlaceholderText(/e.g., react, vscode/i)
    
    fireEvent.change(ownerInput, { target: { value: 'test' } })
    fireEvent.change(repoInput, { target: { value: 'repo' } })
    fireEvent.click(screen.getByRole('button', { name: /Find Contributors/i }))
    
    await waitFor(() => {
      const nextBtn = screen.getByRole('button', { name: /Next/i })
      expect(nextBtn).toBeInTheDocument()
    })
  })

  it('trims whitespace from inputs before fetching', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => null,
        },
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'test',
          stargazers_count: 100,
          forks_count: 50,
          watchers_count: 75,
          description: 'Test',
        }),
      })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const ownerInput = screen.getByPlaceholderText(/e.g., facebook, microsoft/i)
    const repoInput = screen.getByPlaceholderText(/e.g., react, vscode/i)
    
    fireEvent.change(ownerInput, { target: { value: '  facebook  ' } })
    fireEvent.change(repoInput, { target: { value: '  react  ' } })
    fireEvent.click(screen.getByRole('button', { name: /Find Contributors/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('repos/facebook/react/contributors')
      )
    })
  })
})
