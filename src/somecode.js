
function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}



function countDown(tour){

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

            // If the count down is over, write some text
            if (distance < 0) {
                clearInterval(x);
                document.getElementById(tour.id).innerHTML = "EXPIRED";
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

            group.tours.map(function(tour) {
                console.log(tour);

                let liTour = createNode('li');
                liTour.setAttribute("class", "tour");
                let divTour = createNode('div');
                divTour.setAttribute("class", "divTour")
                let titleTour = createNode('h3');
                titleTour.innerHTML = `${tour.name}`;
                let spanSeats = createNode('span');
                spanSeats.innerHTML = `${tour.seats}`;
                var seats = tour.seats;
                spanSeats.setAttribute("class", "numberOfSeats");
                var spanEndDate = createNode('span');
                // spanEndDate.innerHTML = `${tour.endDate}`;
                spanEndDate.setAttribute("class", "endDate");
                spanEndDate.setAttribute("id", tour.id);
                let spanButton = createNode('span');
                let bookNowButton = createNode('Button');
                bookNowButton.innerHTML = `Book Now`;
                bookNowButton.setAttribute("class", "bookNowButton");
                bookNowButton.addEventListener("click", handleButtonClick);

                append(ulTours, liTour);
                append(liTour, divTour);
                append(divTour, titleTour);
                append(divTour, spanSeats);
                append(divTour, spanEndDate);
                append(divTour, spanButton);
                append(spanButton, bookNowButton);

                countDown(tour);

                function handleButtonClick() {
                    seats = seats - 1;
                    spanSeats.innerHTML = seats;
                }
            })
        })
    })
    .catch(function(error) {
        console.log(error);
    });

