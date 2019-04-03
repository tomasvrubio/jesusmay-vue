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
      const search = req.params.search

      if (search !== "undefined") {
        await Calendar.aggregate([
          {$match: {"day": {$gte: dayStart, $lte: dayEnd}}},
          {$unwind: "$slots"},
          {$sort: {"slots.datePicked": 1}},
          {$group: {_id: null, slts: {$push : "$slots"}}},
          {$project: {_id: 0, slots: "$slts"}},
          {$unwind:"$slots"},
          {$replaceRoot: { newRoot: "$slots" }},
          {$match: {$or: [
            {"name": {$regex: search, $options: 'i'}}, 
            {"email": {$regex: search, $options: 'i'}}, 
            {"phone": {$regex: search}}
          ]}}
        ]).then (works => {
          res.send(works)
        })
      } else { 
        await Calendar.aggregate([
          {$match: {"day": {$gte: dayStart, $lte: dayEnd}}},
          {$unwind: "$slots"},
          {$sort: {"slots.datePicked": 1}},
          {$group: {_id: null, slts: {$push : "$slots"}}},
          {$project: {_id: 0, slots: "$slts"}},
          {$unwind:"$slots"},
          {$replaceRoot: { newRoot: "$slots" }}
        ]).then (works => {
          res.send(works)
        })
      }
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
      const hour = moment(new Date(req.body.datePicked)).format('HH:mm')

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
      // console.log(intendedSlot)
      // console.log(day)
      // console.log(hour)

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
      const day = req.params.day
      const workId = req.params.workId
      const work = req.body

      await Calendar.updateOne(
        {
          day,
          "slots._id" : workId
        },
        {
          "$set" :
          {
            "slots.$" : work
          }
        }
      ).then(workUpdated => {
        console.log(workUpdated)
        return res.send('OK')
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