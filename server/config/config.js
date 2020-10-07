// Puerto

process.env.PORT = process.env.PORT || 3000;


// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// Base de Datos

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
} else{
    urlDB = 'mongodb+srv://henry:gEUU2ZNd3qifoNY2@cluster0.m8lwo.mongodb.net/cafe'
}

process.env.URLDB = urlDB;