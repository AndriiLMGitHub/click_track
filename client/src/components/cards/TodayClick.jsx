import { TrendingUp } from 'lucide-react';

export const TodayClick = ({ darkMode, todayClicks }) => {
    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Сьогодні</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {todayClicks}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'} p-3 rounded-lg`}>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
            </div>
        </div>
    )
}