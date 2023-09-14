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

router.get('/discos/:pagina', async (req, res) => {
	let porPagina = 10,
			pagina = req.params.pagina || 1;

	await Disco
	.find({})
	.sort({interprete: 1, anyo: 1})
	.skip((porPagina * pagina) - porPagina)
	.limit(porPagina)
	.exec((err, discos) => {
		Cancion.populate(discos, {path: "canciones"});
		Interprete.populate(discos, {path: "interprete"});
		Disco.countDocuments((err, cuenta) => {
			if(err) throw err
			
			res.render('discos', {
				discos,
				title: 'índice de discos',
				current: pagina,
				paginas: Math.ceil((cuenta / porPagina))
			})
		});
	});
});

router.get('/verDisco/:id', async (req, res) => {
	let id = req.params.id;
	
	await Disco.findById(id, (err, disco) => {
		if(err) throw err

		Cancion.populate(disco, {path: "canciones"});
		Interprete.populate(disco, {path: "interprete"}, (err, disco) => {
			if (err) throw err
	
			res.render('verDisco', {
				title: 'toda la información del disco',
				disco
			})
		})
	})
})

router.get('/addDisco', (req, res) => {
	res.render('addDisco', {
		title: 'agregar disco nuevo',
	})
})

router.post('/addDisco', async (req, res) => {
  const {titulo, caratula, anyo, info, interprete, canciones} = req.body;
	
	const disco = await Disco.create({titulo, caratula, anyo, info, interprete, canciones})
	
	res.redirect('/discos/a')		
})

router.get('/editDisco/:id', async (req, res) => {
	
  await Disco.findById(req.params.id, (err, disco) => {
  	if(err) throw err

		Cancion.populate(disco, {path: "canciones"});
		Interprete.populate(disco, {path: "interprete"}, (err, disco) => {
			if (err) throw err
	
			res.render('editDisco', { 
				title: 'Editar el disco',
				disco 
			})
		})
	})
})

router.put('/editDisco/:id', async (req, res) => {
  let id = req.params.id;
	let agregarCancion = req.body.cancion
  
	await Disco.findByIdAndUpdate(id, req.body, (err, disco) => {
  	if(err) throw err
		
		let arr = disco.canciones
		// para eliminar algún elemento del array canciones
				// arr.splice(6,0,'63512871824d61359479c6d9')
				// disco.save()

		if(agregarCancion !== ""){
			arr.push(agregarCancion)
			disco.save() 
		}
	
  	res.redirect('/discos/a');
	});
});

router.delete('/deleteDisco/:id', async (req, res) => {
  const {id} = req.params
	await Disco.findByIdAndDelete(id, (err, disco) => {
  	if(err) throw err

		res.redirect('/discos/a');
  });
})


module.exports = router;