import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import UserContributions from '../pages/UserContributions'

global.fetch = vi.fn()

describe('UserContributions Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders loading state initially', () => {
    fetch.mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves
    )

    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    const loadingText = screen.getByText(/Loading user information/i)
    expect(loadingText).toBeInTheDocument()
  })

  it('renders back button', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          login: 'testuser',
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg',
          bio: 'Test bio',
          html_url: 'https://github.com/testuser',
          public_repos: 10,
          followers: 100,
          following: 50,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      const backBtn = screen.getByRole('button', { name: /Back to Search/i })
      expect(backBtn).toBeInTheDocument()
    })
  })

  it('displays user profile information', async () => {
    const mockUserData = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      html_url: 'https://github.com/testuser',
      public_repos: 10,
      followers: 100,
      following: 50,
    }

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('@testuser')).toBeInTheDocument()
      expect(screen.getByText('Test bio')).toBeInTheDocument()
    })
  })

  it('displays user statistics', async () => {
    const mockUserData = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      html_url: 'https://github.com/testuser',
      public_repos: 10,
      followers: 100,
      following: 50,
    }

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument() // public_repos
      expect(screen.getByText('100')).toBeInTheDocument() // followers
      expect(screen.getByText('50')).toBeInTheDocument() // following
    })
  })

  it('displays user repositories', async () => {
    const mockUserData = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      html_url: 'https://github.com/testuser',
      public_repos: 5,
      followers: 100,
      following: 50,
    }

    const mockRepos = [
      {
        id: 1,
        name: 'repo1',
        description: 'Repository 1',
        stargazers_count: 100,
        language: 'JavaScript',
        html_url: 'https://github.com/testuser/repo1',
      },
      {
        id: 2,
        name: 'repo2',
        description: 'Repository 2',
        stargazers_count: 50,
        language: 'Python',
        html_url: 'https://github.com/testuser/repo2',
      },
    ]

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })

    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('repo1')).toBeInTheDocument()
      expect(screen.getByText('repo2')).toBeInTheDocument()
      expect(screen.getByText('Repository 1')).toBeInTheDocument()
      expect(screen.getByText('Repository 2')).toBeInTheDocument()
    })
  })

  it('displays error message on API failure', async () => {
    fetch
      .mockRejectedValueOnce(new Error('User not found'))
      .mockRejectedValueOnce(new Error('User not found'))

    render(
      <MemoryRouter initialEntries={['/user/invalid']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/User not found/i)).toBeInTheDocument()
    })
  })

  it('displays language badges for repositories', async () => {
    const mockUserData = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      html_url: 'https://github.com/testuser',
      public_repos: 2,
      followers: 100,
      following: 50,
    }

    const mockRepos = [
      {
        id: 1,
        name: 'repo1',
        description: 'JavaScript project',
        stargazers_count: 100,
        language: 'JavaScript',
        html_url: 'https://github.com/testuser/repo1',
      },
    ]

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })

    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
    })
  })

  it('handles repositories with null language', async () => {
    const mockUserData = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      html_url: 'https://github.com/testuser',
      public_repos: 1,
      followers: 100,
      following: 50,
    }

    const mockRepos = [
      {
        id: 1,
        name: 'repo1',
        description: 'No language repo',
        stargazers_count: 10,
        language: null,
        html_url: 'https://github.com/testuser/repo1',
      },
    ]

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })

    render(
      <MemoryRouter initialEntries={['/user/testuser']}>
        <Routes>
          <Route path="/user/:username" element={<UserContributions />} />
        </Routes>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('No language repo')).toBeInTheDocument()
    })
  })
})
