import { useState, useEffect } from 'react';
import { Alert } from './components/ui/Alert.jsx';
import { DeleteModal } from './components/ui/Modal.jsx';
import { Pagination } from './components/Pagination.jsx';
import { Trash2, Dna, Clock, Wifi, MapPinHouse, Globe, MapPin, Calendar, ClipboardCopy } from 'lucide-react';
import { Loading } from './components/ui/Loading.jsx';
import { DarkModeSwitcher } from './components/ui/DarkModeSwitcher.jsx';
import { Heading } from './components/Heading.jsx';
import { StatisticTotal } from './components/cards/StatisticTotal.jsx';
import { UniqueIP } from './components/cards/UniqueIP.jsx';
import { TodayClick } from './components/cards/TodayClick.jsx';
import { TitleCarts } from './components/cards/TitleCarts.jsx';


// Головний компонент додатка
export default function ClickTracker() {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, clickData: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [darkMode, setDarkMode] = useState(false);

  const API_BASE = 'https://interner-provider-link-service.onrender.com';
  // const API_BASE = 'http://127.0.0.1:8000'

  // Завантаження теми з localStorage при монтуванні
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Збереження теми в localStorage при зміні
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const statsResponse = await fetch(`${API_BASE}/api/click/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setClicks(statsData);
      } else {
        throw new Error('Помилка завантаження даних');
      }

    } catch (error) {
      console.error('Помилка завантаження:', error);
      showAlert('error', 'Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  };

  const registerClick = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/click/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (response.ok) {
        showAlert('success', `Посилання успішно зареєстровано!`);
        loadData();
        setCurrentPage(1);
      } else {
        throw new Error('Помилка реєстрації');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showAlert('error', 'Не вдалося зареєструвати посилання');
    }
  };

  const deleteClick = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/click/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showAlert('success', 'Посилання успішно видалено!');
        setDeleteModal({ isOpen: false, clickData: null });
        loadData();
      } else {
        throw new Error('Помилка видалення');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showAlert('error', 'Не вдалося видалити запис');
    }
  };

  const openDeleteModal = (click) => {
    setDeleteModal({ isOpen: true, clickData: click });
  };

  const copyLink = (uuid_link) => {
    const link = `${API_BASE}/api/click/add/${uuid_link}`;
    navigator.clipboard.writeText(link);
    showAlert('success', 'Посилання скопійовано в буфер обміну!');
  };

  const handlePageChange = (page, newItemsPerPage = itemsPerPage) => {
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: document.getElementById('clicks-section')?.offsetTop - 20, behavior: 'smooth' });
  };

  const totalClicks = clicks.reduce((sum, click) => sum + click.total_clicks, 0);
  const uniqueIPs = clicks.length;
  const todayClicks = clicks.filter(click => {
    const clickDate = new Date(click.updated_at);
    const today = new Date();
    return clickDate.toDateString() === today.toDateString();
  }).reduce((sum, click) => sum + click.total_clicks, 0);

  const totalPages = Math.ceil(clicks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClicks = clicks.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Loading darkMode={darkMode} />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-6 transition-colors duration-300`}>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          darkMode={darkMode}
        />
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, clickData: null })}
        onConfirm={() => deleteClick(deleteModal.clickData.id)}
        clickData={deleteModal.clickData}
        darkMode={darkMode}
      />

      <div className="max-w-7xl mx-auto">
        {/* Перемикач теми */}
        <DarkModeSwitcher darkMode={darkMode} toggleDarkMode={setDarkMode} />

        {/* Заголовок */}
        <Heading darkMode={darkMode} content={'Відстежуйте IP-адреси та кліки користувачів'} />

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatisticTotal darkMode={darkMode} totalClicks={totalClicks} />

          <UniqueIP darkMode={darkMode} uniqueIPs={uniqueIPs} />

          <TodayClick darkMode={darkMode} todayClicks={todayClicks} />
        </div>

        {/* Кнопка для реєстрації нового кліку */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={registerClick}
            className="flex bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Dna className='me-1' />
            Згенеруйте посилання
          </button>
        </div>

        {/* Заголовок для карток */}
        <TitleCarts
          darkMode={darkMode}
          currentPage={currentPage}
          totalPages={totalPages}
          clicks={clicks}
        />

        {/* Картки кліків */}
        {clicks.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
            <Globe className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>Немає даних для відображення</p>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm mt-2`}>Згенеруйте нове посилання для початку відстеження</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentClicks.map((click) => (
                <div
                  key={click.id}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
                >
                  {/* Заголовок картки */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">ID: {click.id}</p>
                          {click.ip && <p className="text-blue-100 text-xs">{click.ip}</p>}
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <p className="text-white font-bold text-lg">Clicks - {click.total_clicks}</p>
                      </div>
                    </div>
                  </div>

                  {/* Тіло картки */}
                  {!click.ip?.length ? (
                    <div className="p-4">

                      {/* Дати */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Створено</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {new Date(click.created_at).toLocaleString('uk-UA', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Europe/Kyiv', // 👈 обов’язково!
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* UUID посилання */}
                      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 mb-4`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>UUID посилання</p>
                        <p className={`text-xs font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'} break-all`}>
                          {click.uuid_link}
                        </p>
                      </div>

                      {/* Кнопки дій */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyLink(click.uuid_link)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            } rounded-lg transition-colors text-sm font-medium`}
                        >
                          <ClipboardCopy className="w-4 h-4" />
                          Копіювати
                        </button>
                        <button
                          onClick={() => openDeleteModal(click)}
                          className={`px-4 py-2 ${darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-50 text-red-600 hover:bg-red-100'
                            } rounded-lg transition-colors`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      {/* Локація */}
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1">
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {click.city}, {click.region}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {click.country} {click.zip && `• ZIP: ${click.zip}`}
                          </p>
                          {(click.lat && click.lon) && (
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-mono`}>
                              {click.lat}, {click.lon}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Timezone */}
                      {click.timezone && (
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Часовий пояс</p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{click.timezone}</p>
                          </div>
                        </div>
                      )}

                      {/* Ip address */}
                      {click.ip && (
                        <div className="flex items-center gap-2 mb-3">
                          <MapPinHouse className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>IP Адреса</p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{click.ip}</p>
                          </div>
                        </div>
                      )}

                      {/* ISP/ORG */}
                      {(click.isp || click.org) && (
                        <div className="flex items-start gap-2 mb-3">
                          <Wifi className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1">
                            {click.isp && (
                              <>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ISP</p>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{click.isp}</p>
                              </>
                            )}
                            {click.org && (
                              <>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Організація</p>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{click.org}</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}


                      {/* Дати */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Створено</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {new Date(click.created_at).toLocaleString('uk-UA', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Europe/Kyiv', // 👈 обов’язково!
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Останній клік</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {new Date(click.created_at).toLocaleString('uk-UA', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Europe/Kyiv', // 👈 обов’язково!
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* UUID посилання */}
                      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 mb-4`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>UUID посилання</p>
                        <p className={`text-xs font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'} break-all`}>
                          {click.uuid_link}
                        </p>
                      </div>

                      {/* Кнопки дій */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyLink(click.uuid_link)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            } rounded-lg transition-colors text-sm font-medium`}
                        >
                          <ClipboardCopy className="w-4 h-4" />
                          Копіювати
                        </button>
                        <button
                          onClick={() => openDeleteModal(click)}
                          className={`px-4 py-2 ${darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-50 text-red-600 hover:bg-red-100'
                            } rounded-lg transition-colors`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Пагінація */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={clicks.length}
                darkMode={darkMode}
              />
            )}
          </>
        )}

        {/* Футер */}
        <div className={`mt-12 text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
          <p>© 2025 Click Tracker. Всі права захищені.</p>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}