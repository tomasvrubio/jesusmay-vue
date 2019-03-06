import Api from '@/services/Api'

export default {
  index () {
    return Api().get('works')
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
