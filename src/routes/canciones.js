'use strict'

const Interprete = require('../model/Interprete');
const Disco = require('../model/Disco');
const Cancion = require('../model/Cancion')
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
		title: 'mi colección de música'
	})
})

router.get('/canciones/:pagina', async (req, res) => {
	let porPagina = 20,
			pagina = req.params.pagina || 1;

	await Cancion
	.find({})
	.skip((porPagina * pagina) - porPagina)
	.limit(porPagina)
	// .sort({del_disco: -1, num_cancion: 1})
	.exec((err, canciones) => {
		Disco.populate(canciones, {path: "del_disco"});
		Cancion.countDocuments((err, cuenta) => {
			if(err) throw err
			
			res.render('canciones', {
				canciones,
				title: 'índice de canciones',
				current: pagina,
				paginas: Math.ceil((cuenta / porPagina))
			})
		});
	})
});

router.get('/verCancion/:id', async (req, res) => {
	let id = req.params.id;

	await Cancion.findById(id, (err, cancion) => {
		Interprete.populate(cancion, {path: "del_interprete"});
		Disco.populate(cancion, {path: "del_disco"}, (err, cancion) => {
			if(err) throw err

			res.render('verCancion', {
				title: 'información de la canción',
				cancion
			});
		});
	})
})

router.get('/addCancion', (req, res) => {
	res.render('addCancion', {
		title: 'agregar canción nueva',
	})
})

router.post('/addCancion', async (req, res) => {
  const {tit_cancion, num_cancion, dur_cancion, del_disco} = req.body;

	const cancion = await Cancion.create({tit_cancion, num_cancion, dur_cancion, del_disco})

		res.redirect('/canciones/canciones')		
})

router.get('/editCancion/:id', async (req, res) => {
  await Cancion.findById(req.params.id, (err, cancion) => {
		if(err) throw err

		Disco.populate(cancion, {path:"del_disco"}, (err, cancion) => {
			if(err) throw err

			res.render('editCancion', { 
				title: 'Editar la canción',
				cancion 
			})
		})
	})
})

router.put('/editCancion/:id', async (req, res) => {
  let id = req.params.id;
  await Cancion.findByIdAndUpdate(id, req.body, (err, cancion) => {
		if(err) throw err
		
  	res.redirect('/canciones/canciones');
	});
});

router.delete('/deleteCancion/:id', async (req, res) => {
  const {id} = req.params
	await Cancion.findByIdAndDelete(id, (err, cancion) => {
  	if(err) throw err

		res.redirect('/canciones/a');
  });
})

module.exports = router;