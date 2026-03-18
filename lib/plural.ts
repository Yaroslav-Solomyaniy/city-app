export function plural(count: number, word: string) {
  const mod10 = count % 10
  const mod100 = count % 100

  let form = word

  if (mod100 >= 11 && mod100 <= 14) {
    form = getMany(word)
  } else if (mod10 === 1) {
    form = word
  } else if (mod10 >= 2 && mod10 <= 4) {
    form = getFew(word)
  } else {
    form = getMany(word)
  }

  return `${count} ${form}`
}

export function wordForm(count: number, word: string): string {
  return plural(count, word).split(" ")[1]
}

function getFew(word: string) {
  if (word.endsWith("ія")) return word.replace("ія", "ії")
  if (word.endsWith("га")) return word.replace("га", "ги")
  if (word.endsWith("с")) return word + "и"
  return word + "и"
}

function getMany(word: string) {
  if (word.endsWith("ія")) return word.replace("ія", "ій")
  if (word.endsWith("га")) return word.replace("га", "г")
  if (word.endsWith("с")) return word + "ів"
  return word + "ів"
}
