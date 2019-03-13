const {Work, Calendar} = require('../models/index.js'),
      moment = require('moment');
//TODO: Al final quitar tabla WORK


module.exports = {
  // LISTADO RESERVAS
  async index (req, res) {
    try {
      // Las fechas inicio/fin vienen en formato epoch [date.valueOf()]
      const dayStart = moment(Number(req.params.dateStart)).format('YYYYMMDD')
      const dayEnd = moment(Number(req.params.dateEnd)).format('YYYYMMDD')

      await Calendar.aggregate([
        {$match: {"day": {$gte: dayStart, $lt: dayEnd}}},
        {$unwind: "$slots"},
        {$sort: {"slots.datePicked": 1}},
        {$group: {_id: null, slts: {$push : "$slots"}}},
        {$project: {_id: 0, slots: "$slts"}}
      ]).then (works => {
        // console.log(JSON.stringify(works))
        res.send(works[0].slots)
      })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'Error ocurred searching works'
      })
    } 
  },
  // DETALLE RESERVA
  async show (req, res) {
    try {
      const day = req.params.day
      const workId = req.params.workId

      await Calendar.find({day, slots: {$elemMatch: {_id:workId}}}, 
        {_id:0, slots:{$elemMatch: {_id:workId}}})
        .then (work => {
          // console.log(JSON.stringify(work[0].slots[0]))
          res.send(work[0].slots[0])
        })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: `Error ocurred searching work with _id ${req.params.workId}`
      })
    } 
  },
  // CREAR RESERVA
  async post (req, res) {
    try { 
      const day = moment(new Date(req.body.datePicked)).format('YYYYMMDD')
      const hour = moment(new Date(req.body.datePicked)).format('HHmm')

      const intendedSlot = {
        hour,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        datePicked: req.body.datePicked,
        category: req.body.category || null,
        notes: req.body.notes || null,
        state: req.body.state || null,
      }
      console.log(intendedSlot)

      await Promise.all([
        Calendar.find({day}).countDocuments(),
        Calendar.find({day, slots: {$elemMatch: {hour}}}).countDocuments()
      ])
        .then(async ([dayGenerated, slotOcupied]) => {

          if (slotOcupied) {
            console.log('Slot ocupied. Use another hour.')
            return res.send('KO')
          }

          if (!dayGenerated) {
            console.log('Day dont exists. Need to create it.')
            await Calendar.create({day})
              .then( dayCreated => {
                console.log(dayCreated)
              })
          }

          await Calendar.findOneAndUpdate({ day }, 
            {
              $push: {
                slots: intendedSlot
              }
            }, {
              multi: true
            })

          return res.send('OK')
        })

    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'Error ocurred trying to create work registration'
      })
    } 
  },
  // MODIFICAR RESERVA
  async put (req, res) {
    try {
      // TODO: Aquí con Calendar lo que tengo que hacer es un pop de elemento que quiero modificar y un push donde lo quiero situar. Tendré que crear el día igual que con post en caso de que no exista.
      const day = req.params.day
      const workId = req.params.workId

      console.log(req.body)

      //Primero hago el push. Si ha ido bien hago el pull. Si ha ido mal devuelvo error

      


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
  },
  // ELIMINAR RESERVA
  async delete (req, res) {
    try {
      const day = req.params.day
      const workId = req.params.workId

      await Calendar.findOneAndUpdate({ day }, 
        {
          $pull: {
              slots: {
                  _id: workId
              }
          }
        })
      .then(deleted => {
        console.log(deleted)
        res.send(deleted)
      })

    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: `Error ocurred deleting work with _id ${req.params.workId}`
      })
    } 
  },
}