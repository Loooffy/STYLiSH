function getVariants(e){
        //let head = element.parentElement
        //let n = 0
        //while (head.innerText===""){
            //head=head.previousElementSibling
            //n+=1
        //} 
        //console.log(color[n], head.innerText)
        //let formData = new FormData 
        //formData.append('info', JSON.stringify({"color":color[n]}))
        //let info = getElementById('info')
        //info.appendTo(info)
        let i = document.createElement('input')
        i.name='variants'
        i.value='black'
        i.type='hidden'
        e.target.appendChild(i)
}

function addEvent(){

    let color = {}
    let stock = document.querySelector("body > div > div.stock > table > thead > tr")
    let num = stock.childElementCount
    let elements = document.getElementsByClassName("amount")

    for (i=0;i<num;i++){
        color[i] = stock.children[i].innerHTML
    }

    //for (element of elements){
        //element.addEventListener("change",(e) => {getInput(e.target, color, num)})
    //}
}
