const model = require('./Model')

function getRandom(){
    return new Promise((resolve, reject) => {
        let payments = ''
        for (let i=0;i<10000;i++){
            let user_id = Math.floor(1 + Math.random()*5)
            let total = Math.floor(Math.random()*1000)
            payments += '(' + user_id + ',' + total + ')' + ','
        }
        if (payments) {
            resolve(payments.slice(0,-1))
        }
        reject('error')
    })
}

async function createFake(){
    try {
        let payments = await getRandom()
        let result = await model.sequelize.query(
            `insert into payments(user_id, total) values ${payments}`
        )
        console.log(result)
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

createFake()
