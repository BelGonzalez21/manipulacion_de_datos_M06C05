const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order: [        //orden de los selectores
                ['name', 'ASC']
            ]}

        )
        .then(genres => {  //para el selector
            return res.render('moviesAdd', {
                genres
            })
        })
        .catch(error => console.log(error))

    },
        
    create: function (req, res) { 
        const {title, rating, awards, release_date, length, genre_id} = req.body  //tomo todo lo que viene del formulario
        db.Movie.create({
            title : title.trim(),
            awards : +awards,
            release_date,
            rating : +rating,
            length : +length,
            genre_id : +genre_id
        })
            .then(movie => {
                console.log(movie);
                res.redirect('/movies') //al craearse me redirige a movies   -- ('/movies/detail/' + movie.id) para que me lleve directo al detalle
            })
            .catch(error => console.log(error))
    },
    edit: function(req, res) {
        let movie = db.Movie.findByPk(req.params.id)
        let genres = db.Genre.findAll({
            order : ['name']
        })
        Promise.all([movie, genres]) //cuando uso variables, utilizo promesas
        .then(([movie, genres]) => {  
            return res.render('moviesEdit', {
                Movie : movie, //uso Movie con mayúsculas porque en el view está así
                genres,
                release_date : moment(movie.release_date).format('YYYY-MM-DD'),
            })
        })
    },
    update: function (req,res) {
        const {title, rating, awards, release_date, length, genre_id} = req.body
        db.Movie.update(
            {
            title : title.trim(),
            rating : +rating,
            awards : +awards,
            release_date : release_date,
            length : +length,
            genre_id : +genre_id
            },
            {
                where : {
                    id : req.params.id
                }
            }   
        )
            .then((status) =>  res.redirect('/movies'))
            .catch(error => console.log(error)) 
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
        .then(movie => {
            return res.render('moviesDelete', {
                movie
            })
        })
        .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Movie.destroy(
            {
                where: {
                    id : req.params.id
                }
            }
        )
            .then(movie => {
                return res.redirect('/movies')
            })
            .catch(error => console.log(error))
    }

}

module.exports = moviesController;