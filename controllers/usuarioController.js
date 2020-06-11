const Usuario = require('../models/Usuario')
const bcrypsjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
exports.crearUsuario = async(req,res)=>{

    //Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }
    //Extraer email y password
    const {email,password} = req.body
    try {
        //revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email})
        if(usuario){
            return res.status(400).json({msg:'El usuario ya existe'})
        }
        //Crea el nuevo usuario
        usuario = new Usuario(req.body)
        //hashear el password
        const salt = await bcrypsjs.genSalt(10)
        usuario.password = await bcrypsjs.hash(password,salt)
        //Guarda el usuariio
        await usuario.save()
        //Crear y firmar el jwt
        const payload = {
            usuario:{
                id: usuario.id
            }
        }
        //Firmar el JWT
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn:3600
        },(error,token)=>{
            if(error)throw error
            //Mensaje de confirmacion
            res.send({token})
        })

        //Mensaje de confirmacion
        //res.send({msg:'El usuario a sido creado correctamente'})
    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un mistake!')
    }
}