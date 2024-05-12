'use strict'

const Interprete = require('../model/Interprete');
const Disco = require('../model/Disco');
const Cancion = require('../model/Cancion');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
			title: 'mi colección de música'
		})
})

router.get('/cantantes/:pagina', async (req, res) => {
	let porPagina = 10,
			pagina = req.params.pagina || 1;
	
	await Interprete
		.find({})
		.sort({nombre: 1})
		.skip((porPagina * pagina) - porPagina)
		.limit(porPagina)
		.populate('discos')
		.populate('canciones')
		.exec()
			.then(interpretes => {
				// Disco.populate(interpretes, {path: 'discos'})
				// Cancion.populate(interpretes, {path: 'canciones'})
				Interprete.countDocuments()
					.then(cuenta =>{
						res.render('cantantes', {
							interpretes,
							title: 'Indice de cantantes',
							current: pagina,
							paginas: Math.ceil(cuenta/porPagina)
						})
					})
					.catch(err =>{
						console.error('Error:', err)
					})
			})
			.catch(err => {
				console.error('Error:', err)
			})
});

router.get('/verCantante/:id', async (req, res) => {
	let id = req.params.id;

	await Interprete
		.findById(id)
		.populate('canciones')
		.populate('discos')
		.exec()
			.then(interprete => {
				// Cancion.populate(interprete, {path: 'canciones'})
				// Disco.populate(interprete, {path: 'discos'})
					// .then(interprete => {
						res.render('verCantante', {
							title: 'toda la información del cantante',
							interprete
						})
					})
					.catch(err => {
						console.error('Error:', err)
					})
			// })
			.catch(err => {
				console.error('Error:', err)
			})
})

router.get('/addCantante', (req, res) => {
	res.render('addCantante', {
		title: 'añadir cantante'
	})
})

router.post('/addCantante', async (req, res) => {
	const {nombre, nacionalidad, info, caratula} = req.body;
	
	await Interprete.create({nombre, nacionalidad, info, caratula});

	res.redirect('/cantantes/1')
})

router.get('/editCantante/:id', async (req, res) => {

  await Interprete
	.findById(req.params.id)
	.populate('discos')
		.then(interprete => {
			// Disco.populate(interprete, {path: 'discos'})
			// .then(interprete => {
				res.render('editCantante', { 
					title: 'Editar el cantante',
					interprete 
				})
			})
			.catch(err => {
				console.error('Error:', err)
			// })
		})
		.catch(err => {
			console.error('Error:', err)
		})
})

router.put('/editCantante/:id', async (req, res) => {
  let id = req.params.id
	// agregarDisco = req.body.disco;
		
	await Interprete.findByIdAndUpdate(id, req.body)
		.then(interprete => {
			// let arr = interprete.discos;
			// para eliminar algún elemento del array discos
			// arr.splice(28,2)
			// interprete.save()
		
			// if(agregarDisco !== ""){
			// 	arr.push(agregarDisco)
			// 	interprete.save() 
			// }
			
			res.redirect('/cantantes/1');
		})
		.catch(err => {
			console.error('Error:', err)
		})
});

router.delete('/deleteCantante/:id', async (req, res) => {
  const {id} = req.params
	
	await Interprete.findByIdAndDelete(id)
		.then(cantante => {
			res.redirect('/cantantes/1');
		})
		.catch(err => {
			console.error('Error:', err)
		})
});

router.get('/buscando', async (req, res) => {
	if(req.query.buscar) {
		await Interprete
		.find({nombre: {$regex:'.*'+req.query.buscar+'.*', $options:'i'}})
		.exec()
			.then(interpretes => {
				if(interpretes.length == 0){
					res.render('noEncontrado', {title: 'Buscador de cantantes'})
				}else {
					res.render('buscar', {
						title: 'buscador de cantantes',
						interpretes})
				}
			})
			.catch(err => {
				console.error('Error:', err)
			})
	}else{
		res.render('noEncontrado', {title: 'Buscador de cantantes'})
	}
});


module.exports = router;