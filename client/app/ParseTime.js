export function parseTime(timePeriod, time) {
  var options = {}
  switch (timePeriod) {
    case 0:
      options = {timeZone: 'UTC', hour: 'numeric', hour12: true}
      return currDate = new Date(time).toLocaleString('en-US', options)
    case 1:
      console.log(time);
      options = {timeZone: 'UTC', weekday: 'short', month: 'numeric', day: 'numeric'}
      return currDate = new Date(new Date(time) + 1000 * 60 * 60 * 5).toLocaleDateString('en-US', options)
    case 2:
      options = {timeZone: 'UTC', weekday: 'short', month: 'numeric', day: 'numeric'}
      return currDate = new Date(time).toLocaleDateString('en-US', options)
    case 3:
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return currDate = months[time - 1]
    case 4:
      return currDate = time
    default:
      options = {timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric'}
      return currDate = new Date(time).toLocaleDateString('en-US', options)
  }
}
