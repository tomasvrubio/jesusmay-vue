const {Work, Calendar} = require('../models/index.js'),
      moment = require('moment');
//TODO: Al final quitar tabla WORK


module.exports = {
  async index (req, res) {
    try {
      //TODO: Pasar a buscar en Calendar. ¿Cuantos registros quiero que busque?

      //TODO: Quitar
      // await Work.find({})
      // .then (works => {
      //   // console.log(works)
      //   res.send(JSON.stringify(works))
      // })

      //TODO: Me tienen que llamar con dos fechas, la de inicio de búsqueda y la de final. 
      // Las fechas vienen en formato epoch
      const dayStart = moment(Number(req.params.dateStart)).format('YYYYMMDD')
      const dayEnd = moment(Number(req.params.dateEnd)).format('YYYYMMDD')
      // console.log(dayStart)
      // console.log(dayEnd)
      // const dayStart = "20190324"
      // const dayEnd = "20190325"

      //TODO: Ya está replicado igual que works. Sólo me faltaría poder hacer un filtrado para no sacar todo lo que hay en la BBDD. ¿Cómo?
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
  async show (req, res) {
    try {
      //TODO: Pasar a utilizar Calendar para extraer estos trabajos. Tendré que descomponer la fecha o bien buscar el objectId entre los objetos SLOT. Debería poder buscar por las dos opciones. ¿Realmente necesito buscar por fecha?

      // db.getCollection('calendars')
        // .find({day:'20190324'},
        // {_id:0, slots: {$elemMatch: {hour:'2000'}}})

      //Con objectId y calendar //TODO: Descomentar
      await Calendar.find({slots: {$elemMatch: {_id:req.params.workId}}}, 
        {_id:0, slots:{$elemMatch: {_id:req.params.workId}}})
        .then (work => {
          // console.log(JSON.stringify(work[0].slots[0]))
          res.send(work[0].slots[0])
        })


      //TODO: Quitar cuando todo esté pasado a Calendar
      // await Work.findById(req.params.workId).select('-__v')
      //   .then (work => {
      //     console.log(work)
      //     res.send(JSON.stringify(work))
      //   })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: `Error ocurred searching work with _id ${req.params.workId}`
      })
    } 
  },
  async post (req, res) {
    try {

      //Para encontrar si hay una reserva hecha a esa hora. Si me devuelve algo es que existe una reserva.
      //¿Devuelve lo mismo si no hay documento que si no hay hora?
      // db.calendars
      // .find({day:"20190503", slots: {$elemMatch: {hour: "1430"}}})

            // await Calendar.find({day:day, slots: {$elemMatch: {hour: hour}}})
      //   .then ( work => {
      //     console.log(work)
      //     res.send(JSON.stringify(work))
      //   })

      //Para guardar un registro (pero en robomongo me genera infinitos registros repetidos, tengo que ver si me lo hace en mongoose con el unique que he puesto a "hour")
      // db.calendars
      //   .findOneAndUpdate({day:"20190503"}, 
      //   {$push: {
      //       slots: {"hour":"1400", "name":"Pedro"}
      //   }}) 

      //Quitar una reserva
      // db.calendars
      //   .findOneAndUpdate({day:"20190503"}, 
      //   {$pull: {
      //       slots: {"hour":"1400"}
      //   }})
 
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
  async put (req, res) {
    try {
      // TODO: Aquí con Calendar lo que tengo que hacer es un pop de elemento que quiero modificar y un push donde lo quiero situar. Tendré que crear el día igual que con post en caso de que no exista.

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
  async delete (req, res) {
    try {
      // TODO: Aquí con Calendar lo que tengo que hacer es un pop de elemento que quiero modificar y un push donde lo quiero situar. Tendré que crear el día igual que con post en caso de que no exista.

      // UTiliza lo mismo que put: El workId y el body con la info de lo que quieres borrar. ¿Eso último lo necesito? Lo tengo para poder filtrar por la fecha

      const day = moment(new Date(req.body.datePicked)).format('YYYYMMDD')

      await Calendar.findOneAndUpdate({day}, 
        {
            $pull: {
                slots: {
                    _id: req.params.workId
                }
            }
        })

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
}