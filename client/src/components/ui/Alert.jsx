import { Check, AlertCircle, X } from 'lucide-react';

// Компонент для показу сповіщень
export const Alert = ({ type, message, onClose, darkMode }) => {
    const bgColor = type === 'success'
        ? (darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200')
        : (darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200');
    const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
    const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
    const Icon = type === 'success' ? Check : AlertCircle;

    return (
        <div className={`fixed top-4 right-4 z-50 ${bgColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md animate-slide-in`}>
            <Icon className={`${iconColor} w-5 h-5 flex-shrink-0`} />
            <p className={`text-sm ${textColor}`}>{message}</p>
            <button onClick={onClose} className="ml-auto">
                <X className={`w-4 h-4 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`} />
            </button>
        </div>
    );
};