const fetch = require('node-fetch')
const model = require('../Model')

async function getData(url) {
  return await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'GET',
  })
  .then(response => response.json()) // 輸出成 json
} 
    
async function insertData(){
    try {
        let url = 'http://arthurstylish.com:1234/api/1.0/order/data'
        let orders = await getData(url)
        console.log(orders.length)
        let order_insertQ = ''
        let payments_insertQ = ''
        let payment_id = 1
        orders.map(order => {
            payments_insertQ += `(${payment_id}, ${order.total}), `
            order.list.map(p=> 
                order_insertQ += `(${payment_id}, ${p.id}, '${p.color.code}', '${p.color.name}', '${p.size}', ${p.qty}, ${p.price}), `
            )
            payment_id += 1
        })
        await model.sequelize.query(
            `insert into order_table(checkout_id, product_id, color_code, color_name, size, quantity, price) values ${order_insertQ.slice(0,-2)}`
        )
        let color_codes = await model.sequelize.query(
            `SELECT color_code FROM order_table group by color_code`
        )
        let getColors = color_codes[0].map(code => {
            return model.sequelize.query(
                `SELECT color_code, color_name FROM order_table where color_code = '${code.color_code}' limit 1`
            )}
        )
        let colors = await Promise.all(getColors).then(color => color.map(c => c[0]))
        let insert_colors = colors.map(async function(){
            await model.sequelize.query(
                `insert into color(code, name) values ('${color[0].color_code}', '${color[0].color_name}')` 
            )
        })
        await model.sequelize.query(
            `insert into payments(id, total) values ${payments_insertQ.slice(0,-2)}`
        )
        console.log('done')
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

insertData()
