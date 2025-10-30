export const Heading = ({ darkMode, content }) => {
    return (
        <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                Click Tracker
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{content}</p>
        </div>
    )
}