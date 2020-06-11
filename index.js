const express = require('express')

const conectarDB = require('./config/db')
const cors = require('cors')

//Creando el servidor
const app = express()
//Conectado a la BD
conectarDB()

//Habilitar Cors
app.use(cors())
//Habilitamos express.json
app.use(express.json({extended:true}))

//Creando el puerto de la app
const PORT = process.env.PORT || 4000

//Importando las rtuas
app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/auth',require('./routes/auth'))
app.use('/api/proyectos',require('./routes/proyectos'))
app.use('/api/tareas',require('./routes/tareas'))

//Arrancando el servidor
app.listen(PORT,()=>{
    console.log(`El servidor funciona en el puerto ${PORT}`)
})