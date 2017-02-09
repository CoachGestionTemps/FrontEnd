var express = require('express')
var moment = require('moment')
var _und = require('underscore')

var isLoging = process.argv.indexOf("debug") > -1

if (isLoging)
    console.log("Server started at %s", moment().format("LLL"))

function log(req) {
    if (isLoging)
        console.log("%s %s at %s", req.method, req.path, moment().format('LLL'))
}

var events = [
    {
        id: 0,
        start_datetime: moment().format("LLL"),
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
        start_datetime: moment().date(moment().date() + 1).format("LLL"),
        end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 2).format("LLL"),
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
        start_datetime: moment().hour(moment().hour() + 2).format("LLL"),
        end_datetime: moment().hour(moment().hour() + 4).format("LLL"),
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
        start_datetime: moment().hour(moment().hour() + 4).format("LLL"),
        end_datetime: moment().hour(moment().hour() + 6).format("LLL"),
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
        start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format("LLL"),
        end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format("LLL"),
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
        start_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 2).format("LLL"),
        end_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 4).format("LLL"),
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
        start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format("LLL"),
        end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format("LLL"),
        category: 5,
        user_id: 2,
        title: "Shift Subway",
        passed_time: null,
        summary: null,
        location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
        parent_id: 7
    },
]

var app = express()

app.get('/events/:user_id', function(req, res) {
    log(req)
    res.json(_und.where(events, {user_id: parseInt(req.params.user_id)}))
})

app.get('/events/:user_id/:id', function(req, res) {
    log(req)
    if (event = _und.findWhere(events, {user_id: parseInt(req.params.user_id), id: parseInt(req.params.id)})) {
        res.json(event)
    } else {
        res.sendStatus(400)
    }
})

app.get('*', function(req, res) {
    log(req)
    res.sendStatus(404)
})

app.post('*', function(req, res) {
    log(req)
    res.sendStatus(404)
})

app.put('*', function(req, res) {
    log(req)
    res.sendStatus(404)
})

app.delete('*', function(req, res) {
    log(req)
    res.sendStatus(404)
})

app.listen(3000)