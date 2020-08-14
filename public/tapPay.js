TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')

TPDirect.card.setup({
            fields: {
                number: {
                    element: '#card_number',
                    placeholder: '**** **** **** ****'
                },
                expirationDate: {
                    element: '#exp',
                    placeholder: 'MM / YY'
                },
                ccv: {
                    element: '#ccv',
                    placeholder: '後三碼'
                }
            },
            styles: {
                'input': {
                    'color': 'gray'
                },
                'input.ccv': {
                    'font-size': '16px'
                },
                ':focus': {
                    'color': 'black'
                },
                '.valid': {
                    'color': 'green'
                },
                '.invalid': {
                    'color': 'red'
                },
                '@media screen and (max-width: 400px)': {
                    'input': {
                        'color': 'orange'
                    }
                }
            }
        })

function getInput(){
    let input = document.getElementById('form').getElementsByTagName('input')
    let total = document.getElementById('sum-total').innerHTML.split(' ')[1]
    let data = {
        order:{
            shipping: input.shipping.value,
            payment: input.payment.value,
            total: parseInt(total),
            recipient:{
                email: input.email.value,
                name: input.name.value,
                phone: input.phone.value,
                address: input.address.value,
                time: input.time.value,
            }
        },
        list: [
          {
            id: window.localStorage.getItem('id'),
            name: window.localStorage.getItem('title'),
            price: window.localStorage.getItem('price'),
            color: {
                "name": window.localStorage.getItem('color-name'),
                "code": window.localStorage.getItem('color-code'),
            },
            size: window.localStorage.getItem('size'),
            qty: window.localStorage.getItem('amount'),
          }
        ] 
    }
    return data
}

let getPromise = () => {
    return new Promise((resolve, reject) => {
        TPDirect.card.getPrime((prime) => {
            if (prime) {
                resolve(prime)
            } else {
                return reject(new Error("couldn't get prime"))
            }
        })
    })
}

async function collectData() {
    let inputData = await getInput()
    let prime = await getPromise(r => {return r})
    inputData.prime = prime.card.prime
    return inputData
}

$('form').on('submit', async function (event) {
    event.preventDefault()
    try {
        let orderUrl = '/api/1.0/order/checkout'
        let reqData = await collectData()
        console.log('fetching')
        await fetch(orderUrl, {
            body: JSON.stringify(reqData),
            method: 'POST',
            headers:{
                'content-type': 'application/json'
            }
        })
        .then(r=> {return r.json()})
        .then(r => {
            if (parseInt(r.data.status)===0) {
                window.location.replace(`/thankyou.html`)
            } else {
                alert('payment failed')
            }
        })
        .then(window.localStorage.clear())
        .catch(err => alert(err))
    } catch (err) {
        alert("please fill the blank")
        console.log(err)
    }
})
