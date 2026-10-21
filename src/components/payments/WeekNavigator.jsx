import { useState } from 'react';
import { Link } from 'react-router';
import { formatShortRange } from '../../utils/format.js';
import { MAX_YEAR, MIN_YEAR, getIsoWeekRange, shiftIsoWeek, weeksInIsoYear } from '../../utils/isoWeek.js';
import './WeekNavigator.css';

function WeekNavigator({ selected, onSelect }) {
  const [yearText, setYearText] = useState(String(selected.year));
  const [weekText, setWeekText] = useState(String(selected.week));

  const year = Number(yearText);
  const validYear = Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
  const weekCount = validYear ? weeksInIsoYear(year) : 52;
  const week = Math.min(Number(weekText) || 1, weekCount);
  const previous = shiftIsoWeek(selected, -1);
  const next = shiftIsoWeek(selected, 1);

  function handleSubmit(event) {
    event.preventDefault();
    if (validYear) onSelect({ year, week });
  }

  return (
    <div className="week-navigator">
      <div className="week-navigator__steps">
        <Link to={`?year=${previous.year}&week=${previous.week}`} className="button button--secondary">
          Semana anterior
        </Link>
        <Link to={`?year=${next.year}&week=${next.week}`} className="button button--secondary">
          Semana siguiente
        </Link>
      </div>

      <form className="week-navigator__jump" onSubmit={handleSubmit}>
        <label className="field week-navigator__year">
          <span className="field__label">Año</span>
          <input
            type="number"
            className="input"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={yearText}
            aria-invalid={!validYear}
            onChange={(event) => setYearText(event.target.value)}
          />
        </label>
        <label className="field week-navigator__week">
          <span className="field__label">Semana ISO</span>
          <select
            className="input"
            value={week}
            disabled={!validYear}
            onChange={(event) => setWeekText(event.target.value)}
          >
            {Array.from({ length: weekCount }, (_, index) => index + 1).map((option) => {
              const range = validYear ? getIsoWeekRange(year, option) : null;
              return (
                <option key={option} value={option}>
                  Semana {option}
                  {range ? ` (${formatShortRange(range.startDate, range.endDate)})` : ''}
                </option>
              );
            })}
          </select>
        </label>
        <button type="submit" className="button button--primary" disabled={!validYear}>
          Ver semana
        </button>
      </form>
    </div>
  );
}

export default WeekNavigator;
