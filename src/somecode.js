
function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function disableButtons(gi) {
    let bnb = document.getElementsByClassName("bookNowButton" + gi);
    console.log("gi " + gi);
    console.log("bnb is " + bnb.length);

    for (let i = 0; i < bnb.length; i++) {
        bnb[i].disabled = true;
        console.log("bnb disabled is " + bnb[i].disabled);
        console.log("bnb class " + bnb[i].className);
    }
}

function displayZeroSeatsLeft(gi) {
    let seatSpans = document.getElementsByClassName("spanSeats" + gi);
    for (let i = 0; i < seatSpans.length; i++) {
        seatSpans[i].innerHTML = "0 seats left";
    }
}

function updateBackgroundColor(gi) {
    let liByGroupID = document.getElementById("group" + gi);
    liByGroupID.style.backgroundColor = "#D3D3D3";
    let liTour = document.getElementsByClassName("tour" + gi);
    for (let i = 0; i < liTour.length; i++) {
        liTour[i].style.backgroundColor = "#D3D3D3";
    }
}

function formattingTime(number) {
    return (number < 10 ? '0' : '') + number;
}

function timer(tour, group, gi){

    // Setting the date we're counting down to
    var countDownDate = new Date(tour.endDate).getTime();

    //check if date is valid. If not valid show an empty string
    if (isNaN(countDownDate)) {
        if (document.getElementById(tour.id) != null) {
            document.getElementById(tour.id).innerHTML = "unknown expiration date";
        }
    } else {
        // Update the count down every 1 second

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = formattingTime(Math.floor(distance / (1000 * 60 * 60 * 24)));
            var hours = formattingTime(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            var minutes = formattingTime(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
            var seconds = formattingTime(Math.floor((distance % (1000 * 60)) / 1000));

            // Output the result in an element with id=tour.id
            if (document.getElementById(tour.id) != null) {
                document.getElementById(tour.id).innerHTML = days + " days " + hours + ":" + minutes + ":" + seconds;
            }

            // If the count down is over, do something
            if (distance < 0) {

                if (document.getElementById("group" + gi) != null) {
                    updateBackgroundColor(gi);
                    if (document.getElementById(tour.id) != null) {
                        document.getElementById(tour.id).innerHTML = "EXPIRED";
                        disableButtons(gi);
                        displayZeroSeatsLeft(gi);
                        stopCountdown(gi);
                    }
                }
            }
    }
}

function stopCountdown(gi) {
    let spans = document.getElementsByClassName("endDate" + gi);
    for (let i = 0; i < spans.length; i++) {
        clearInterval(spans[i].timerID);
    }
}

function initializingEndDate(tour, spanEndDate) {
    if (tour.hasOwnProperty('endDate')){
        let countDownDate = new Date(tour.endDate).getTime();
        if (isNaN(countDownDate)) {
            spanEndDate.innerHTML = "unknown expiration date";
        } else {
            let now = new Date().getTime();
            let distance = countDownDate - now;
            if (distance < 0) {
                spanEndDate.innerHTML = "EXPIRED";
            } else {
                let days = formattingTime(Math.floor(distance / (1000 * 60 * 60 * 24)));
                let hours = formattingTime(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                let minutes = formattingTime(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                let seconds = formattingTime(Math.floor((distance % (1000 * 60)) / 1000));
                spanEndDate.innerHTML = days + " days " + hours + ":" + minutes + ":" + seconds;
            }
        }
    } else {
        spanEndDate.innerHTML = "unknown expiration date";
    }
}

const ul = document.getElementById('groups');
const url = 'https://api.myjson.com/bins/1983ce';
fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let groups = data;
        console.log("data from api: ", groups);
        return groups.map(function(group) {
            console.log("group found: ", group);

            let li = createNode('li');
            let h2 = createNode('h2');
            h2.innerHTML = `Group ${group.id}`;
            let ulTours = createNode('ul');
            ulTours.setAttribute("class", "ulTours");


            var groupID = group.id;
            li.setAttribute("id", "group" + groupID);

            var intervalArray;

            if (group.tours.length) {

            group.tours.map(function(tour) {
                console.log(tour);

                let liTour = createNode('li');
                liTour.setAttribute("class", "tour" + groupID);
                let divTour = createNode('div');
                divTour.setAttribute("class", "divTour" + groupID);
                let titleTour = createNode('h3');
                titleTour.innerHTML = `${tour.name}`;
                let spanSeats = createNode('span');
                let seats = tour.seats;
                spanSeats.innerHTML = `${tour.seats} seats left`;
                spanSeats.setAttribute("class", "spanSeats" + groupID);
                spanSeats.setAttribute("content", "seats");

                let spanEndDate = createNode('span');
                spanEndDate.setAttribute("class", "endDate" + groupID);
                spanEndDate.setAttribute("id", tour.id);
                spanEndDate.setAttribute("content", "endDate");

                // initializing end date
                initializingEndDate(tour, spanEndDate);

                let spanButton = createNode('span');
                let bookNowButton = createNode('Button');
                bookNowButton.innerHTML = `Book Now`;
                bookNowButton.setAttribute("class", "bookNowButton" + groupID);
                bookNowButton.addEventListener("click", handleButtonClick);
                bookNowButton.setAttribute("id", "bookNowButton" + tour.id);
                spanButton.setAttribute("content", "button");

                append(ulTours, liTour);
                append(liTour, divTour);
                append(divTour, titleTour);
                append(divTour, spanSeats);
                append(divTour, spanEndDate);
                append(divTour, spanButton);
                append(spanButton, bookNowButton);

                spanEndDate.timerID = setInterval(function() {timer(tour, group, groupID);}, 1000);

                function handleButtonClick() {
                    seats = seats - 1;
                    spanSeats.innerHTML = seats;

                    // for testing purposes only:

                    if (seats <= 0) {
                        disableButtons(groupID);
                        displayZeroSeatsLeft(groupID);
                        updateBackgroundColor(groupID);
                        stopCountdown(groupID);
                    }
                }
            });

            // appending groups as li elements to ul, and the tours to groups:


            append(li, h2);
            append(ul, li);
            append(li, ulTours);

            } else {
                // show nothing if the group doesn't contain any tours.
            }

            checkSeats(groupID);
            function checkSeats(gi) {
                // alle Touren einer Gruppe kriegen als Klasse Gruppenid
                // anhand derer werden alle Tourenelemente einer gruppe über die Klasse geholt.
                // wenn eine tour an der stelle seats 0 hat, dann
                // werden alle buttons der gruppe disabled.
                console.log("checkSeats was called.");
                let seatsOfOneGroup = document.getElementsByClassName("spanSeats" + groupID);
                console.log("Länge des seatsArrays einer Gruppe: " + seatsOfOneGroup.length);
                for (let i = 0; i < seatsOfOneGroup.length; i++) {
                    console.log("seatsofonegroup an der stelle [i] " + seatsOfOneGroup[i].innerHTML);
                    if (seatsOfOneGroup[i].innerHTML <= 0 ) {
                        console.log("seats were <= 0");
                        disableButtons(gi);
                        console.log("after disableButtons-call.");
                        displayZeroSeatsLeft(gi);
                        updateBackgroundColor(gi);
                        stopCountdown(gi);
                    }
                }
            }
        })
    })
    .catch(function(error) {
        console.log(error);
    });

