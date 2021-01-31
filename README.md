# svg-icon-library-starter

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [svg-icon-library-starter](#svg-icon-library-starter)
  - [Getting started](#getting-started)
  - [Delivering the icons](#delivering-the-icons)
  - [Consuming your icon library](#consuming-your-icon-library)
    - [Vanilla JS](#vanilla-js)
    - [Typescript](#typescript)
    - [Framework usage](#framework-usage)
      - [Angular](#angular)
  - [Custom build](#custom-build)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


This is a startert project that helps you build your own awesome icon library for any kind of framework or even for vanilla JS or *TypeScript*. Each SVG icons is processed, optimized and build for static code analysers to enable tree shaking.



## Getting started

1. Fork this repository
2. Customize the project by running a full text search and replacing all "REPLACE_ME" occurrences.
3. Place all you SVG icons into the `svg-icons` folder.
4. Open up a terminal and type `npm run serve`.



## Delivering the icons

Once you placed the icons inside the `svg-icons` folder you can deliver them to production. `npm run build` converts all the icons to *JavaScript* and generates the correct *TypeScript* declaration files into a `dist` folder.



## Consuming your icon library

Once published to *npm*, your icon library is ready to be consumed. There are various ways to consume the icon library.



### Vanilla JS

To consum the icon library in *ES6* you can import icons from your library, create an SVG element and add the icon data to it.

```javascript
// Import the icon from the icon library
import {myIconSmilingFace} from 'my-icon-lib';

// Query the element that you want to append the icon to
const conatiner = document.getElementById('.container');

// Create a new svg element and apply the icon data to it
function buildSVGElement(icon) {
    const div = document.createElement('DIV');
    div.innerHTML = icon.data;
    return (
        div.querySelector('svg') ||
        this.document.createElementNS('http://www.w3.org/2000/svg', 'path')
    );
}

// Append the icon to the container
container.appendChild(buildSVGElement(icon);
```



### Typescript

The *TypeScript* usage is very similar to the *JavaScript* usage. The only difference is that you have additional type safety.

```typescript
// Import the icon from the icon library
import {myIconSmilingFace, MyIcon} from 'my-icon-lib';

// Query the element that you want to append the icon to
const conatiner = document.getElementById('.container');

// Create a new svg element and apply the icon data to it
function buildSVGElement(icon: MyIcon): SVGElement {
    const div = document.createElement('DIV');
    div.innerHTML = icon.data;
    return (
        div.querySelector('svg') ||
        this.document.createElementNS('http://www.w3.org/2000/svg', 'path')
    );
}

// Append the icon to the container
container.appendChild(buildSVGElement(icon));
```



### Framework usage

The usage in frameworks can be a bit more sophisticated than the usage in plain *JavaScript* or *TypeScript*. In frameworks we often work with additional concepts like *components* and more sophisticated builds. 



#### Angular

In Angular we want to provide a reusable component for the icons. A reusable component that accepts a `name` as an `Input` property and displays the desired icon. Furthermore, we want to guarantee that tree shaking is supported. If the icon library contains 300 icons but only one of them is used, only one should end up in the resulting bundle. Furthermore it should also support code splitting and lazy loading in a way that the icon only ends up in the chunk it is used.

To achieve these things we implement a `IconRegistry`.

```typescript
import {Injectable} from '@angular/core';
import {MyIcon} from './my-icon-lib';

@Injectable({
    providedIn: 'root'
})
export class MyIconsRegistry {

    private registry = new Map<string, string>();

    public registerIcons(icons: MyIcon[]): void {
        icons.forEach((icon: MyIcon) => this.registry.set(icon.name, icon.data));
    }

    public getIcon(iconName: string): string | undefined {
        if (!this.registry.has(iconName)) {
            console.warn(
              `We could not find the Icon with the name ${iconName}, did you add it to the Icon registry?`
            );
        }
        return this.registry.get(iconName);
    }
}
```

 

The icon registry holds all the icons in a `Map`. Next we build the `my-icon.component.ts` that will use the registry to display an icon.

```typescript
import {
  ChangeDetectionStrategy, Component, ElementRef, HostBinding, Inject, Input, Optional, ViewEncapsulation
} from '@angular/core';
import {MyIconsRegistry} from './my-icons-registry.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'my-icon',
    template: `
        <ng-content></ng-content>
    `,
    styles: [':host::ng-deep svg{width: 50px; height: 50px}'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyIconComponent {
    private svgIcon: SVGElement;

    @Input()
    set name(iconName: string) {
        if (this.svgIcon) {
            this.element.nativeElement.removeChild(this.svgIcon);
        }
        const svgData = this.myIconsRegistry.getIcon(iconName);
        this.svgIcon = this.svgElementFromString(svgData);
        this.element.nativeElement.appendChild(this.svgIcon);
    }

    constructor(private element: ElementRef, private myIconsRegistry: MyIconsRegistry,
                @Optional() @Inject(DOCUMENT) private document: any) {
    }

    private svgElementFromString(svgContent: string): SVGElement {
        const div = this.document.createElement('DIV');
        div.innerHTML = svgContent;
        return div.querySelector('svg') || this.document.createElementNS('http://www.w3.org/2000/svg', 'path');
    }
}
```

At this point we are ready to consum the `my-icon` component. We first register the desired icon in the lazy loaded *module* and then consume it in a *component*.

```typescript
import { NgModule, Component } from '@angular/core';
import {myIconSmilingFace} from 'my-icon-lib';

import {MyIconsRegistry} from './my-icons-registry';
import {MyIconModule} from './my-icon.module.ts';

@Component({
  selector: 'my-feature',
  template: `<my-icon name="smiling_face"></my-icon>`
})
export class MyFeatureComponent {}

@NgModule({
  declarations: [MyFeatureComponent],
  imports: [MyIconModule]
})
export class MyFeatureModule { 

	constructor(private myIconsRegistry: MyIconsRegistry) {
		myIconsRegistry.registerIcons([myIconSmilingFace]);
	}

}
```



If you want to find out more about why we need a registry and how it helps tree shaking I recommend you to check out this [blogpost](https://medium.com/angular-in-depth/how-to-create-an-icon-library-in-angular-4f8863d95a).



## Custom build

Maybe you have a special setup or you are only interested in *TypeScript* files and don't want to compile the icons to *JavaScript*. In such cases you can always adjust the `svg-to-ts` config in your project. To prevent the *JavaScript* compilation for example you can simply disable it by setting the `compileSources` flag to `false`. For more information check out the [svg-to-ts](https://github.com/kreuzerk/svg-to-ts) docs. 
