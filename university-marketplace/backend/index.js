const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');  
const itemRoutes = require('./routes/item');
const adminRoutes = require('./routes/admin');  // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRoutes); 
app.use('/items', itemRoutes);
app.use('/admin', adminRoutes);  // Add this line

// Corrected to serve the uploads directory as static
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
    res.send('University Marketplace API');
});

const sequelize = new Sequelize('university_marketplace', 'root', 'phpmyadmin', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
});

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

sequelize.sync({ force: false })  
    .then(() => console.log('Database synced'))
    .catch(err => console.log('Error syncing database: ', err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = sequelize;
