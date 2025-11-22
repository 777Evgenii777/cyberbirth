import React, { useState, useEffect } from 'react';
import { Trash2, Cake, CalendarClock, Sparkles } from 'lucide-react';
import AddBirthdayForm from './components/AddBirthdayForm';
import GeminiModal from './components/GeminiModal';
import { Birthday } from './types';

const App: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cyberbirth_data');
    if (saved) {
      try {
        setBirthdays(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse birthdays", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('cyberbirth_data', JSON.stringify(birthdays));
  }, [birthdays]);

  const addBirthday = (birthday: Birthday) => {
    setBirthdays(prev => [...prev, birthday]);
  };

  const deleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  // Helper to calculate days remaining and age
  const getBirthdayInfo = (dateStr: string) => {
    const today = new Date();
    const birthDate = new Date(dateStr);
    const currentYear = today.getFullYear();
    
    let nextBirthday = new Date(dateStr);
    nextBirthday.setFullYear(currentYear);

    if (nextBirthday.getTime() < today.getTime() && nextBirthday.getDate() !== today.getDate()) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    // Set times to midnight for accurate day calculation
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const nextBirthdayMidnight = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate());

    const diffTime = Math.abs(nextBirthdayMidnight.getTime() - todayMidnight.getTime());
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Age they will turn
    const age = nextBirthday.getFullYear() - birthDate.getFullYear();

    return { daysRemaining, age, nextDate: nextBirthday };
  };

  const sortedBirthdays = [...birthdays].sort((a, b) => {
    const infoA = getBirthdayInfo(a.date);
    const infoB = getBirthdayInfo(b.date);
    return infoA.daysRemaining - infoB.daysRemaining;
  });

  const handleAiClick = (birthday: Birthday) => {
    setSelectedBirthday(birthday);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#030014] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#030014] to-[#030014] text-slate-200 p-4 md:p-8">
      
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          <h1 className="font-cyber text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 tracking-widest mb-2">
            CYBER<span className="text-white">BIRTH</span>
          </h1>
          <p className="text-slate-400 font-light tracking-widest uppercase text-sm">
            Система мониторинга временных циклов
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Add Form */}
          <div className="lg:col-span-1">
            <AddBirthdayForm onAdd={addBirthday} />
            
            <div className="mt-8 p-6 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
              <h3 className="text-slate-400 uppercase tracking-wider text-xs font-bold mb-4">Статистика базы данных</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500">Всего записей</span>
                <span className="text-cyan-400 font-mono text-xl">{birthdays.length}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2 space-y-6">
            {sortedBirthdays.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-700 rounded-2xl bg-slate-900/20 text-slate-500">
                <CalendarClock className="w-12 h-12 mb-4 opacity-50" />
                <p>База данных пуста. Инициализируйте новую запись.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {sortedBirthdays.map((birthday) => {
                  const { daysRemaining, age, nextDate } = getBirthdayInfo(birthday.date);
                  const isToday = daysRemaining === 0;
                  const isSoon = daysRemaining > 0 && daysRemaining <= 7;

                  return (
                    <div 
                      key={birthday.id} 
                      className={`group relative bg-[#0b0c15] border ${isToday ? 'border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)]' : 'border-slate-800 hover:border-cyan-500/50'} rounded-xl p-5 transition-all duration-300 hover:-translate-y-1`}
                    >
                      {/* Glow effect for upcoming */}
                      {isSoon && <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 blur-2xl rounded-full -z-10"></div>}

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                            {birthday.name}
                            {isToday && <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
                            </span>}
                          </h3>
                          <p className="text-slate-500 text-xs uppercase tracking-wider mt-1">{birthday.relationship}</p>
                        </div>
                        <div className={`text-right ${isToday ? 'text-fuchsia-400' : 'text-cyan-400'}`}>
                          <div className="font-mono text-2xl font-bold leading-none">
                            {isToday ? 'СЕГОДНЯ' : daysRemaining}
                          </div>
                          {!isToday && <div className="text-[10px] text-slate-500 uppercase">дней осталось</div>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-600 uppercase">Дата</span>
                            <span className="font-mono text-slate-300">{nextDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                          </div>
                          <div className="w-px h-6 bg-slate-800"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-600 uppercase">Исполняется</span>
                            <span className="font-mono text-slate-300">{age}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAiClick(birthday)}
                            className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all border border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            title="Сгенерировать поздравление"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteBirthday(birthday.id)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all hover:border hover:border-red-500/30"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBirthday && selectedBirthday.date && (
        <GeminiModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          birthday={selectedBirthday}
          age={getBirthdayInfo(selectedBirthday.date).age}
        />
      )}
    </div>
  );
};

export default App;