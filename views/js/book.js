var totalDays = 0;
var totalPrice = 0;
var daySpan = document.getElementById("days");
var endDateCalendar = document.getElementById("checkOut");

endDateCalendar.addEventListener('change', calculateDays);


function calculateDays() {
    var startDate = new Date(document.getElementById("checkIn").value);
    var endDate = new Date(document.getElementById("checkOut").value);
    var containingspan = document.getElementById("days");
    // Date calculation logic from w3resource
    totalDays = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
    var dayNode = document.createTextNode(totalDays);
    containingspan.innerHTML = "";
    containingspan.appendChild(dayNode);
    calculateRate();
    updateFormValues();
}

function calculateRate() {
    var totalSpan = document.getElementById("total");
    var totalText = document.createTextNode(total);
    var rate = document.getElementById("ppn").innerText;
    totalPrice =  rate * totalDays;
    var totalNode = document.createTextNode(totalPrice);
    totalSpan.appendChild(totalNode);
}

function updateFormValues() {
    document.getElementById("daysBooked").value = totalDays;
    document.getElementById("totalPrice").value = totalPrice;
}