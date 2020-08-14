function sendAjax() {
    let xhr = new XMLHttpRequest();
    let base = '/getData';
    let input = document.getElementById('number').value;
    if (input != "") {
        base += '?number=';
    }
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            document.getElementById('sum').innerHTML = xhr.responseText;
            console.log('xhr.responseText');
        }
    };
    xhr.open('GET', base+input, true);
    xhr.send();
}
