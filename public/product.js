Vue.component('product-details', {
    data: function(){
        return {
            currentcolor: '',
            currentsize: '',
            currentstock: 0
        }
    },
    props: ['details', 'amount', 'colorselected', 'sizeselected', 'stockselected'],
    template:
        `
        <div class="wrapper">
            <img :src="details.main_image">
            <div id="all-info">
                <div class="info-header">
                    <div>{{details.title}}</div>
                    <div>{{details.id}}</div>
                    <br>
                    <div>TWD. {{details.price}}</div>
                </div>
                <div class="major-info">
                    <div class="info-label">顏色</div>
                    <div class="colors">
                        <div v-for="color in details.colors" :ref="color.code" :code="color.code" :style="{background:color.code}" class="colorblock" v-on:click="codeselect"></div>
                    </div>
                </div>
                <div class="major-info">
                    <div class="info-label">尺寸</div>
                    <div class="sizes">
                        <div v-for="size in details.sizes" class="sizeblock" :ref="size" :size="size" v-on:click="sizeselect">{{size}}</div>
                    </div>
                </div>
                <div class="major-info">
                    <div class="info-label">數量</div>
                        <div class="amount-wrapper">
                            <div class="calc" v-on:click="$emit('minus')">-</div>
                            <div class="amount" ref="amount">{{amount}}</div>
                            <div class="calc" v-on:click="$emit('add')">+</div>
                    </div>
                </div>
                <a href="/cart.html">
                    <div v-on:click="setItem" class="add-to-cart">前往結帳</div>
                </a>
                <br>
                <div>實品顏色依照單品照為主</div>
                <br>
                <div class="summary">
                    <div>棉 {{details.texture}}</div>
                    <div>清洗：{{details.wash}}</div>
                    <div>產地：{{details.place}}</div>
                </div>
            </div>
        </div>
        `,
    updated(){
        this.$data.currentcolor = this.colorselected
        this.$data.currentsize = this.sizeselected
        this.$data.currentstock = this.stockselected
        for (size of this.details.sizes){
            this.$refs[size][0].style.background='white'
            this.$refs[size][0].style.color='lightgray'
        }
        for (size of this.sizeActive()){
            this.$refs[size][0].style.background='lightgray'
            this.$refs[size][0].style.color='black'
        }
        this.$refs[this.currentcolor][0].style.outline='solid 1px black'
        this.$refs[this.$data.currentsize][0].style.background='black'
        this.$refs[this.$data.currentsize][0].style.color='white'
    },
    methods:{
        codeselect: function(event){
            for (size of this.details.sizes){
                this.$refs[size][0].style.background='white'
                this.$refs[size][0].style.color='lightgray'
            }
            this.$refs[this.$data.currentcolor][0].style.outline='none'
            let code = event.target.getAttribute('code')
            this.$refs[code][0].style.outline='solid 1px black'
            this.$data.currentcolor = code
            this.$emit('colorselect', code)
            this.$data.currentsize = this.sizeActive()[0]
            this.$emit('sizeselect', this.sizeActive()[0])
            for (size of this.sizeActive()){
                this.$refs[size][0].style.background='lightgray'
                this.$refs[size][0].style.color='black'
            }
            this.$refs[this.$data.currentsize][0].style.color='white'
            this.$refs[this.$data.currentsize][0].style.background='black'
            this.currentstock = this.details.variants.filter(v=>v.color_code===this.$data.currentcolor && this.$data.currentsize === v.size)[0].stock
            this.$emit('resetamount', 1)
            this.$emit('stockselect', this.currentstock)
        },
        sizeselect: function(event){
            this.$emit('resetamount', 1)
            //this.$data.currentstock = this.stockselected
            let size = event.target.getAttribute('size')
            if (this.sizeActive().includes(size)){
                this.$refs[this.$data.currentsize][0].style.background='lightgray'
                this.$refs[this.$data.currentsize][0].style.color='black'
                this.$refs[size][0].style.color='white'
                this.$refs[size][0].style.background='black'
                this.$data.currentsize = size
                this.$emit('sizeselect', size)
                this.currentstock = this.details.variants.filter(v=>v.color_code===this.$data.currentcolor && this.$data.currentsize === v.size)[0].stock
                this.$emit('resetamount', 1)
                this.$emit('stockselect', this.currentstock)
            } 
        },
        sizeActive: function(){
            let variants = this.details.variants
            let sizes = this.details.sizes
            let sizeActive = variants.filter(v=>v.color_code===this.$data.currentcolor).map(v=>v.size)
            return sizeActive
        },
        setItem: function(){
            localStorage.setItem('id', this.details.id)
            localStorage.setItem('title', this.details.title)
            localStorage.setItem('price', this.details.price)
            localStorage.setItem('amount', this.details.variants[0].stock)
            localStorage.setItem('color-name', this.details.colors.filter(c => c['code']===this.colorselected)[0]['name'])
            localStorage.setItem('color-code', this.details.colors.filter(c => c['code']===this.colorselected)[0]['code'])
            localStorage.setItem('size', this.sizeselected)
        }
    }
})

Vue.component('other-images', {
    props: ['details'],
    template: 
        `
            <div class="images">
                <img v-for="image in details.images" :src="image">
            </div>
        `
})

let info = new Vue({
    el: '#details',
    data: {
        details: new Object,
        amount: 1,
        colorselected: '',
        sizeselected: '',
        stockselected: 0,
    },
    mounted(){
        let url = window.location.href
        let regex = /\?(.*?)$/;
        let q = url.match(regex)[0]
        axios.get('/api/1.0/products/details' + q)
        .then(details => {
            this.details = details.data.data
            this.details.main_image = 'https://elasticbeanstalk-us-east-2-445556063533.s3.us-east-2.amazonaws.com/images/' + this.details.main_image
            this.details.images = this.details.images.map(i => {return 'https://elasticbeanstalk-us-east-2-445556063533.s3.us-east-2.amazonaws.com/images/' + i})
            this.details.sizes = this.details.sizes.split(',')
            this.colorselected = this.details.variants[0].color_code
            this.sizeselected = this.details.variants[0].size
            this.stockselected = this.details.variants.filter(v=>v.color_code===this.colorselected && this.sizeselected === v.size)[0].stock
        })
    }, methods:{
        Add: function(){
            if (this.amount < this.stockselected){
                return this.amount += 1
            } else {
                return this.amount
            }
        },
        Minus: function(){
            if (this.amount > 1){
                return this.amount -= 1
            } else {
                return this.amount
            }
        }, 
        colorSelect: function(color){
            this.colorselected = color
        },
        sizeSelect: function(size){
            this.sizeselected = size
        },
        stockSelect: function(stock){
            this.stockselected = stock
        },
        resetAmount: function(amount){
            console.log('reset')
            this.amount = amount
        }
    }
})
