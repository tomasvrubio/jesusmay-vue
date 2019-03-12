import Api from '@/services/Api'

export default {
  index (dateStart, dateEnd) {
    return Api().get(`works/${dateStart}/${dateEnd}`)
  },
  show (workId) {
    return Api().get(`works/${workId}`)
  },
  post (work) {
    return Api().post('works', work)
  },
  put (work) {
    return Api().put(`works/${work._id}`, work)
  }
}
