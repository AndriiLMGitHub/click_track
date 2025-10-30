import { Globe } from "lucide-react"

export const UniqueIP = ({ darkMode, uniqueIPs }) => {
    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Унікальні IP</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {uniqueIPs}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} p-3 rounded-lg`}>
                    <Globe className="w-8 h-8 text-green-600" />
                </div>
            </div>
        </div>
    )
}