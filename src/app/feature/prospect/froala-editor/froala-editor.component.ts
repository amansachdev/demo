import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/url.min.js';
import {NzModalRef} from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-froala-editor',
  templateUrl: './froala-editor.component.html',
  styleUrls: ['./froala-editor.component.css']
})
export class FroalaEditorComponent implements OnInit {
  private readonly mergeTagIcon = `<svg class="cardSvg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="#pathBlue" d="M1 14.6255H15C15.3454 14.6255 15.625 14.3456 15.625 14.0005V2.00049C15.625 1.65537 15.3454 1.37549 15 1.37549H1C0.654557 1.37549 0.375 1.65537 0.375 2.00049V14.0005C0.375 14.3456 0.654557 14.6255 1 14.6255ZM14.375 2.62549V13.3755H1.625V2.62549H14.375Z" fill="#888888" stroke="#888888" stroke-width="0.25"/><path id="#pathBlue" d="M8.31565 7.6518C9.0823 7.6518 9.7038 7.0303 9.7038 6.26365C9.7038 5.49699 9.0823 4.87549 8.31565 4.87549C7.54899 4.87549 6.92749 5.49699 6.92749 6.26365C6.92749 7.0303 7.54899 7.6518 8.31565 7.6518Z" fill="#888888" stroke="#888888" stroke-width="0.25"/><path id="#pathBlue" d="M6.64371 11.1255H9.98786C10.4124 11.1255 10.7566 10.7814 10.7566 10.3568C10.7566 9.0088 9.6638 7.91602 8.31579 7.91602H8.31579C6.96778 7.91602 5.875 9.0088 5.875 10.3568V10.3568C5.875 10.7814 6.21916 11.1255 6.64371 11.1255Z" fill="#888888" stroke="#888888" stroke-width="0.25"/></svg>`;
  froalaEditorConfig: any;
  @Input() froalaEditorContent: any;
  @Output() onSubmitMultiLineText: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancelMultiLineText: EventEmitter<any> = new EventEmitter<any>();
  isContentChanged: boolean = false;
  cols = [];

  constructor(private nzModalRef: NzModalRef) {
  }

  ngOnInit(): void {
    this.froalaEditorConfig = {
      placeholderText: 'Type here to update multi line text',
      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'formatOL', 'formatUL', 'insertLink'],
      charCounterCount: true,
      immediateAngularModelUpdate: true,
      attribution: false,
      autoStart: true,
      pluginsEnabled: ['quote', 'charCounter', 'fontSize', 'link', 'lists'],
      key: 'VCC6kD3H5I3C2c1C-22rprdD3jkyD4C3C2B3C4B1G1H4B2D3==',
      events: {
        'contentChanged': () => {
          this.isContentChanged = true;
        }
      }
    };


  }

  onCancel() {
    this.onCancelMultiLineText.emit();
    this.nzModalRef.close();
  }

  onSubmit() {
    this.onSubmitMultiLineText.emit(this.froalaEditorContent);
    this.nzModalRef.triggerOk();
  }
}
