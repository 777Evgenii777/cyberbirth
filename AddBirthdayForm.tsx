import React, { useState } from 'react';
import { Plus, Calendar, User, Heart } from 'lucide-react';
import NeonButton from './NeonButton';
import { Birthday } from '../types';

interface AddBirthdayFormProps {
  onAdd: (birthday: Birthday) => void;
}

const AddBirthdayForm: React.FC<AddBirthdayFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [relationship, setRelationship] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    const newBirthday: Birthday = {
      id: crypto.randomUUID(),
      name,
      date,
      relationship: relationship || 'Friend',
    };

    onAdd(newBirthday);
    setName('');
    setDate('');
    setRelationship('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-50"></div>
      
      <h2 className="text-2xl font-cyber text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 uppercase tracking-widest">
        Добавить запись
      </h2>

      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 text-cyan-100 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-500"
            required
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 text-cyan-100 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-500 [color-scheme:dark]"
            required
          />
        </div>

        <div className="relative">
          <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Кем приходится (напр. Друг, Брат)"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 text-cyan-100 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-500"
          />
        </div>

        <NeonButton type="submit" variant="primary" icon={<Plus className="w-5 h-5" />} className="w-full mt-4">
          Зафиксировать
        </NeonButton>
      </div>
    </form>
  );
};

export default AddBirthdayForm;