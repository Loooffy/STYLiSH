let campaign = new Vue({
    el: '#campaign',
    data: {
        imgPath: '',
    },
    mounted(){
        axios.get('/api/1.0/marketing/campaigns')
        .then(imgPath => {
            this.imgPath = 'images/campaign/' + imgPath.data.data[0].picture
        })
    }
})

Vue.component('productlist', {
    props: ['products'],
    template:
        `
        <div class="wrapper">
            <div class="product-block" v-for="product in products">
                <div class="thumbnail">
                    <a :href="product.url">
                        <img :src="product.main_image">
                    </a>
                    <div class="colors">
                        <div v-for="color in product.colors" :style="{background:color.code}" class="colorblock"></div>
                    </div>
                    <p>{{product.title}}</p>
                    <p>TWD. {{product.price}}</p>
                </div>
            </div>
        </div>`
})

let showProducts = new Vue({
    el: '#products_list',
    data: {
        products: []
    },
    mounted(){
        axios.get('/api/1.0/products/all')
        .then(r => {
            this.products = r.data.data
            this.products.map(r=>{r.main_image = 'https://elasticbeanstalk-us-east-2-445556063533.s3.us-east-2.amazonaws.com/images/' + r.main_image})
            this.products.map(r=>{r.url = '/product.html?id=' + r.id})
            //console.log(r.data.data)
            //console.log(this.products)
        })
    }
})
