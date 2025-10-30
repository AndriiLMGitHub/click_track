import { Moon, Sun } from 'lucide-react'

export const DarkModeSwitcher = ({ darkMode, toggleDarkMode }) => {
    return (
        <div className="flex justify-end mb-4">
            <button
                onClick={() => toggleDarkMode(!darkMode)}
                className={`p-3 rounded-lg ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                    } shadow-lg transition-all duration-300`}
                aria-label="Перемкнути тему"
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
        </div>
    )
}