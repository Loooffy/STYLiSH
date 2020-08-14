function addName() {
    let base = '/trackName?name='
    params = document.getElementById('input').value
    location.replace(base+params)
}
