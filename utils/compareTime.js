import moment from 'moment'
export function compareTime (dateString) {
  const date = moment(dateString)

  return date.fromNow()
}
