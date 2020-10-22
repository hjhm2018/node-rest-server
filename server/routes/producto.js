const express = require('express');

let {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// ==================================
//  Obtener productos 
// ==================================

app.get('/productos', verificaToken, (req, res)=>{
    // populate: usuario categoria 
    // paginado
    let from = req.query.from || 0;
    from = Number(from);
    let to = req.query.to || 5;
    to = Number(to);


    Producto.find({disponible:true})
        .skip(from)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

    })
})

// ==================================
//  Obtener productos por id
// ==================================

app.get('/productos/:id', verificaToken, (req, res)=>{
    // populate: usuario categoria 
    // paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'El ID no existe'
                    }
                })
            }
    
            res.json({
                ok: true,
                producto: productoDB
            })   
        })
         
})

// ==================================
//  Buscar productos 
// ==================================

app.get('/productos/buscar/:termino', verificaToken,(req, res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })   

        })


})



// ==================================
//  Crear un nuevo producto 
// ==================================

app.post('/productos', verificaToken, (req, res)=>{
    // grabar el usuario  
    // grabar una categoría del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // if(!productoDB){
        //     return res.status(400).json({
        //         ok: false,
        //         err
        //     })
        // }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

// ==================================
//  Actualizar un nuevo producto 
// ==================================

app.put('/productos/:id', verificaToken, (req, res)=>{
    // grabar el usuario  
    // grabar una categoría del listado
    let id = req.params.id;
    let body = req.body;


    // let editProducto = {
    //     nombre: body.nombre,
    //     precioUni: body.precioUni,
    //     descripcion: body.descripcion
    // }


    Producto.findByIdAndUpdate(id, {new: true, runValidators: true, context: 'query'}, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
    
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })

    } )
})

// ==================================
//  Borrar un producto 
// ==================================

app.delete('/productos/:id', verificaToken, (req, res)=>{
    // cambiar el estado de disponible
    let id = req.params.id;

    // let editProducto = {
    //     disponible: false
    // }


    Producto.findById(id, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'El producto fue borrado'
            })

        })

        

    } )



})

module.exports = app;

