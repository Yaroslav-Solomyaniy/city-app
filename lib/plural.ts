/**
 * Ukrainian pluralization.
 *
 * Always pass the nominative singular form as `word`:
 *   plural(1, "ресурс")    → "1 ресурс"
 *   plural(3, "ресурс")    → "3 ресурси"
 *   plural(11, "ресурс")   → "11 ресурсів"
 *   plural(1, "категорія") → "1 категорія"
 *   plural(2, "категорія") → "2 категорії"
 *   plural(7, "категорія") → "7 категорій"
 *   plural(1, "запис")     → "1 запис"
 *   plural(4, "запис")     → "4 записи"
 *   plural(5, "запис")     → "5 записів"
 */

export function plural(count: number, word: string): string {
  return `${count} ${wordForm(count, word)}`
}

/** Returns only the inflected word without the number. */
export function wordForm(count: number, word: string): string {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 14) return getManyForm(word)
  if (mod10 === 1) return word
  if (mod10 >= 2 && mod10 <= 4) return getFewForm(word)
  return getManyForm(word)
}

// ─── 2–4: genitive singular ────────────────────────────────────

function getFewForm(word: string): string {
  // -ія → -ії  (категорія, підкатегорія, організація)
  if (word.endsWith("ія")) return word.slice(0, -2) + "ії"

  // -жа/-ша/-ча/-ща → -жі/-ші/-чі/-щі  (задача → задачі)
  if (/[жшчщ]а$/.test(word)) return word.slice(0, -1) + "і"

  // -га/-ка/-ха → -ги/-ки/-хи  (книга → книги, школа not here)
  if (/[гкх]а$/.test(word)) return word.slice(0, -1) + "и"

  // -я → -і  (стаття → статті)
  if (word.endsWith("я")) return word.slice(0, -1) + "і"

  // -а → -и  (школа → школи, програма → програми)
  if (word.endsWith("а")) return word.slice(0, -1) + "и"

  // -ь → -і  (мить → миті, путь → путі)
  if (word.endsWith("ь")) return word.slice(0, -1) + "і"

  // -й → -ї  (гай → гаї)
  if (word.endsWith("й")) return word.slice(0, -1) + "ї"

  // consonant (masculine): ресурс, тег, відгук, адміністратор, запис, файл
  return word + "и"
}

// ─── 5+: genitive plural ──────────────────────────────────────

function getManyForm(word: string): string {
  // -ія → -ій  (категорія → категорій)
  if (word.endsWith("ія")) return word.slice(0, -2) + "ій"

  // -жа/-ша/-ча/-ща → drop -а  (задача → задач)
  if (/[жшчщ]а$/.test(word)) return word.slice(0, -1)

  // -га/-ка/-ха → drop -а  (книга → книг, школа not here)
  if (/[гкх]а$/.test(word)) return word.slice(0, -1)

  // -зя/-ся/-ля etc → -ей  (стаття → статей) — for -я not covered above
  if (word.endsWith("я")) return word.slice(0, -1) + "ей"

  // -а → drop -а  (школа → шкіл is irregular; for regular: програма → програм)
  if (word.endsWith("а")) return word.slice(0, -1)

  // -ь → -ів  (мить → митів) or -ей — most common is -ів for neuter
  if (word.endsWith("ь")) return word.slice(0, -1) + "ів"

  // -й → -їв  (гай → гаїв)
  if (word.endsWith("й")) return word.slice(0, -1) + "їв"

  // consonant (masculine): ресурс → ресурсів, тег → тегів
  return word + "ів"
}
