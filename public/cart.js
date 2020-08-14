function showList() {
    temp = document.getElementsByTagName("template")[0]
    cart = document.getElementsByClassName("cart-list")[0]
    node = temp.content.cloneNode(true)
    cart.appendChild(node)
    let id = document.getElementById("id")
    let title = document.getElementById("title")
    let image = document.getElementById("product-image")
    let color = document.getElementById("color")
    let size = document.getElementById("size")
    let price = document.getElementById("price")
    let subtoatal = document.getElementById("subtotal")
    let totalPrice = document.getElementById("total-price")
    let delivery = document.getElementById("delivery")
    let sumTotal = document.getElementById("sum-total")

    id.innerHTML += window.localStorage.getItem('id')
    title.innerHTML += window.localStorage.getItem('title')
    image.src = `/images/${window.localStorage.getItem('id')}_main.jpg`
    color.innerHTML += window.localStorage.getItem('color')
    size.innerHTML += window.localStorage.getItem('size')
    price.innerHTML += window.localStorage.getItem('price')
    subtotal.innerHTML += parseInt(window.localStorage.getItem('price')) * parseInt(window.localStorage.getItem('amount'))
    totalPrice.innerHTML += parseInt(window.localStorage.getItem('price')) * parseInt(window.localStorage.getItem('amount'))
    delivery.innerHTML += 100
    sumTotal.innerHTML += parseInt(window.localStorage.getItem('price')) * parseInt(window.localStorage.getItem('amount')) + 100
}

if (window.localStorage.length != 0) {
    showList()
} else {
    alert('購物車空空的唷~')
}
