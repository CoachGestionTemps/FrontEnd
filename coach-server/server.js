var express = require('express')
var moment = require('moment')
var bodyParser = require('body-parser')
var _ = require('lodash')

var isLoging = process.argv.indexOf("debug") > -1

if (isLoging)
    console.log("Server started at %s", moment().format())

function log(req) {
    if (isLoging)
        console.log("%s %s at %s", req.method, req.path, moment().format())
}

var events = [
    {
        id: 0,
        start_datetime: moment().format(),
        end_datetime: null,
        category: 0,
        user_id: 1,
        title: "Fête de môman",
        passed_time: null,
        summary: "À chaque année, ma mère vieillit d'un année... Encore et encore!",
        location: "123 ave DesMères, Ville Père, Q1W 2E3, Qc, Ca",
        parent_id: 0
    },
    {
        id: 2,
        start_datetime: moment().date(moment().date() + 1).format(),
        end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 2).format(),
        category: 2,
        user_id: 1,
        title: "Étude pour ADM111",
        passed_time: null,
        summary: "Pu capable de ce cours-là...",
        location: "Chez nous...",
        parent_id: 2
    },
    {
        id: 3,
        start_datetime: moment().hour(moment().hour() + 2).format(),
        end_datetime: moment().hour(moment().hour() + 4).format(),
        category: 1,
        user_id: 1,
        title: "ADM111",
        passed_time: null,
        summary: "Principe d'administration",
        location: "K3-2021",
        parent_id: 3
    },
    {
        id: 4,
        start_datetime: moment().hour(moment().hour() + 4).format(),
        end_datetime: moment().hour(moment().hour() + 6).format(),
        category: 3,
        user_id: 1,
        title: "Volley!",
        passed_time: null,
        summary: null,
        location: "Centre Sportif",
        parent_id: 4
    },
    {
        id: 5,
        start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format(),
        end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format(),
        category: 5,
        user_id: 1,
        title: "Shift McDo",
        passed_time: null,
        summary: null,
        location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
        parent_id: 5
    },
    {
        id: 6,
        start_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 2).format(),
        end_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 4).format(),
        category: 1,
        user_id: 1,
        title: "ADM111",
        passed_time: null,
        summary: "Principe d'administration",
        location: "K3-2021",
        parent_id: 3
    },
    {
        id: 7,
        start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format(),
        end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format(),
        category: 5,
        user_id: 2,
        title: "Shift Subway",
        passed_time: null,
        summary: null,
        location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
        parent_id: 7
    },
]

function validateEvent(event) {
    if (!event.start_datetime || !event.id || !event.parent_id) {
        return false
    }
    return true
}

var app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/events/:user_id', function(req, res) {
    log(req)
    res.json(_.filter(events, ['user_id', parseInt(req.params.user_id)]))
})

app.get('/events/:user_id/:id', function(req, res) {
    log(req)
    if (event = _.find(events, {'user_id': parseInt(req.params.user_id), 'id': parseInt(req.params.id)})) {
        res.json(event)
    } else {
        res.sendStatus(404)
    }
})

app.get('*', function(req, res) {
    log(req)
    res.sendStatus(405)
})

app.post('/events', function(req, res) {
    log(req)
    if (validateEvent(req.body)) {
        req.body.start_datetime = moment(req.body.start_datetime).format()
        events.push(req.body)
        res.json({'message': "Event created!"})
    } else {
        res.sendStatus(500)
    }
})

app.post('*', function(req, res) {
    log(req)
    res.sendStatus(405)
})

app.put('/events/:id', function(req, res) {
    log(req)
    if ((index = _.findIndex(events, ['id', parseInt(req.params.id)])) > -1) {
        _.forEach(req.body, function(value, key) {
            events[index][key] = value
        })
        res.json({'message': "Event updated!"})
    } else {
        res.sendStatus(404)
    }
})

app.put('*', function(req, res) {
    log(req)
    res.sendStatus(405)
})

app.delete('*', function(req, res) {
    log(req)
    res.sendStatus(405)
})

app.listen(3000)