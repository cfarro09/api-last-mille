require('dotenv').config();
const express = require('express');
const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'http://app.qaplaperu.com', 'https://app.qaplaperu.com/', 'http://52.116.128.51:5040', 'https://localhost:3000', 'http://142.44.214.184:9999', 'http://laraigo2.s3-web.us-south.cloud-object-storage.appdomain.cloud'];

const app = express();

app.use(cors(
    {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}
));
app.use(express.json({ limit: '100mb' }));//to accept json

const PORT = process.env.PORT || 6065;

app.use('/api/auth', require('./routes/auth'));
app.use('/api/person', require('./routes/person'));
app.use('/api/channel', require('./routes/channel'));
app.use('/api/ticket', require('./routes/ticket'));
app.use('/api/main', require('./routes/main'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/load', require('./routes/load'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/reportdesigner', require('./routes/reportdesigner'));
app.use('/api/user', require('./routes/user'));
app.use('/api/check', require('./routes/check'));
// app.use('/api/migrator', require('./routes/migrator'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/app', require('./routes/app'));

app.use('/api/rasagraciela', require('./routes/rasa'));

app.use(express.static('public'));


// Definir la pagina principal
app.get('/', (req, res) => {
    res.send('Welcome to Laraigo API ');
});
// Arrancar la app
app.listen(PORT, '0.0.0.0', () => {
})

console.log(`Corriendo en http://localhost:${PORT}`);