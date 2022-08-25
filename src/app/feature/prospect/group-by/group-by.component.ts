import {Component, OnInit} from '@angular/core';
import {ProspectService} from '../prospect.service';
import {TableMenusComponent} from '../table-menus/table-menus.component';
import {TableMenuService} from '../table-menus/table-menu.service';
import Handsontable from 'handsontable';

const colorCode = ['#0054D1', '#0B76B7', '#06A09B', '#DA0240', '#E89500', '#D600B8', '#C53700', '#0013FF', '#338A17', '#444444'];
const backGround = ['rgba(0, 84, 209, 0.2)', 'rgba(11, 118, 183, 0.2)', 'rgba(6, 160, 155, 0.2)', 'rgba(218, 2, 64, 0.2)', 'rgba(232, 149, 0, 0.2)', 'rgba(214, 0, 184, 0.2)', 'rgba(197, 55, 0, 0.2)', 'rgba(0, 19, 255, 0.2)', 'rgba(51, 138, 23, 0.2)', 'rgba(68, 68, 68, 0.2)'];
const cellErrorIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.0002 3.11523C6.19096 3.11523 3.11523 6.21144 3.11523 10.0002C3.11523 13.8095 6.21144 16.8852 10.0002 16.8852C13.8095 16.8852 16.8852 13.789 16.8852 10.0002C16.8852 6.1912 13.8093 3.11523 10.0002 3.11523ZM10.0002 15.6752C6.86927 15.6752 4.32523 13.1312 4.32523 10.0002C4.32523 6.86927 6.86927 4.32523 10.0002 4.32523C13.1312 4.32523 15.6752 6.86927 15.6752 10.0002C15.6752 13.1312 13.1312 15.6752 10.0002 15.6752Z" fill="#FF0101" stroke="#FF0101" stroke-width="0.25"/>
<path d="M10.2921 12.8118L10.2917 12.8115L10.2844 12.8202C10.2159 12.9025 10.1174 12.9352 10.0004 12.9352C9.87522 12.9352 9.76918 12.8896 9.69363 12.8166C9.62876 12.7339 9.58545 12.6419 9.58545 12.5202C9.58545 12.4147 9.63131 12.3061 9.70884 12.2286C9.86002 12.0774 10.1409 12.0774 10.2921 12.2286C10.3696 12.3061 10.4154 12.4147 10.4154 12.5202C10.4154 12.6432 10.3715 12.7324 10.2921 12.8118Z" fill="#FF0101" stroke="#FF0101" stroke-width="0.25"/>
<path d="M10.0004 10.7354C9.76948 10.7354 9.58545 10.5514 9.58545 10.3204V7.48043C9.58545 7.24947 9.76948 7.06543 10.0004 7.06543C10.2314 7.06543 10.4154 7.24947 10.4154 7.48043V10.3204C10.4154 10.5514 10.2314 10.7354 10.0004 10.7354Z" fill="#FF0101" stroke="#FF0101" stroke-width="0.25"/>
</svg>`;

@Component({
  selector: 'app-group-by',
  templateUrl: './group-by.component.html',
  styleUrls: ['./group-by.component.css']
})
export class GroupByComponent implements OnInit {

  isGroupByTableLoaded = true;

  constructor(public prospectService: ProspectService,
              public tableMenuService: TableMenuService) {
  }

  ngOnInit(): void {
  }

  validatorRenderer(instance, td, row, col, prop, value, cellProperties): void {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    let renderHTML: string = '';
    if (value) {
      if (td.classList.contains('invalidHotTableCell')) {
        renderHTML += `
                    ${value}
                    <i class="errorIcon">${cellErrorIcon}</i>
                    `;
      } else {
        renderHTML += `${value}`;
      }
    }
    td.innerHTML = renderHTML;
  }

  textValidator(value, callback) {
    if (value) {
      const textValidatorRegex = new RegExp(/^([^0-9]*)$/);
      textValidatorRegex.test(value) ? callback(true) : callback(false);
    } else {
      callback(true);
    }
  }

  multiLineTextRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    td.innerHTML = Handsontable.helper.stringify(value).replace(/(<([^>]+)>)/gi, '');
  }

  emailValidator(value, callback) {
    if (value) {
      const emailValidatorRegex = new RegExp(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/);
      emailValidatorRegex.test(value) ? callback(true) : callback(false);
    } else {
      callback(true);
    }
  }

  urlValidator(value, callback) {
    if (value) {
      const urlValidatorRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&\/=]*)/);
      urlValidatorRegex.test(value) ? callback(true) : callback(false);
    } else {
      callback(true);
    }
  }

  singleSelectTagsRenderer(instance, td, row, col, prop, value, cellProperties): void {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    let renderHTML: string = '';
    const tag = value;
    if (tag) {
      let h = 0, l = tag.length, i = 0;
      if (l > 0) {
        while (i < l) {
          h = (h << 5) - h + tag.charCodeAt(i++) | 0;
        }
      }
      const uniqueCode = Math.abs(h) % 10;
      const closeSVGIcon = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="closeIcon cursorPointer"><path d="M6.62394 7.6728L3.99994 5.0496L1.37594 7.6728C1.30718 7.74186 1.22546 7.79665 1.13547 7.83404C1.04548 7.87143 0.948987 7.89068 0.851537 7.89068C0.754087 7.89068 0.657597 7.87143 0.567606 7.83404C0.477614 7.79665 0.395894 7.74186 0.327137 7.6728C0.25808 7.60404 0.203282 7.52232 0.165892 7.43233C0.128501 7.34234 0.109253 7.24585 0.109253 7.1484C0.109253 7.05095 0.128501 6.95446 0.165892 6.86447C0.203282 6.77448 0.25808 6.69276 0.327137 6.624L2.95034 4L0.327137 1.376C0.25808 1.30724 0.203282 1.22552 0.165892 1.13553C0.128501 1.04554 0.109253 0.949048 0.109253 0.851598C0.109253 0.754148 0.128501 0.657658 0.165892 0.567667C0.203282 0.477675 0.25808 0.395955 0.327137 0.327198C0.395894 0.258141 0.477614 0.203343 0.567606 0.165953C0.657597 0.128562 0.754087 0.109314 0.851537 0.109314C0.948987 0.109314 1.04548 0.128562 1.13547 0.165953C1.22546 0.203343 1.30718 0.258141 1.37594 0.327198L3.99994 2.9504L6.62394 0.327198C6.69269 0.258141 6.77441 0.203343 6.86441 0.165953C6.9544 0.128562 7.05089 0.109314 7.14834 0.109314C7.24579 0.109314 7.34228 0.128562 7.43227 0.165953C7.52226 0.203343 7.60398 0.258141 7.67274 0.327198C7.7418 0.395955 7.79659 0.477675 7.83398 0.567667C7.87137 0.657658 7.89062 0.754148 7.89062 0.851598C7.89062 0.949048 7.87137 1.04554 7.83398 1.13553C7.79659 1.22552 7.7418 1.30724 7.67274 1.376L5.04954 4L7.67274 6.624C7.7418 6.69276 7.79659 6.77448 7.83398 6.86447C7.87137 6.95446 7.89062 7.05095 7.89062 7.1484C7.89062 7.24585 7.87137 7.34234 7.83398 7.43233C7.79659 7.52232 7.7418 7.60404 7.67274 7.6728C7.60398 7.74186 7.52226 7.79665 7.43227 7.83404C7.34228 7.87143 7.24579 7.89068 7.14834 7.89068C7.05089 7.89068 6.9544 7.87143 6.86441 7.83404C6.77441 7.79665 6.69269 7.74186 6.62394 7.6728Z" fill="${colorCode[uniqueCode]}"></path></svg>`;
      renderHTML += `<div class="selectedTagSection" style="background:${backGround[uniqueCode]}; border: 1px solid ${colorCode[uniqueCode]}; color: ${colorCode[uniqueCode]}">
                           <div class="selectedTagText"> ${tag} </div>
                           <button class="clearItemIcon"> <i> ${closeSVGIcon}</i> </button>
                       </div>`;
    }
    td.innerHTML = '<div class="multiSelectedTagDiv">' + renderHTML + '</div>';
    return td;
  }


  multiSelectTagsRenderer(instance, td, row, col, prop, value, cellProperties): void {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    let renderHTML: string = '';
    if (value) {
      value.forEach(tag => {
        let h = 0, l = tag.length, i = 0;
        if (l > 0) {
          while (i < l) {
            h = (h << 5) - h + tag.charCodeAt(i++) | 0;
          }
        }
        const uniqueCode = Math.abs(h) % 10;
        const closeSVGIcon = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="closeIcon cursorPointer"><path d="M6.62394 7.6728L3.99994 5.0496L1.37594 7.6728C1.30718 7.74186 1.22546 7.79665 1.13547 7.83404C1.04548 7.87143 0.948987 7.89068 0.851537 7.89068C0.754087 7.89068 0.657597 7.87143 0.567606 7.83404C0.477614 7.79665 0.395894 7.74186 0.327137 7.6728C0.25808 7.60404 0.203282 7.52232 0.165892 7.43233C0.128501 7.34234 0.109253 7.24585 0.109253 7.1484C0.109253 7.05095 0.128501 6.95446 0.165892 6.86447C0.203282 6.77448 0.25808 6.69276 0.327137 6.624L2.95034 4L0.327137 1.376C0.25808 1.30724 0.203282 1.22552 0.165892 1.13553C0.128501 1.04554 0.109253 0.949048 0.109253 0.851598C0.109253 0.754148 0.128501 0.657658 0.165892 0.567667C0.203282 0.477675 0.25808 0.395955 0.327137 0.327198C0.395894 0.258141 0.477614 0.203343 0.567606 0.165953C0.657597 0.128562 0.754087 0.109314 0.851537 0.109314C0.948987 0.109314 1.04548 0.128562 1.13547 0.165953C1.22546 0.203343 1.30718 0.258141 1.37594 0.327198L3.99994 2.9504L6.62394 0.327198C6.69269 0.258141 6.77441 0.203343 6.86441 0.165953C6.9544 0.128562 7.05089 0.109314 7.14834 0.109314C7.24579 0.109314 7.34228 0.128562 7.43227 0.165953C7.52226 0.203343 7.60398 0.258141 7.67274 0.327198C7.7418 0.395955 7.79659 0.477675 7.83398 0.567667C7.87137 0.657658 7.89062 0.754148 7.89062 0.851598C7.89062 0.949048 7.87137 1.04554 7.83398 1.13553C7.79659 1.22552 7.7418 1.30724 7.67274 1.376L5.04954 4L7.67274 6.624C7.7418 6.69276 7.79659 6.77448 7.83398 6.86447C7.87137 6.95446 7.89062 7.05095 7.89062 7.1484C7.89062 7.24585 7.87137 7.34234 7.83398 7.43233C7.79659 7.52232 7.7418 7.60404 7.67274 7.6728C7.60398 7.74186 7.52226 7.79665 7.43227 7.83404C7.34228 7.87143 7.24579 7.89068 7.14834 7.89068C7.05089 7.89068 6.9544 7.87143 6.86441 7.83404C6.77441 7.79665 6.69269 7.74186 6.62394 7.6728Z" fill="${colorCode[uniqueCode]}"></path></svg>`;
        renderHTML += `<div class="selectedTagSection" style="background:${backGround[uniqueCode]}; border: 1px solid ${colorCode[uniqueCode]}; color: ${colorCode[uniqueCode]}">
                           <div class="selectedTagText"> ${tag} </div>
                           <button class="clearItemIcon"> <i> ${closeSVGIcon}</i> </button>
                       </div>`;
      });
    }
    td.innerHTML = '<div class="multiSelectedTagDiv">' + renderHTML + '</div>';
    return td;
  }


}
