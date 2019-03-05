import Api from '@/services/Api'

export default {
  index () {
    return Api().get('works')
  },
  post (work) {
    return Api().post('works', work)
  }
}
