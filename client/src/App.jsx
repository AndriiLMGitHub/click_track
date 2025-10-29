import React, { useState, useEffect } from 'react';
import { Trash2, Trash, X, Dna, TrendingUp, MousePointer, Globe, Check, AlertCircle, MapPin, Calendar, ExternalLink, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';

// Компонент для показу сповіщень
const Alert = ({ type, message, onClose, darkMode }) => {
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

// Модальне вікно для підтвердження видалення
const DeleteModal = ({ isOpen, onClose, onConfirm, clickData, darkMode }) => {
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
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент пагінації
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, darkMode }) => {
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
    const clickDate = new Date(click.last_click);
    const today = new Date();
    return clickDate.toDateString() === today.toDateString();
  }).reduce((sum, click) => sum + click.total_clicks, 0);

  const totalPages = Math.ceil(clicks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClicks = clicks.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Завантаження...</p>
        </div>
      </div>
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
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-lg ${darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
              : 'bg-white hover:bg-gray-50 text-gray-700'
              } shadow-lg transition-all duration-300`}
            aria-label="Перемкнути тему"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
            Click Tracker
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Відстежуйте IP-адреси та кліки користувачів</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Кнопка для реєстрації нового кліку */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={registerClick}
            className="flex bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Dna className='me-1' />
            Згенеруйт посилання
          </button>
        </div>

        {/* Заголовок для карток */}
        <div id="clicks-section" className="mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Історія кліків</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Сторінка {currentPage} з {totalPages} • Всього записів: {clicks.length}
          </p>
        </div>

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
                          <p className="text-blue-100 text-xs">{click.ip}</p>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <p className="text-white font-bold text-lg">{click.total_clicks}</p>
                      </div>
                    </div>
                  </div>

                  {/* Тіло картки */}
                  <div className="p-4">
                    {/* Локація */}
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {click.city}, {click.region}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {click.country} {click.zip && `• ZIP: ${click.zip}`}
                        </p>
                        {(click.lat && click.lon) && (
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-mono`}>
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
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Часовий пояс</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{click.timezone}</p>
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
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ISP</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{click.isp}</p>
                            </>
                          )}
                          {click.org && (
                            <>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Організація</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{click.org}</p>
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
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Останній клік</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {new Date(click.updated_at).toLocaleString('uk-UA', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
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
                        <ExternalLink className="w-4 h-4" />
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