const Showtime = require('../models/showtime')
const Theater = require('../models/theater')
const Movie = require('../models/movie')
const Router = require('express-promise-router')
const bodyParser = require('body-parser')

let router = new Router();
var jsonParser = bodyParser.json()

/***************HOME API ******************/
router.get('/', async (req, res, next) => {
    const showtimes = await Showtime.findAll(
        {
            order: [
                ['id', 'ASC'],
            ],
        }
    );
    var status = 200;
    var message = '';

    if (!showtimes || showtimes.length <= 0) {
        status = 404;
        message = 'Not found';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            showtimes: showtimes
        }
    });
});

router.get('/:id', async (req, res, next) => {
    const showtimes = await Showtime.findOne({
        where: {
            id: req.params.id
        }
    });

    var status = 200;
    var message = '';

    if (!showtimes || showtimes.length <= 0) {
        status = 404;
        message = 'Not found';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            showtimes: showtimes
        }
    });

});

router.get('/:movie_id/:cinema_id', async (req, res, next) => {
    const theater = await Theater.findAll({
        where: {
            cinema_id: req.params.cinema_id
        },
        include: [{
            model: Movie,
            as: 'movies',
            required: false,
            attributes: ['id', 'name', 'image', 'trailer', 'introduce', 'opening_day', 'view'],
            where: {
                id: req.params.movie_id,
            },
            through: {
                attributes: ['start_time', 'end_time', 'price'],
            }
        }]
    });

    var status = 200;
    var message = '';

    if (!theater) {
        status = 404;
        message = 'Not found';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            theater: theater
        }
    });
});

router.get('/theater/:theater_id', async (req, res, next) => {
    const theater = await Theater.findAll({
        where: {
            id: req.params.theater_id
        },
        include: [{
            model: Movie,
            as: 'movies',
            required: false,
            attributes: ['id', 'name', 'image', 'trailer', 'introduce', 'opening_day', 'view'],
            through: {
                attributes: ['start_time', 'end_time', 'price'],
            }
        }]
    });

    var status = 200;
    var message = '';

    if (!theater) {
        status = 404;
        message = 'Not found';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            theater: theater
        }
    });
});

router.post('/', jsonParser, async (req, res, next) => {
    const created_at = new Date();
    const newShowtime = req.body.showtime;
   
    const theaters = await Theater.findOne({
        where: {
            id: newShowtime.theater_id
        }
    });

    if (!theaters || theaters.length <= 0) {
        return res.json({
            status: 404,
            message: "Not found theater",
        });
    }

    const movies = await Movie.findOne({
        where: {
            id: newShowtime.movie_id
        }
    });

    if (!movies || movies.length <= 0) {
        return res.json({
            status: 404,
            message: "Not found movie",
        });
    }

    const theater = await Showtime.create({
        id: 1,
        movie_id: newShowtime.movie_id,
        theater_id: newShowtime.theater_id,
        start_time: newShowtime.start_time,
        end_time: newShowtime.end_time,
        price: newShowtime.price,
        created_at: created_at
    });

    var status = 200;
    var message = '';

    if (!theater) {
        status = 503;
        message = 'Create showtime failed';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            theater: theater
        }
    });
});

// {
// 	"showtime": {
// 		"cinema_id": 7,
// 		"theater_id": 7,
// 		"image": "",
// 		"trailer": "",
// 		"introduce": "",
// 		"opening_day": "2018-11-07 15:03:16.532+00",
// 		"minute_time": 90,
// 		"view": 0
// 	}
// }

router.put('/', jsonParser, async (req, res, next) => {
    const updated_at = new Date();
    const updateShowtime = req.body.showtime;

    const showtimes = await Showtime.findOne({
        where: {
            id: updateShowtime.id
        }
    });

    var status = 200;
    var message = '';

    if (!showtimes || showtimes.length <= 0) {
        status = 404;
        message = 'Not found';
    } else {
        const numAffectedRows = await Showtime.update({
            start_time: updateShowtime.start_time,
            end_time: updateShowtime.end_time,
            price: updateShowtime.price,
            updated_at: updated_at
        },
            {
                where: {
                    id: updateShowtime.id,
                    movie_id: updateShowtime.movie_id,
                    theater_id: updateShowtime.theater_id,
                }
            });
        var status = 200;
        var message = '';
    
        if (numAffectedRows <= 0) {
            status = 503;
            message = 'Update showtime failed';
        }
    }

    return res.json({
        status: status,
        message: message,
    });
});

router.delete('/:id', async (req, res, next) => {
    const numAffectedRows = await Showtime.destroy({
        where: {
            id: req.params.id
        }
    });
    
    var status = 200;
    var message = '';

    if (numAffectedRows <= 0) {
        status = 503;
        message = 'Delete showtime failed';
    }

    return res.json({
        status: status,
        message: message,
    });
});

module.exports = router