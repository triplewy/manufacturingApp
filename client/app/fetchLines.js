export function fetchLines() {
  return new Promise(function(resolve, reject) {
    fetch(global.API_URL + '/api/account/lines', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      var lines = []
      for (var i = 0; i < data.length; i++) {
        lines.push({name: 'LINE ' + data[i].name, lineId: data[i].lineId})
      }
      return resolve(lines)
    })
    .catch((error) => {
      return reject(error)
    })
  })
}
