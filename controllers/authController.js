const Usuario = require('../models/Usuario')
const bcrypsjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async(req,res)=>{

    //Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }
    //Extraer email y el passowrd
    const {email, password} = req.body
    try {
        let usuario = await Usuario.findOne({email})
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no hay ps papi!'})
        }
        //Revisar su password
        const passCorrecto = await bcrypsjs.compare(password,usuario.password)
        if(!passCorrecto){
            return res.status(400).json({msg: 'Password incorrecto'})
        }
        //Si todo es correcto//Crear y firmar el jwt
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
            res.json({token})
        })

    } catch (error) {
        console.log(error)
    }
}

//Obtieen que usuario esta autenticado
exports.usuarioAutenticado = async(req,res)=>{


    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({usuario})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:'Hubo un error'})
    }
}