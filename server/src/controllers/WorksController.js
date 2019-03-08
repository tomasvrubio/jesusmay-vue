const {Work, Calendar} = require('../models/index.js'),
      moment = require('moment');

module.exports = {
  async index (req, res) {
    try {
      await Work.find({})
      .then (works => {
        // console.log(works)
        res.send(JSON.stringify(works))
      })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'Error ocurred searching works'
      })
    } 
  },
  async show (req, res) {
    try {
      console.log(req.body)
      await Work.findById(req.params.workId).select('-__v')
      .then (work => {
        console.log(work)
        res.send(JSON.stringify(work))
      })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: `Error ocurred searching work with _id ${req.workId}`
      })
    } 
  },
  async post (req, res) {
    try {
      // TODO: Meter a Calendar por en medio
      // La lógica debería ser:
      // 1-buscar que no existe creado ese slot/dia
      //   1.1-Si existe terminar indicar que no se puede hacer la reserva
      //   1.2-En caso de no existir el dia pero no estar usado el slot, ¿generarlo? Y continuar
      // 2-Grabar el work, recuperar el ID
      // 3-Grabar el evento en Calendar utilizando el ID recuperado. Tendre que hacer un push al array.

      console.log(req.body)
      console.log(moment(req.body.datePicked).format('YYYYMMDD'))
      console.log(moment(req.body.datePicked).format('HHmm'))
      const day = moment(req.body.datePicked).format('YYYYMMDD')
      const hour = moment(req.body.datePicked).format('HHmm')
      const calendarWork = {
        day: day,
        slots: {
          hour: hour,
          workId: "xxxx"
        }
      }

      await Calendar.create(calendarWork)

      await Work.create(req.body)
      .then (work => {
        console.log(work)
        res.send(JSON.stringify(work))
      })

    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'Error ocurred trying to create work registration'
      })
    } 
  },
  async put (req, res) {
    try {
      // TODO: Meter a Calendar por en medio

      await Work.updateOne({_id:req.params.workId}, req.body)
      .then (work => {
        console.log(work)
        res.send(req.body)
      })

    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'Error ocurred trying to update work'
      })
    } 
  }
}