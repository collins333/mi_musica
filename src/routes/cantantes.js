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
	.skip((porPagina * pagina) - porPagina)
	.limit(porPagina)
	.sort({nombre: 1})
	.exec((err, interpretes) => {
		Disco.populate(interpretes, {path: "discos"});
		Interprete.countDocuments((err, cuenta) => {
			if(err) throw err
			
			res.render('cantantes', {
				interpretes,
				title: 'índice de cantantes',
				current: pagina,
				paginas: Math.ceil((cuenta / porPagina))
			})
		});
	});
});

router.get('/verCantante/:id', async (req, res) => {
	let id = req.params.id;

	await Interprete.findById(id, (err, interprete) => {
		if (err) throw err

		Cancion.populate(interprete, {path: "canciones"});
		Disco.populate(interprete, {path: "discos"}, (err, interprete) => {
			if (err) throw err

			res.render('verCantante', {
				title: 'toda la información del cantante',
				interprete
			})
		})
	})
})

router.get('/addCantante', (req, res) => {
	res.render('addCantante', {
		title: 'añadir cantante'
	})
})

router.post('/addCantante', async (req, res) => {
	const {nombre, nacionalidad, info, caratula, discos} = req.body;
	
	await Interprete.create({nombre, nacionalidad, info, caratula, discos});

	res.redirect('/cantantes/a')
})

router.get('/editCantante/:id', async (req, res) => {

  await Interprete.findById(req.params.id, (err, interprete) => {
  	if(err) throw err

		Disco.populate(interprete, {path: "discos"}, (err, interprete) => {
			if(err) throw err

			res.render('editCantante', { 
				title: 'Editar el cantante',
				interprete 
			})
	  })
	})
})


router.put('/editCantante/:id', async (req, res) => {
  let id = req.params.id,
			agregarDisco = req.body.disco;
			
			await Interprete.findByIdAndUpdate(id, req.body, (err, interprete) => {
				if(err) throw err

				let arr = interprete.discos;
				// para eliminar algún elemento del array discos
				arr.splice(28,2)
				interprete.save()
		
				if(agregarDisco !== ""){
					arr.push(agregarDisco)
					interprete.save() 
				}


  	res.redirect('/cantantes/a');
  });
});


router.delete('/deleteCantante/:id', async (req, res) => {
  const {id} = req.params
	await Interprete.findByIdAndDelete(id, (err, cantante) => {
  	if(err) throw err

		res.redirect('/cantantes/a');
  });
})


module.exports = router;