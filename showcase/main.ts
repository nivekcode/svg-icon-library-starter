import {completeIconSet, MyIcon} from '../dist';

console.log('Complete set', completeIconSet);

function buildIconCard(icon: MyIcon): HTMLDivElement {
    const iconCard = document.createElement('div');
    iconCard.classList.add('icon-card');
    iconCard.appendChild(buildSVGElement(icon));
    iconCard.appendChild(document.createTextNode(icon.name));
    return iconCard;
}

function buildSVGElement(icon: MyIcon): SVGElement {
    const div = document.createElement('DIV');
    div.innerHTML = icon.data;
    return (
        div.querySelector('svg') ||
        this.document.createElementNS('http://www.w3.org/2000/svg', 'path')
    );

}

function buildIconList(iconSet: MyIcon[]) {
    const iconList = document.querySelector('.icon-list');
    iconList.innerHTML = '';
    iconSet.forEach((icon: MyIcon) => iconList.appendChild(buildIconCard(icon)));
}

const searchField = document.querySelector('input');
searchField.addEventListener('keydown', function (event: KeyboardEvent) {
    const newIconSet = completeIconSet.filter((icon: MyIcon) => (icon.name as string).includes(searchField.value));
    buildIconList(newIconSet);
});

buildIconList(completeIconSet);

