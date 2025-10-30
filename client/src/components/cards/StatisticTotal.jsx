import { MousePointer } from 'lucide-react'

export const StatisticTotal = ({ darkMode, totalClicks }) => {
    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Всього кліків</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {totalClicks}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-3 rounded-lg`}>
                    <MousePointer className="w-8 h-8 text-blue-600" />
                </div>
            </div>
        </div>
    )
}