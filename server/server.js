const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const authMiddleware = require("./middlewares/authMiddleware");
const port = process.env.PORT || 5000;
const usersRoute = require('./routes/usersRoute');
const productsRoute = require("./routes/productsRoute");
const ordersRoute = require("./routes/ordersRoute")
const notificationsRoute = require("./routes/notificationsRoute");
app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute)
app.use('/api/notifications',notificationsRoute)
app.listen(port, () => {
    console.log(`Node/Express Server started on port ${port}`);
})

