export const Loading = ({ darkMode }) => {
    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center`}>
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Завантаження...</p>
            </div>
        </div>
    )
}