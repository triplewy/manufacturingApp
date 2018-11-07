export function downtimeString(downtime) {
  const hours = Math.floor(downtime / 60)
  const minutes = downtime % 60
  var downtimeString = ''
  if (hours !== 0) {
    var hoursLabel = ' Hour '
    if (hours > 1) {
      hoursLabel = ' Hours '
    }
    downtimeString += hours + hoursLabel
  }
  downtimeString += minutes + ' Min'
  return downtimeString
}
