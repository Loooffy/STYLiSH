require('dotenv').config()
const path = require('path')
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const jwtSignOptions = {
    algorithm: 'HS256',
    expiresIn: 3600
};

const secret = process.env["JWTSECRET"]
const express = require('express')
const multer = require('multer')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const accessKeyId = process.env["ACCESSKEYID"]
const secretAccessKey = process.env["SECRETACCESSKEY"]
const model = require('./Model')
const url = require('url')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const productFileFields = 
    [
        {name: 'main_image', maxCount: 1}, 
        {name: 'images', maxCount: 5} 
    ]

const s3 = new aws.S3({
    accessKeyId:accessKeyId,
    srcretAccessKey:secretAccessKey,
    region:'us-east-2'
})
const storage = multerS3({
    s3:s3,
    bucket: 'elasticbeanstalk-us-east-2-445556063533',
    key: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({storage: storage})

let fs = require('fs');
let http = require('http');
let https = require('https');
let privateKey  = fs.readFileSync('/etc/ssl/private.key', 'utf8');
let certificate = fs.readFileSync('/etc/ssl/certificate.crt', 'utf8');
let credentials = {key: privateKey, cert: certificate};

app.get('/api/1.0/marketing/campaigns', (req, res) => listCampaign(req, res).then((r) => r.res.send(r.resData)))
//app.get('/thankyou.html', (req, res) => res.redirect('/'))
app.use('/images', express.static('images'))
app.use('/admin', express.static('admin'))
app.use('/', express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/api/1.0/products/all', (req, res) => listProduct(req, res).then((r) => r.res.send(r.resData)))
app.get('/api/1.0/products/men', (req, res) => listProduct(req, res).then((r) => r.res.send(r.resData)))
app.get('/api/1.0/products/women', (req, res) => listProduct(req, res).then((r) => r.res.send(r.resData)))
app.get('/api/1.0/products/accessories', (req, res) => listProduct(req, res).then((r) => r.res.send(r.resData)))

app.get('/api/1.0/products/search', (req, res) => searchProduct(req, res).then((r) => r.res.send(r.resData)))
app.get('/api/1.0/products/details', (req, res) => productDetails(req, res).then((r) => r.res.send(r.resData)))

app.post('/api/1.0/user/signup', (req, res) => signUp(req, res))
app.post('/api/1.0/user/signin', (req, res) => signIn(req, res))
app.get('/api/1.0/user/profile', (req, res) => userProfile(req, res))

app.post('/api/1.0/products/create', upload.fields([{name:'images', maxCount:5},{name:'main_image', maxCount:1}]), (req, res) => createProduct(req, res).then((r) => r.res.send(r.resData)))
app.post('/api/1.0/products/marketing/campaigns/create', upload.single('image'), (req, res) => createCampaigns(req, res).then((r) => r.res.send(r.resData)))

app.post('/api/1.0/order/checkout', (req, res) => orderCheckout(req, res))
app.get('/api/1.0/order/payments', (req, res) => getPayments(req, res))

app.get('/api/1.0/dashboard/revenue', (req, res) => getRevenue(req, res))
app.get('/api/1.0/dashboard/colorSold', (req, res) => getColorSold(req, res))
app.get('/api/1.0/dashboard/getPriceOfAll', (req, res) => getPriceOfAll(req, res))
app.get('/api/1.0/dashboard/getTopFiveSize', (req, res) => getTopFiveSize(req, res))

app.listen(port, () => console.log('listening'))

function getData(url) {
  return fetch(url, {
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    edirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.json()) // 輸出成 json
} 

function rmDuplicate(data){
    jsonObject = data.map(JSON.stringify); 
    uniqueSet = new Set(jsonObject); 
    uniqueArray = Array.from(uniqueSet).map(JSON.parse); 
    return uniqueArray
}

//async function imageDownload(req, res){
//    let regex = /\/([\w]*\.[\w]*)$/;
//    let fileName = req.url.match(regex)[1]
//    console.log(fileName)
//}

async function signUp(req, res){
    if (req.body.email === undefined || req.body.password === undefined){
       res.status(400).send('invalid input')
    } else {
        try {
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        const payload = {
            provider:'native',
            name:name,
            email:email,
        }
        await model.sequelize.query(`insert into users(email, name, password) values('${email}', '${name}', '${password}')`)
        const jwtToken = await jwt.sign(payload, secret, jwtSignOptions)
        let userQ = await model.sequelize.query(`select id,email, name, picture from users where email = '${email}'`)
        
        let data= {
            "access_token": jwtToken,
            "access_expired": 3600,
        }
        let user = userQ[0][0]
        console.log(user.email)
        res.cookie('token', jwtToken, {encode: String})
            .cookie('name', user.name, {encode: String})
            .cookie('email', user.email, {encode: String})
            .redirect('/profile.html')

        //resData = {data, user}
        //res.send(JSON.stringify(resData))
        } catch (err) {
            if (err instanceof TypeError){
                res.status(500).send('server error')
            } else if (err.errors != undefined) {
                let emailExisted = err.errors[0]['path'] === 'email_validation' && err.errors[0]['type'] === 'unique violation'
                if (emailExisted === true){
                    res.status(403).send('this email had been signed up, please try another one')
                } else {
                    res.status(500).send('server error')
                }
            } else {
                console.log(err)
                res.status(500).send('server error')
            }
        }
    }
}

async function signIn(req, res){
    let validInput = req.body.email && req.body.password
    let facebookLogin = req.body.provider && req.body.token
    console.log(req.body)
    console.log(validInput, facebookLogin)
    if (!validInput && !facebookLogin){
       res.status(400).send('invalid input')
    } else if (validInput){
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        let provider = req.body.provider
        let valid = await model.sequelize.query(`select exists(select id from users where email='${email}' and password='${password}')`).then(v => parseInt(Object.values(v[0][0])))
        //console.log(parseInt(Object.values(valid[0][0])))
        if (!valid){
            res.status(403).send('invalid email or password')
        } else {
            const payload = {
                provider:'native',
                name:name,
                email:email,
            }
            let userQ = await model.sequelize.query(`select id, name, email, picture from users where email = '${email}'`)
            const jwtToken = await jwt.sign(payload, secret, jwtSignOptions)
            let data= {
                "access_token": jwtToken,
                "access_expired": 3600,
            }
            let user = userQ[0][0]
            user.provider = provider
            //console.log('user',user.email)
            res.cookie('token', jwtToken, {encode: String})
                .cookie('name', user.name, {encode: String})
                .cookie('email', user.email, {encode: String})
                .redirect('/profile.html')
            //res.send(JSON.stringify(resData))
        }
    } else if (facebookLogin){
        let provider = req.body.provider
        let token = req.body.token
        let exp = req.body.exp
        let id = req.body.id
        getFbDataUrl = `https://graph.facebook.com/${id}?fields=name,email&access_token=${token}`
        let fbData = await fetch(getFbDataUrl).then(r => r.json())
        console.log(fbData)
        let user = await model.sequelize.query(`select id, name, email, picture from users where email = '${fbData.email}'`)
        user = user[0][0]
        console.log(user)
        user.provider = provider
        let data= {
            "access_token": token,
            "access_expired": exp
        }
        resData = {data, user}
        res.send(JSON.stringify(resData))
    }
}

async function userProfile(req, res){
    if (!req.headers.authorization){
        res.status(403).send('token not provided')
    }
    console.log(req.header)
    let token = req.headers.authorization.split(' ')[1]
    try {
        let jwtToken = await jwt.verify(token, secret, jwtSignOptions)
        console.log(jwtToken)
        let provider = jwtToken.provider
        let email = jwtToken.email
        let valid = await model.sequelize.query(`select exists(select email from users where email='${email}')`).then(v => parseInt(Object.values(v[0][0])[0]))
        if (!valid){
            res.status(403).send('invalid token')
        } else {
            userQ = await model.sequelize.query(`select id, name, email, picture from users where email = '${email}'`)
            let user = userQ[0][0]
            user.provider= provider
            resData = {data: user}
            res.send(JSON.stringify(resData))
        }
    } catch(err) {
        console.log(err)
        res.status(403).send('invalid token')
    }
}

async function listCampaign(req, res) {
        campaignQ = `select product_id, picture, story from campaign`
    try {
        let campaign = await model.sequelize.query(campaignQ)
        let resData = await {'data':campaign[0]}
        resData = await JSON.stringify(resData)
        let response = {res, resData}
        return response
    } catch (err) {
        console.log(err)
    }
}

async function listProduct(req, res) {
    let query = Object.keys(req.query)
    if (query[0] != 'paging' && query.length != 0) {
        let resData = 'bad request'
        return {res, resData}
    }
    let regex = /\/([\w]*)(\?.*)?$/
    let category = req.url.match(regex)[1]
    let itemPerPage = 6
    let paging = parseInt(req.query.paging)
    if (paging === undefined || isNaN(paging)) {
        paging = 0
    } 
    let qStart = paging * itemPerPage
    let productQ = ''
 
    switch (category){
        case 'all':
            productQ = `select * from product limit ${qStart}, ${itemPerPage}`
            break
        case 'men':
            productQ = `select * from product where category = '${category}' limit ${qStart}, ${itemPerPage}`
            break
        case 'women':
            productQ = `select * from product where category = '${category}' limit ${qStart}, ${itemPerPage}`
            break
        case 'accessories':
            productQ = `select * from product where category = '${category}' limit ${qStart}, ${itemPerPage}`
            break
    }
    try {
        let product = await model.sequelize.query(productQ)
        let imageQ = `select * from product_images where product_id = any(select p.id from (${productQ}) as p);`
        let image = await model.sequelize.query(imageQ)
        let variantsQ = `select stock.*, color.name from stock left join color on stock.color_code = color.code where product_id = any(select p.id from (${productQ}) as p) ;`
        let variants = await model.sequelize.query(variantsQ)

        product[0].map(p => p.colors = Array.from(new Set((variants[0].filter(v => p.id === v.product_id).map(v => {let r={};['code', 'name'].forEach((x,i) => r[x]=[v['color_code'] ,v['name']][i]);return r}).map(JSON.stringify))), JSON.parse))
        product[0].map(p => p.sizes = rmDuplicate(variants[0].filter(v => p.id === v.product_id).map(v => [v['size']])).join(','))
        product[0].map(p => p.images = image[0].slice(1,).filter(i => p.id === i.product_id).map(i => + i['image']))
        product[0].map(p => p.variants = variants[0].filter(v => p.id === v.product_id).map(v => {delete v['product_id'];delete v['name'];return v}))
        product[0].map(p => delete p['category'])
        let count = 0
        if (category === 'all'){
            countQ = 'select count(id) from product;'
        } else {
            countQ = `select count(id) from product where category = '${category}'`
        }
        let foundNum = await model.sequelize.query(countQ)
        foundNum = foundNum[0][0]['count(id)']
        let pageTotal = await Math.ceil(foundNum/itemPerPage)
        let resData = await {'data':product[0]}
        if (pageTotal === 1 || paging + 1 >= pageTotal){
            resData = await JSON.stringify(resData)
        } else {
            resData.next_paging = paging + 1
            resData = await JSON.stringify(resData)
        }
        let response = {res, resData}
        return response
    } catch (err) {
        console.log(err)
    }
}

async function searchProduct(req, res) {
    let query = Object.keys(req.query)
    if (query[0] != 'keyword' && query.length != 0) {
        let resData = 'bad request'
        return {res, resData}
    }
    kw = req.query.keyword
    let paging = parseInt(req.query.paging)
    if (paging === undefined || isNaN(paging)){
        paging = 0
    }
    console.log(paging)
    let itemPerPage = 6
    let qStart = paging * itemPerPage
    let countQ = `select count(id) from product where title like '%${kw}%'`
    let productQ = `select * from product where title like '%${kw}%' limit ${qStart}, ${itemPerPage}`
    console.log(productQ)
 
    try {
        let product = await model.sequelize.query(productQ)
        let imageQ = `select * from product_images where product_id = any(select p.id from (${productQ}) as p);`
        let image = await model.sequelize.query(imageQ)
        let variantsQ = `select stock.*, color.name from stock left join color on stock.color_code = color.code where product_id = any(select p.id from (${productQ}) as p) ;`
        let variants = await model.sequelize.query(variantsQ)
        console.log(variants)

        product[0].map(p => p.colors = Array.from(new Set((variants[0].filter(v => p.id === v.product_id).map(v => {let r={};['code', 'name'].forEach((x,i) => r[x]=[v['color_code'] ,v['name']][i]);return r}).map(JSON.stringify))), JSON.parse))
        product[0].map(p => p.sizes = rmDuplicate(variants[0].filter(v => p.id === v.product_id).map(v => [v['size']])).join(','))
        product[0].map(p => p.images = image[0].slice(1,).filter(i => p.id === i.product_id).map(i => i['image']))
        product[0].map(p => p.main_image = image[0].slice(0,1).filter(i => p.id === i.product_id).map(i => i['image']))
        product[0].map(p => p.variants = variants[0].filter(v => p.id === v.product_id).map(v => {delete v['product_id'];delete v['name'];return v}))
        product[0].map(p => delete p['category'])

        let foundNum = await model.sequelize.query(countQ)
        foundNum = foundNum[0][0]['count(id)']
        let pageTotal = await Math.ceil(foundNum/itemPerPage)
        console.log(foundNum, paging, pageTotal)
        let resData = await {'data':product[0]}
        if (pageTotal === 1 || paging + 1 >= pageTotal){
            resData = await JSON.stringify(resData)
        } else {
            resData.next_paging = paging + 1
            resData = await JSON.stringify(resData)
        }
        let response = {res, resData}
        return response
    } catch (err) {
        console.log(err)
    }
}

async function productDetails(req, res) {
    let query = Object.keys(req.query)
    if (query[0] != 'id' && query.length != 0) {
        let resData = 'bad request'
        return {res, resData}
    }
    id = req.query.id
    let productQ = `select * from product where id = '${id}'`
    console.log(productQ)
 
    try {
        let product = await model.sequelize.query(productQ)
        let imageQ = `select * from product_images where product_id = any(select p.id from (${productQ}) as p);`
        let image = await model.sequelize.query(imageQ)
        let variantsQ = `select stock.*, color.name from stock left join color on stock.color_code = color.code where product_id = any(select p.id from (${productQ}) as p) ;`
        let variants = await model.sequelize.query(variantsQ)
        console.log(variants)

        product[0].map(p => p.colors = Array.from(new Set((variants[0].filter(v => p.id === v.product_id).map(v => {let r={};['code', 'name'].forEach((x,i) => r[x]=[v['color_code'] ,v['name']][i]);return r}).map(JSON.stringify))), JSON.parse))
        product[0].map(p => p.sizes = rmDuplicate(variants[0].filter(v => p.id === v.product_id).map(v => [v['size']])).join(','))
        product[0].map(p => p.images = image[0].slice(1,).filter(i => p.id === i.product_id).map(i => i['image']))
        product[0].map(p => p.main_image = image[0].slice(0,1).filter(i => p.id === i.product_id).map(i => i['image']))
        product[0].map(p => p.variants = variants[0].filter(v => p.id === v.product_id).map(v => {delete v['product_id'];delete v['name'];return v}))
        product[0].map(p => delete p['category'])

        let resData = await {'data':product[0][0]}
        resData = await JSON.stringify(resData)
        let response = {res, resData}
        return response
    } catch (err) {
        console.log(err)
    }
}

async function createProduct(req, res) {
    try {
        req.body.main_image = req.files.main_image[0].originalname
        async function getId() {
            let resProduct = await model.Product.create(req.body)
            console.log('product ' + resProduct.id + ' created')
            await model.Product_images.create({product_id: resProduct.id, image: req.files.main_image[0].originalname})
            console.log(req.files.main_image[0].originalname + ' created')
            await req.files.images.map(async (file) => {
                let img = await model.Product_images.create({product_id: resProduct.id, image: file.originalname})
                console.log(img.image + 'created')
            })
            return resProduct
        }
        async function resId() {
            let resData = await getId()
            return 'product ' + resData.id + ' created'
        }

        resData = await resId()
        return {res,resData}

    } catch (err) {
          console.log(err)
    }
};

async function orderCheckout(req, res) {
    try {
        console.log(req.body.order)
        let recipient = req.body.order.recipient
        let list = req.body.list.map(i => {return {product_id:i.id, color_code:i.color.code, size:i.size, quatity:i.qty}})
        let orderInfo = (()=>{delete req.body.order.recipient;delete req.body.order.list;return req.body.order})
        let checkoutInfo = {...orderInfo(), ...recipient, ...{paid: false}} 
        //console.log({...orderInfo(), ...recipient, ...{paid: false}})
        async function insertOrder(list, checkout_id) {
            for (let order of list){
                order.checkout_id =  checkout_id
                await model.Order.create(order)
                console.log('order ' + order.product_id + ' created')
            }
            return 'ok'
        }
        
        async function insertCheckout() {
            let checkout = await model.Checkout.create(checkoutInfo)
            console.log('checkout ' + checkout.id + ' created')
            return checkout.id
        }
        
        async function payByPrime(req, recipient) {
            let prime = req.body.prime
            let partnerkey = "partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG"
            let merchant_id = "AppWorksSchool_CTBC"
            let details = "tapPay test"
            let amount = req.body.order.total
            let cardholder = {
                phone_number: recipient.phone,
                name:recipient.name,
                email:recipient.email}
            let reqData = {
                prime: prime,
                partner_key: partnerkey,
                merchant_id: merchant_id,
                details: details,
                amount: amount,
                cardholder: cardholder}
            payUrl = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
            console.log(reqData)
            let paid = await fetch(payUrl, {
                body: JSON.stringify(reqData),
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': 'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG'
                }
            }).then(r=>r.json())
            console.log(await paid)
            return paid
        }
        
        let response = await payByPrime(req, recipient)
        if (response.status === 0){
            checkoutInfo.paid = true
        }
        let checkId = await insertCheckout()
        let order = await insertOrder(list, checkId)
        console.log('paid: ', response)
        let resData = JSON.stringify({data: {checkId: checkId, status: response.status}})
        if (response.status === 0){
            res.cookie('checkId', checkId)
        }

        res.send(resData)

    } catch (err) {
          console.log(err)
    }
};


async function createCampaigns(req, res) {
    try {
        req.body.image = req.file.filename
        console.log(req.body)
        async function addCampaign() {
            let resCampaign = await model.Campaign.create(req.body)
            console.log('campaign' + resCampaign.id + ' created')
            return resCampaign
        }
        async function resId() {
            let resData = await addCampaign()
            return 'product ' + resData.product_id + ' created'
        }

        resData = await resId()
        return {res,resData}

    } catch (err) {
          console.log(err)
    }
};

async function getPayments(req, res) {
    try {
            paymentsQ = await model.sequelize.query(`select user_id, total from payments limit 10000`)
            let payments = paymentsQ[0]
            let sumObj = {1:0, 2:0, 3:0, 4:0, 5:0}
            let sumArr = []
            payments.map(payment => sumObj[payment.user_id] += payment.total)
            Object.keys(sumObj).map(user_id => {sumArr.push({user_id:user_id, total_payment:sumObj[user_id]})})
            let data = {data: sumArr}
            res.send(data)
    } catch(err) {
        console.log(err)
    }
}

async function getRevenue(req, res) {
    try {
            let revenueQ = await model.sequelize.query(`select sum(total) as revenue from payments`)
            let revenue = revenueQ[0][0]
            let data = {data: revenue}
            res.send(data)
    } catch(err) {
        console.log(err)
    }
}

async function getColorSold(req, res) {
    try {
            let getColorPercentageQ = await model.sequelize.query(`SELECT color_code, color.name, sum(quantity) as sold FROM stylish.order_table inner join color on order_table.color_code = color.code group by color_code;`)
            let getColorPercentage = getColorPercentageQ[0]
            let data = {data: getColorPercentage}
            res.send(data)
    } catch(err) {
        console.log(err)
    }
}

async function getPriceOfAll(req, res) {
    try {
            let getPriceOfAllQ = await model.sequelize.query(`SELECT price FROM order_table`)
            let getPriceOfAll = getPriceOfAllQ[0]
            let data = {data: getPriceOfAll}
            res.send(getPriceOfAll)
    } catch(err) {
        console.log(err)
    }
}

async function getTopFiveSize(req, res) {
    try {
            let getTopFiveQ = await model.sequelize.query(`select product_id as id from order_table group by product_id order by sum(quantity) DESC limit 5;`)
            let TopFive = getTopFiveQ[0]
            let getSizes = TopFive.map(id => {
                return model.sequelize.query(`select product_id, size, sum(quantity) as quantity from order_table where product_id = ${id.id} group by size;`)
            })
            let topFiveProductSize = await Promise.all(getSizes).then(products => {return (products.map(product => {return product[0]}))})
            let data = {data: topFiveProductSize}
            res.send(data)
    } catch(err) {
        console.log(err)
    }
}
