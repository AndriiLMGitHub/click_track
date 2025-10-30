import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

// Модальне вікно для підтвердження видалення
export const DeleteModal = ({ isOpen, onClose, onConfirm, clickData, darkMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Підтвердження видалення</h3>
                    <button onClick={onClose} className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    Ви впевнені, що хочете видалити цей запис?
                </p>

                {clickData && (
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            <span className="font-semibold">ID:</span> {clickData.id}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            <span className="font-semibold">IP:</span> {clickData.ip}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            <span className="font-semibold">Локація:</span> {clickData.city}, {clickData.region}, {clickData.country}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className="font-semibold">Кліків:</span> {clickData.total_clicks}
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className={`flex-1 px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Видалити
                    </button>
                </div>
            </div>
        </div>
    );
};