const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();

app.get('/usuario', (req, res)=>{
    // res.json('get usuario local');

    let from = req.query.from || 0;

    from = Number(from);

    let to = req.query.to || 5;

    to = Number(to);

    Usuario.find({estado: true}, 'nombre email')
           .skip(from)
           .limit(to)
           .exec((err, usuarios)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Usuario.count({estado: true}, (err, conteo)=>{
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });
                })

                
           })
})

app.put('/usuario/:id', function(req, res){

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
        
    })

    // res.json('put usuario local');

    
})

app.post('/usuario', (req, res)=>{
    
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })



    // if(body.nombre === undefined){
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: "El nombre es necesario"
    //     });

    // }else{
    //     res.json({
    //         persona: body
    //     })

    // }

    // res.json('post usuario');

    
})

app.delete('/usuario/:id', (req, res)=>{
    // res.json('delete usuario');
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    
    //     if(err){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // })

    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado)=>{
    
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

module.exports = app;

