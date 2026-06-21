import { Search } from 'lucide-react';

export function SearchBox({ value, onChange, placeholder = 'Buscar' }) {
  return (
    <label className="search-box">
      <Search aria-hidden="true" size={18} strokeWidth={2} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
