let regForm = document.getElementById("regForm");

let usName = document.getElementById("uName");
let usMessage = document.getElementById("usMessage");
let uError = false;

let pWord = document.getElementById("password");
let pwMessage = document.getElementById("pwMessage");
let pError = false;

let sBtn = document.getElementById("sBtn");

regForm.addEventListener('input', function (evt) {
    // if(!pError && !uError) 
    //     sBtn.style.display = "block";
    // else
    //     sBtn.style.display = "none";
});

usName.addEventListener('input', function (evt) {
    uError = false;
    let value = this.value;
    let message = "";
    if(value.length !== 0) {
        if(value.length < 4 || value.length > 15) {
            message += "-Must be 4-15 characters long";
            uError = true;
        } else {
            if(value.charAt(0).match(/^[a-z]+$/ig) === null) {
                message += "-Username must start with a letter\n";
                uError = true;
            } else if(value.match(/^[a-z][a-z\d]+$/ig) === null) {
                message += "-Symbols not allowed";
                uError = true;
            } 
        }
    }
    usMessage.innerHTML = message;
    if(message !== "") 
        usMessage.style.display = "block";
    else
        usMessage.style.display = "none";
});

pWord.addEventListener('input', function (evt) {
    pError = false;
    let value = this.value;
    let message = "";
    if(value.length !== 0) {
        if(value.length < 8) {
            message += "-Password must be 8 or more characters\n";
            pError = true;
        }
        if(value.match(/^[a-z\d]+$/ig) === null) {
            message += "-Password cannot contain symbols or spaces\n";
            pError = true;
        }
        if(value.search(/\d/) === -1) {
            message += "-Must contain at least one number\n";
            pError = true;
        }
        if(value.search(/[A-Z]/) === -1) {
            message += "-Must contain at least one uppercase letter\n";
            pError = true;
        }
        if(value.search(/[a-z]/) === -1) {
            message += "-Must contain at least one lowercase letter";
            pError = true;
        }
    }
    pwMessage.innerHTML = message;
    if(message !== "") 
        pwMessage.style.display = "block";
    else
        pwMessage.style.display = "none";
});