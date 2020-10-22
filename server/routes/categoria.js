const express = require('express');

let {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//=================================
// Mostrar las categorias
//=================================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

    })
});

//=================================
// Mostrar una categoria por ID
//=================================

app.get('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

        
    })

    
})

//=================================
// Crear una categoria
//=================================

app.post('/categoria', verificaToken ,(req, res)=>{
    //Regresa la nueva categoria
    // req.usuario.id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


})

//=================================
// Actualizar una categoria
//=================================

app.put('/categoria/:id', verificaToken ,(req, res)=>{

    let id = req.params.id;
    let body = req.body;


    let desCategoria = {
        descripcion: body.descripcion
    }

    console.log(id, body, desCategoria)


    Categoria.findByIdAndUpdate(id, desCategoria, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    } )

})

//=================================
// Borrar la categoria
//=================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role] ,(req, res)=>{
    // Solo un administrador puede borrar la categoria
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })


    
})

module.exports = app;