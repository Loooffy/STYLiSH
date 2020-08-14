async function redirect(){
    //let token = document.cookie('token')
    if (document.cookie){
        let cookieArr = document.cookie.split(';').map(r=>'{"'+r.replace('=','":"').trim() +'"}')
        let cookies = Object.assign({}, ...cookieArr.map(c => JSON.parse(c)))
        let token = cookies.token   
        console.log(cookies)
        if (token){
            let response = await getData('/api/1.0/user/profile', token)
                .then(r => r).then(r => r.status)
            if (response === 403){
                window.location.replace('/sign.html')
            } else {
                console.log(cookies.name)
                console.log(cookies.email)
                let userData = {
                    name: cookies.name,
                    email: cookies.email
                }
                showProfile(userData)
            }
        } else {
            //console.log('no')
            sign('/sign.html')
        }
    } else {
        //alert('email或密碼有誤，請重新輸入')
        sign('/sign.html')
    }
}

function showProfile(userData){
    let profile = document.createElement('div')
    let nameDIV = document.createElement('div')
    let emailDIV = document.createElement('div')
    let br = document.createElement('br')
    let email = userData.email
    let name = userData.name
    nameDIV.innerHTML = `name: ${name}`
    emailDIV.innerHTML = `email: ${email}`
    let main = document.getElementsByTagName('main')[0]
    profile.appendChild(nameDIV)
    profile.appendChild(br)
    profile.appendChild(emailDIV)
    main.appendChild(profile)
}

function getData(url, token) {
  return fetch(url, {
    method: 'GET',
    headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json'
    })
  })
  .then(response => response)
  .catch(err => console.log(err))
}

function sign(url) {
    document.location.replace('/sign.html')
}

redirect()
