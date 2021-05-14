var newArr=[];

window.onload=function() { 
    loadFeaturedListings();
}

function loadFeaturedListings() {
    loadFeaturedArr();
    loadListing();
}

function loadFeaturedArr() {
    for (i=0;i<listingArr.length;i++) {
        if (listingArr[0].featured == true) {
            newArr.push(listingArr[i]);
        }
    }
    return newArr;
}

function loadListing() {
    for (i=0;i<newArr.length;i++) {
        // Grab the containing div
        let featuredDiv = document.querySelector(".featured");
        // create a div that will contain the first featured listing
        let featured1 = document.createElement("div");
        featured1.id = "featured1";
        // Image
        let featuredImg = document.createElement("img");
        let imgUrl = "./listings/img/" + newArr[i].code + newArr[i].type + newArr[i].city + ".jpg";
        featuredImg.src = imgUrl;
        // Title span
        let featured1Title = document.createElement("span");
        featured1Title.id = "featured1Title";
        let featured1TitleContent = document.createTextNode(newArr[i].title);
        featured1Title.appendChild(featured1TitleContent);
        // City span
        let featured1City = document.createElement("span");
        let featured1CityContent = document.createTextNode(newArr[i].city);
        featured1City.appendChild(featured1CityContent);
        // Rate span
        let featured1Rate = document.createElement("span");
        let featured1RateContent = document.createTextNode("$" + newArr[i].rate + " per night");  
        featured1Rate.appendChild(featured1RateContent);
        // Append to featured div
        featured1.appendChild(featuredImg);
        featured1.appendChild(featured1Title);
        featured1.appendChild(featured1City);
        featured1.appendChild(featured1Rate);
        // append to the containing div
        featuredDiv.appendChild(featured1);
    }
}