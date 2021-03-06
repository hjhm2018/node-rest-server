// Puerto

process.env.PORT = process.env.PORT || 3000;


// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=======================
// Vencimiento del Token
// ======================

// 60 segundos, 60 minutos, 24 horas, 30 días

process.env.CADUCIDAD_TOKEN = '48h';


//=======================
// Seed de autenticación
// ======================

process.env.SEED = process.env.SEED || 'este-es-el-sed-desarrollo' 

// Base de Datos

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
} else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=======================
// Google Client ID
// ======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '266193774385-4d6iob60lik45g9e8u6dclel4p037vff.apps.googleusercontent.com';
