import {completeIconSet, MobiIcon} from '../generated-icons/index';

function buildIconCard(icon: MobiIcon): HTMLDivElement {
    const iconCard = document.createElement('div');
    iconCard.classList.add('icon-card');
    iconCard.appendChild(buildSVGElement(icon));
    iconCard.appendChild(document.createTextNode(icon.name));
    return iconCard;
}

function buildSVGElement(icon: MobiIcon): SVGElement {
    const div = document.createElement('DIV');
    div.innerHTML = icon.data;
    return (
        div.querySelector('svg') ||
        this.document.createElementNS('http://www.w3.org/2000/svg', 'path')
    );

}

function buildIconList(iconSet: MobiIcon[]) {
    const iconList = document.querySelector('.icon-list');
    iconList.innerHTML = '';
    iconSet.forEach((icon: MobiIcon) => iconList.appendChild(buildIconCard(icon)));
}

const searchField = document.querySelector('input');
searchField.addEventListener('keydown', function (event: KeyboardEvent) {
    const newIconSet = completeIconSet.filter((icon: MobiIcon) => (icon.name as string).includes(searchField.value));
    buildIconList(newIconSet);
});

buildIconList(completeIconSet);

