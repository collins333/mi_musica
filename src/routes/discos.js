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
	let porPagina = 15,
			pagina = req.params.pagina || 1;

	await Disco
	.find({})
	.skip((porPagina * pagina) - porPagina)
	.limit(porPagina)
	.sort({_id: 1})
	.exec()
		.then(discos => {
			Cancion.populate(discos, {path: "canciones"});
			Interprete.populate(discos, {path: "interprete"});
			Disco.countDocuments()
				.then(cuenta => {
					res.render('discos', {
						discos,
						title: 'índice de discos',
						current: pagina,
						paginas: Math.ceil(cuenta / porPagina)
					})
				})
				.catch(err => {
					console.error('Error:', err)
				})
		})
		.catch(err => {
			console.error('Error:', err)
		})
});

router.get('/verDisco/:id', async (req, res) => {
	let id = req.params.id;
	
	await Disco.findById(id)
		.then(disco => {
			Cancion.populate(disco, {path: "canciones"});
			Interprete.populate(disco, {path: 'interprete'})
				.then(disco => {
					res.render('verDisco', {
						title: 'toda la información del disco',
						disco
					})
				})
				.catch(err => {
					console.error('Error:', err)
				})
		})
		.catch(err => {
			console.error('Error:', err)
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
	
	res.redirect('/discos/1')		
})

router.get('/editDisco/:id', async (req, res) => {
	
  await Disco.findById(req.params.id)
		.then(disco => {
			Cancion.populate(disco, {path: "canciones"});
			Interprete.populate(disco, {path: "interprete"})
				.then(disco => {
					res.render('editDisco', { 
						title: 'Editar el disco',
						disco 
					})
				})
				.catch(err => {
					console.error('Error: ', err)
				})
		})
		.catch(err => {
			console.error('Error: ', err)
		})
})

router.put('/editDisco/:id', async (req, res) => {
  let id = req.params.id;
	let agregarCancion = req.body.cancion
  
	await Disco.findByIdAndUpdate(id, req.body)
		.then(disco => {
			let arr = disco.canciones
			// para eliminar algún elemento del array canciones
					// arr.splice(0,0,'6249d21889fcd243ec19d0df','6249d24089fcd243ec19d0e4','6249d26c89fcd243ec19d0e9','6249d29d89fcd243ec19d0ee','6249d2bf89fcd243ec19d0f3','6249d2dd89fcd243ec19d0f8','6249d30689fcd243ec19d0fd','6249d33d89fcd243ec19d102','6249d35a89fcd243ec19d107','6249d37f89fcd243ec19d10c')
					// disco.save()
		
			if(agregarCancion !== ""){
				arr.push(agregarCancion)
				disco.save() 
			}
		
			res.redirect('/discos/1');
		})
		.catch(err => {
			console.error('Error:', err)
		})
});

router.delete('/deleteDisco/:id', async (req, res) => {
  const {id} = req.params

	await Disco.findByIdAndDelete(id)
		.then(disco => {
			res.redirect('/discos/1');
		})
		.catch(err => {
			console.error('Error:', err)
		})
});


module.exports = router;