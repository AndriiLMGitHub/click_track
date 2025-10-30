// Компонент пагінації
export const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, darkMode }) => {
    const getPageNumbers = () => {
        const delta = 3;
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }
        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Показано {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} з {totalItems} записів
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${currentPage === 1
                        ? `${darkMode ? 'border-gray-700 text-gray-600' : 'border-gray-200 text-gray-400'} cursor-not-allowed`
                        : `${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Попередня</span>
                </button>

                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className={`px-3 py-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-2 rounded-lg border transition-all min-w-[40px] ${currentPage === page
                                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                                        : `${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${currentPage === totalPages
                        ? `${darkMode ? 'border-gray-700 text-gray-600' : 'border-gray-200 text-gray-400'} cursor-not-allowed`
                        : `${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                        }`}
                >
                    <span className="hidden sm:inline">Наступна</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Показувати на сторінці:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onPageChange(1, Number(e.target.value))}
                    className={`px-3 py-1 border rounded-lg ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={18}>18</option>
                    <option value={24}>24</option>
                </select>
            </div>
        </div>
    );
};