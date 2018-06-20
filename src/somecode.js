function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
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
            let span = createNode('span');
            span.innerHTML = `Group ${group.id}`;

            let ulTours = createNode('ul');
            let spanTours = createNode('span');
            // spanTours.innerHTML = `Tours`;

            append(li, span);
            append(ul, li);

            append(ulTours, spanTours);
            append(li, ulTours);

            group.tours.map(function(tour) {
                console.log(tour);

                let liTour = createNode('li');
                let spanTour = createNode('span');
                spanTour.innerHTML = `${tour.name}`;

                append(liTour, spanTour);
                append(ulTours, liTour);
            })
        })
    })
    .catch(function(error) {
        console.log(error);
    });