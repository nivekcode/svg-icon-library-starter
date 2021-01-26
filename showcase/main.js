import {completeIconSet} from '../dist/icons';

function buildIconCard(icon) {
    const iconCard = document.createElement('div');
    iconCard.classList.add('icon-card');
    iconCard.appendChild(buildSVGElement(icon));
    iconCard.appendChild(document.createTextNode(icon.name));
    return iconCard;
}

function buildSVGElement(icon) {
    const div = document.createElement('DIV');
    div.innerHTML = icon.data;
    return (
        div.querySelector('svg') ||
        this.document.createElementNS('http://www.w3.org/2000/svg', 'path')
    );
}

function buildIconList(iconSet) {
    const iconList = document.querySelector('.icon-list');
    iconList.innerHTML = '';
    iconSet.forEach(icon => iconList.appendChild(buildIconCard(icon)));
}

const searchField = document.querySelector('input');
searchField.addEventListener('keydown', function (event) {
    const newIconSet = completeIconSet.filter(icon => icon.name.includes(searchField.value));
    buildIconList(newIconSet);
});

buildIconList(completeIconSet);

