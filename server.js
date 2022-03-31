const express = require('express')
const nunjucks = require('nunjucks')
const axios = require('axios')
const expressFileUpload = require('express-fileupload')
const fs = require('fs').promises

const app = express()

// definimos carpetas con nuestros archivos estáticos
app.use(express.static('static'))

//configuramos el expressfileupload
app.use(expressFileUpload({
    limits: { fileSize: 5242880 },
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo supera el máximo (5Mb)'
}))
// configuramos nunjucks
nunjucks.configure('template', {
    express: app,
    autoescape: true,
    watch: true
})

//traemos la informacion de la pagina 
app.post('/imagen', async(req, res)=>{
    //rescatamos la informacion del formulario
    const img = req.files.target_file;
    //rescatamos la informacion del body
    const position = req.body.posicion;
    //condicion para cargar imagen
    if(parseInt(position)<=8){
        //guardamos los archivos
        await img.mv(`static/imgs/imagen-${position}.jpg`)
    }else{
        // respondemos 
        console.log("Debe Ingresar una posicion entre 1-8");
    }
    //ruta de respuesta
    res.redirect('/collage')
})
//renderizar collage
app.get('/collage', async(req, res)=>{
    res.render('collage.html')
})

//borrar archivos
app.get('/deleteImg/:nombre', async (req, res) => {
    // con la siguiente variable recuperamos el archivo que deseamos eliminar
    const nombre = req.params.nombre;
    console.log(nombre)
    //con la siguiente ruta eliminamos el archivo
    await fs.unlink(`static/imgs/${nombre}`)
    //imprimimos en consola el nombre del archivo eliminado
    console.log(`el archivo con el nombre:${nombre} fue eliminada satisfactoriamente`)
    // con la siguiente linea redirigimos al template de collage
    res.redirect('/collage')
})

app.get('/', async(req, res)=>{
    res.render('formulario.html')
    
})
// corriendo el servidor
app.listen(3000, () => {
    console.log(`Server started on 3000`);
});