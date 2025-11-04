import { Link, useNavigate } from 'react-router-dom'
import { clearUser } from '../utils/authLocalStorage.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()

  function handleLogout() {
    // Clear any stored user info (if used elsewhere) and tokens via context
    clearUser()
    logout()
    navigate('/login')
  }

  return (
    <div>
      {/* Make header span the full viewport width regardless of parent sizing.
          Use an inner centered container (max-w-4xl) so content stays aligned. */}
      <header className="sticky top-0 z-10 bg-white shadow-md mb-4">
        <div className="w-full mx-auto flex items-center justify-between px-4 py-3">
          <nav className="flex gap-3 md:gap-6">
            <Link to="/" className="hover:underline p-2">Home</Link>
            <Link to="/dashboard" className="hover:underline p-2">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.name && <span className="mr-3">Hi, {user.name}</span>}
                <button onClick={handleLogout} className="bg-gray-200 px-3 py-1 rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline p-2">Login</Link>
                <Link to="/register" className="hover:underline p-2">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="p-3">
        <div className="mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
