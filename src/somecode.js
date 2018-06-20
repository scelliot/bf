function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const ul = document.getElementById('groups');
// const url = 'https://randomuser.me/api/?results=10';
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
                spanSeats.setAttribute("class", "numberOfSeats");
                let spanEndDate = createNode('span');
                spanEndDate.innerHTML = `${tour.endDate}`;
                spanEndDate.setAttribute("class", "endDate");
                let spanButton = createNode('span');
                let bookNowButton = createNode('Button');
                bookNowButton.innerHTML = `Book Now`;
                bookNowButton.setAttribute("class", "bookNowButton");

                append(ulTours, liTour);
                append(liTour, divTour);
                append(divTour, titleTour);
                append(divTour, spanSeats);
                append(divTour, spanEndDate);
                append(divTour, spanButton);
                append(spanButton, bookNowButton);
            })
        })
    })
    .catch(function(error) {
        console.log(error);
    });