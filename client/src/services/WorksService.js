import Api from '@/services/Api'

export default {
  index (dateStart, dateEnd) {
    return Api().get(`works/${dateStart}/${dateEnd}`)
  },
  show (day, workId) {
    return Api().get(`works/detail/${day}/${workId}`)
  },
  post (work) {
    return Api().post('works', work)
  },
  put (day, work) {
    return Api().put(`works/${day}/${work._id}`, work)
  },
  delete (day, workId) {
    return Api().delete(`works/${day}/${workId}`)
  }
}
