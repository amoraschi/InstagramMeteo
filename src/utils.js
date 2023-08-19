function firstCapital (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getUVIndex (index) {
  return index <= 2 ? 'Low' : ((index >= 3 && index <= 5) ? 'Moderate' : ((index >= 6 && index <= 7) ? 'High' : ((index >= 8 && index <= 10) ? 'Very High' : 'Extreme')))
}

function traduceLunarPhase (phase) {
  switch (phase) {
    case 'New Moon':
      return 'Luna Nueva'
    case 'Waxing Crescent':
      return 'Creciente'
    case 'First Quarter':
      return 'Cuarto Creciente'
    case 'Waxing Gibbous':
      return 'Gibosa Creciente'
    case 'Full Moon':
      return 'Luna Llena'
    case 'Waning Gibbous':
      return 'Gibosa Menguante'
    case 'Last Quarter':
      return 'Cuarto Menguante'
    case 'Waning Crescent':
      return 'Menguante'
  }
}

export {
  firstCapital,
  getUVIndex,
  traduceLunarPhase
}
