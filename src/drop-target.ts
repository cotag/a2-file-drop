import {ElementRef} from 'angular2/core';
import {Directive, OnInit, OnDestroy} from 'angular2/core';
import {DropService} from './drop-service';


@Directive({
    selector: '[drop-target]',
    // If added as a provider then a new instance is created for every DropTarget
    // this is not desirable and as drop service should be available application wide
    // it should be added to the initial bootstrap
    //providers: [DropService],
    inputs: [
        'bind: drop-target',        // defaults to self, otherwise you can define a valid querySelector
        'highlight: drop-indicate', // defines the hover class to apply, defaults to: drop-indicate
        'stream: drop-stream'       // name of the stream the files should be sent to
    ]
})
export class DropTarget implements OnInit, OnDestroy {
    stream: string;
    highlight: string = 'drop-indicate';
    bind: string;

    private _element: any;
    private _unreg: () => void;


    constructor(elementRef: ElementRef, private _dropService: DropService) {
        this._element = elementRef.nativeElement;
    }


    // Register the element you want to recieve drop events
    ngOnInit() {
        var self = this;

        if (self.bind) {
            self._element = document.querySelector(self.bind);
        }

        self._unreg = self._dropService.register(self.stream, self._element, self._doHighlight.bind(self));
    }

    // Ensure all the bindings and classes are removed
    ngOnDestroy() {
        this._unreg();

        // In case the drop-target is another element (not the ElementRef)
        this._doHighlight(false);
    }


    // Applies the hover class to the element
    private _doHighlight(state: boolean) {
        if (state) {
            this._element.classList.add(this.highlight);
        } else {
            this._element.classList.remove(this.highlight);
        }
    }
}
