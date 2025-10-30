export const TitleCarts = ({ darkMode, currentPage, totalPages, clicks }) => {
    return (
        <div id="clicks-section" className="mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Історія кліків</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Сторінка {currentPage} з {totalPages} • Всього записів: {clicks.length}
            </p>
        </div>
    )
}