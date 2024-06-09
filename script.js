 
fetch("https://ntumods.s3.ap-southeast-1.amazonaws.com/hello+world.txt")
.then(function (res) {
    return res.text();
})
.then(function (data) {
    document.getElementById("demo").innerHTML = data;
    console.log(data);
});