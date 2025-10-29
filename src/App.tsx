import { Routes, Route, NavLink } from 'react-router-dom';
import Home from '@pages/Home';
import Learn from '@pages/Learn';
import Visualizer from '@pages/Visualizer';
import Quiz from '@pages/Quiz';
import About from '@pages/About';
import ThemeToggle from '@components/ThemeToggle';

function NavBar() {
  const base = 'px-3 py-2 rounded-md text-sm font-medium';
  const active = 'bg-gray-200 dark:bg-gray-800';
  const link = ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? active : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`;
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="container max-w-6xl flex items-center justify-between h-14">
        <NavLink to="/" className="font-semibold tracking-tight">
          <span className="brand-gradient">DataStructViz</span>
        </NavLink>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={link}>Home</NavLink>
          <NavLink to="/visualizer" className={link}>Visualizer</NavLink>
          <NavLink to="/quiz" className={link}>Quiz</NavLink>
          <NavLink to="/about" className={link}>About</NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-8 py-8 text-center text-sm text-gray-500">
      Built with React + Tailwind. © {new Date().getFullYear()} DataStructViz
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container max-w-6xl py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn/:topic" element={<Learn />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
