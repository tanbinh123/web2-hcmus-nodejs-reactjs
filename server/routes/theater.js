const Theater = require('../models/theater')
const Router = require('express-promise-router')
let router = new Router();

/***************HOME API ******************/
router.get('/', async (req, res, next) => {
    return await Theater.findAll().then((result) => res.json(result));
});

router.get('/:id', async (req, res, next) => {
    return await Theater.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => res.json(result));
});

router.post('/', async (req, res, next) => {
    const created_at = new Date();
    const newTheater = req.body.theater;
    return await Theater.create({
        name: newTheater.name,
        cinema_id: newPost.cinema_id,
        type: newTheater.type,
        number_rows: newTheater.number_rows,
        number_columns: newTheater.number_columns,
        created_at: created_at
    })
        .then(post => {
                if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }
            res.json(post);
        });
});

router.put('/:id', async (req, res, next) => {
    const updated_at = new Date();
    const updateTheater = req.body.theater;

    return await Theater.update({
        name: updateTheater.name,
        cinema_id: updateTheater.cinema_id,
        type: updateTheater.type,
        number_rows: updateTheater.number_rows,
        number_columns: updateTheater.number_columns,
        updated_at: updated_at
    },
        {
            where: {
                id: req.params.id
            }
        }).then((result) => res.json(result));
});

router.delete('/:id', async (req, res, next) => {
    return await Theater.destroy({
        where: {
            id: req.params.id
        }
    }).then((result) => res.json(result));
});

module.exports = router