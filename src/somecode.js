
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

function timing(element) {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("demo").innerHTML = t;
}

function countDown(tour, group, gi){

    // Set the date we're counting down to
    var countDownDate = new Date(tour.endDate).getTime();

    //check if date is valid. If not valid show an empty string
    if (isNaN(countDownDate)) {
        document.getElementById(tour.id).innerHTML = "";
    } else {
        // Update the count down every 1 second
        var x = setInterval(function () {

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            document.getElementById(tour.id).innerHTML = days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ";

            // If the count down is over, do something
            if (distance < 0) {
                clearInterval(x);
                document.getElementById(tour.id).innerHTML = "EXPIRED";
                disableButtons(gi);
                displayZeroSeatsLeft(gi);
            }

        }, 1000);
    }
}

const ul = document.getElementById('groups');
const url = 'https://api.myjson.com/bins/1983ce';
fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let groups = data;
        return groups.map(function(group) {

            let li = createNode('li');
            let h2 = createNode('h2');
            h2.innerHTML = `Group ${group.id}`;
            let ulTours = createNode('ul');
            ulTours.setAttribute("class", "ulTours");

            append(li, h2);
            append(ul, li);
            append(li, ulTours);

            var groupID = group.id;

            group.tours.map(function(tour) {
                console.log(tour);

                let liTour = createNode('li');
                liTour.setAttribute("class", "tour");
                let divTour = createNode('div');
                divTour.setAttribute("class", "divTour" + groupID);
                let titleTour = createNode('h3');
                titleTour.innerHTML = `${tour.name}`;
                let spanSeats = createNode('span');
                let seats = tour.seats;
                spanSeats.innerHTML = `${tour.seats}`;
                spanSeats.setAttribute("class", "spanSeats" + groupID);

                var spanEndDate = createNode('span');
                // spanEndDate.innerHTML = `${tour.endDate}`;
                spanEndDate.setAttribute("class", "endDate");
                spanEndDate.setAttribute("id", tour.id);
                var timer = setInterval(timing, 1000);

                let spanButton = createNode('span');
                let bookNowButton = createNode('Button');
                bookNowButton.innerHTML = `Book Now`;
                bookNowButton.setAttribute("class", "bookNowButton" + groupID);
                bookNowButton.addEventListener("click", handleButtonClick);
                bookNowButton.setAttribute("id", "bookNowButton" + tour.id);

                append(ulTours, liTour);
                append(liTour, divTour);
                append(divTour, titleTour);
                append(divTour, spanSeats);
                append(divTour, spanEndDate);
                append(divTour, spanButton);
                append(spanButton, bookNowButton);

                countDown(tour, group, groupID);

                function handleButtonClick() {
                    seats = seats - 1;
                    spanSeats.innerHTML = seats;
                    if (seats <= 0) {
                        disableButtons(groupID);
                        displayZeroSeatsLeft(groupID);
                        clearInterval(x);
                    }
                }
            });

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
                    }
                }
            }
        })
    })
    .catch(function(error) {
        console.log(error);
    });

