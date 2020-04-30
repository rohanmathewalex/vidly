const auth = require('../middleware/auth');
const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);
//End point which give list of rentals
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  
//Here checks customer id which client send us is valid id
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');
//Here checks the movie id which client send us is valid
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');
//Movies which we renting out is in stock
  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');
//Here we create new object with two properties customer and movie
  let rental = new Rental({ 
    customer: {
      _id: customer._id,//stores
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
//transaction method using Fawn
  try {
    new Fawn.Task()
      .save('rentals', rental)//save the new rental
      //update movie collection and pass update object as  a querey => numberInStock
      .update('movies', { _id: movie._id }, { 
        $inc: { numberInStock: -1 }
      })
      .run();
  
    res.send(rental);
  }
  catch(ex) {
    res.status(500).send('Something failed.');
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 