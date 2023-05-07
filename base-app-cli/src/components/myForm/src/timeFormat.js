export function timeFormatter(time, format = 'yyyy-MM-dd hh:mm:ss') {
  const date = new Date(time)
  const year = '0' + date.getFullYear()
  const month = '0' + (date.getMonth() + 1)
  const day = '0' + date.getDate()
  const hour = '0' + date.getHours()
  const minute = '0' + date.getMinutes()
  const second = '0' + date.getSeconds()
  if (format.includes('y')) {
    format = format.replace(/y+/, year.slice(-format.match(/y+/)[0].length))
  }
  if (format.includes('M')) {
    format = format.replace(/M+/, month.slice(-format.match(/M+/)[0].length))
  }
  if (format.includes('d')) {
    format = format.replace(/d+/, day.slice(-format.match(/d+/)[0].length))
  }
  if (format.includes('h')) {
    format = format.replace(/h+/, hour.slice(-format.match(/h+/)[0].length))
  }
  if (format.includes('m')) {
    format = format.replace(/m+/, minute.slice(-format.match(/m+/)[0].length))
  }
  if (format.includes('s')) {
    format = format.replace(/s+/, second.slice(-format.match(/s+/)[0].length))
  }
  return format
}
