var form = document.getElementById("mainSearch");

// form validation
function validateSearch() {
    var validate = false;
    validate = validateDate(form.checkInInput.value);
    validate = validateDate(form.checkOutInput.value);
    return validate;
}

function validateDate(formDate) {
    let validity = false;
    let year = formDate.slice(0,4);
    let month = formDate.slice(5,7);
    let day = formDate.slice(8,10);
    if (year == 2020 || year == 2021 || year == 2022) {
        console.log("year valid");
        validity = true;
    }
    if (month > 0 && month <= 12) {
        console.log("month valid");
        validity = true;
    }
    if (day > 0 && day < 31) {
        console.log("day valid");
        validity = true;
    }
    console.log(validity);
    return validity;
}