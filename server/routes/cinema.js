const Cinema = require('../models/cinema')
const Router = require('express-promise-router')
let router = new Router();

/***************HOME API ******************/
router.get('/', async (req, res, next) => {
    const cinemas = await Cinema.findAll();
    var status = 200;
    var message = '';

    if (!cinemas) {
        status = 404;
        message = 'Not found';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            cinemas: cinemas
        }
    });
});

router.get('/:id', async (req, res, next) => {
    const cinemas = await Cinema.findAll({
        where: {
            id: req.params.id
        }
    });

    var status = 200;
    var message = '';

    if (!cinemas) {
        status = 404;
        message = 'Not found';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            cinemas: cinemas
        }
    });
});

router.post('/', async (req, res, next) => {
    const created_at = new Date();
    const newCinema = req.body.cinema;
    const cinema = await Cinema.create({
        name: newCinema.name,
        image: newPost.image,
        trailer: newCinema.trailer,
        introduce: newCinema.introduce,
        opening_day: newCinema.opening_day,
        minute_time: newCinema.minute_time,
        view: newCinema.view,
        created_at: created_at
    });

    var status = 200;
    var message = '';

    if (!cinema) {
        status = 503;
        message = 'Service Unavailable';
    }

    return res.json({
        status: status,
        message: message,
        payload: {
            cinema: cinema
        }
    });
});

router.put('/:id', async (req, res, next) => {
    const updated_at = new Date();
    const updateCinema = req.body.cinema;
    const numAffectedRows = await Cinema.update({
        name: updateCinema.name,
        image: updateCinema.image,
        trailer: updateCinema.trailer,
        introduce: updateCinema.introduce,
        opening_day: updateCinema.opening_day,
        minute_time: updateCinema.minute_time,
        view: updateCinema.view,
        updated_at: updated_at
    },
        {
            where: {
                id: req.params.id
            }
        });

    var status = 204;
    var message = '';

    if (numAffectedRows <= 0) {
        status = 503;
        message = 'Service Unavailable';
    }

    return res.json({
        status: status,
        message: message,
    });
});

router.delete('/:id', async (req, res, next) => {
    const numAffectedRows = await Cinema.destroy({
        where: {
            id: req.params.id
        }
    });

    var status = 204;
    var message = '';

    if (numAffectedRows <= 0) {
        status = 503;
        message = 'Service Unavailable';
    }

    return res.json({
        status: status,
        message: message,
    });
});

module.exports = router