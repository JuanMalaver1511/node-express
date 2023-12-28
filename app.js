const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./public/user');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = 'mongodb://localhost:27017/mydb';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log(`Conexión exitosa a ${mongoURI}`);
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = new User({ username, password });
      await user.save();
      res.redirect('./index.html');
    } catch (error) {
      res.status(500).send('Error',error);
    }
  });

  app.post('/authenticate', async (req, res) =>{
    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).send('El usuario no existe');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send('Contraseña incorrecta');
    }
    res.redirect('./Bienvenida.html');
});

  
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});
