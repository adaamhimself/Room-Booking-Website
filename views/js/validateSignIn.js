// Login form
var loginform = document.getElementById("signInForm");

// Event listeners for form submission
loginform.addEventListener('submit', validateLoginInfo);
registerform.addEventListener('submit', validateRegistration);

// Validate the login information (check for null values only)
function validateLoginInfo(event) {
    var validity = true;
    if (loginform.signInUsernameID.value == "") {
        validity = false;
    }
    if (loginform.signInPasswordID.value == "") {
        validity = false;
    }
    else {
        validity = true;
    }
    if (validity == false) {
        if (document.getElementById("loginWarning") == null) {
            let warningSpan = document.createElement("span");
            warningSpan.id = "loginWarning";
            warningSpan.class = "formInput";
            let warning = document.createTextNode("Username or password is empty");
            warningSpan.appendChild(warning);
            loginform.appendChild(warningSpan);
        }
        event.preventDefault();
    }
    return validity;
}


// Register form
var registerform = document.getElementById("registerForm");

// Validate the registration information
function validateRegistration(event) {
    var validity = true;
    // check for null values
    if (registerform.email.value == "") {
        validity = false;
    }
    if (registerform.fullName.value == "") {
        validity = false;
    }
    if (registerform.signInUsername.value == "") {
        validity = false;
    }
    if (registerform.signInPassword.value == "") {
        validity = false;
    }
    if (registerform.birthdate.value == "") {
        validity = false;
    }
    if (validity == false) {
        if (document.getElementById("loginWarning") == null) {
            let warningSpan = document.createElement("span");
            warningSpan.id = "loginWarning";
            warningSpan.class = "formInput";
            let warning = document.createTextNode("One or more fields are empty");
            warningSpan.appendChild(warning);
            registerform.appendChild(warningSpan);
        }
    }
    // if inputs are not null, check for valid email 
    if (validity == true) {
        var emailregex = new RegExp('^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$');
        validity = emailregex.test(registerform.email.value);
    }
    // check password length
    if (validity == true) {
        var passwordlength = registerform.password.value.length;
        if (passwordlength < 8) {
            validity = false;
            let warningSpan = document.createElement("span");
            warningSpan.id = "loginWarning";
            warningSpan.class = "formInput";
            let warning = document.createTextNode("Password must be at least 8 characters long");
            warningSpan.appendChild(warning);
            registerform.appendChild(warningSpan);
        }
    }
    // check if password is mixture of letters and numbers
    if (validity == true) {
        // Regex for this validation was found on stackoverflow.com
        var mixregex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,50}$/);
        validity = mixregex.test(registerform.password.value);
        console.log(validity);
        if (validity == false) {
            validity = false;
            let warningSpan = document.createElement("span");
            warningSpan.id = "loginWarning";
            warningSpan.class = "formInput";
            let warning = document.createTextNode("Password must be a mixture of letters and numbers");
            warningSpan.appendChild(warning);
            registerform.appendChild(warningSpan);
        }
    }

    if (validity == false) {
        event.preventDefault();  
    }
    return validity;
}