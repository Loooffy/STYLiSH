const Sequelize = require('sequelize')
const config = require('./config')
const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
        pool: {
            max: 20,
            min: 20,
            idle: 30000
        }
    })

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    price: Sequelize.INTEGER,
    texture: Sequelize.STRING,
    wash: Sequelize.STRING,
    place: Sequelize.STRING,
    note: Sequelize.STRING,
    story: Sequelize.STRING,
    category: Sequelize.STRING,
    main_image: Sequelize.STRING,
    }, {
        timestamps: false,
        freezeTableName: true
    }
)


const Checkout = sequelize.define('checkout', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
    shipping: Sequelize.STRING,
    payment: Sequelize.STRING,
    subtotal: Sequelize.INTEGER,
    freight: Sequelize.INTEGER,
    total: Sequelize.INTEGER,
    name: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
    address: Sequelize.STRING,
    time: Sequelize.STRING,
    paid: Sequelize.BOOLEAN,
    }, {
        timestamps: false,
        freezeTableName: true
    }
)

const Order = sequelize.define('order', {
    checkout_id:{
         type: Sequelize.INTEGER,
         primaryKey: true
    },
    product_id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    color_code:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    size:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    quantity: Sequelize.STRING,
    }, {
        timestamps: false,
        freezeTableName: true
    }
)

const Product_images = sequelize.define('product_images', {
    product_id: Sequelize.INTEGER,
    image: {
        type: Sequelize.STRING,
        primaryKey: true
    }
    }, {
        timestamps: false,
        freezeTableNam: true
    }
)


const Campaign  = sequelize.define('campaign', {
    product_id: Sequelize.INTEGER,
    image: {
        type: Sequelize.STRING,
        primaryKey: true
    }
    }, {
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = {Product, Product_images, sequelize, Campaign, Checkout, Order}
