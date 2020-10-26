const jwt = require('jsonwebtoken');


/// ==================
// Verificar Token
/// ==================


let verificaToken = (req, res, next)=>{

    // Esto es para acceder a los headers
    
    let token = req.get('token'); // Authorization

    //Para verificar el token

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            })
        }

        req.usuario = decoded.usuario;

        // Tiene que estar dentro de la función para que se ejecute cuando el token sea válido

        next();
    })

    // res.json({
    //     token: token
    // });
}

/// ==================
// Verifica AdminRole
/// ==================

let verificaAdmin_Role = (req, res, next)=>{

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else {

        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        })

    }

    
}

/// ==================
// Verifica Token para imagen
/// ==================

let verificaTokenImg = (req, res, next)=>{
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            })
        }

        req.usuario = decoded.usuario;

        next();
    })

    // res.json({
    //     token
    // })
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}