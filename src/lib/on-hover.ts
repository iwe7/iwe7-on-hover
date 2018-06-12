import { tap, take, filter, switchMap } from 'rxjs/operators';
import { onTouchStart, onTouchEnd, onTouchCancel } from 'iwe7-util';
import { ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { Directive } from '@angular/core';
import { merge } from 'rxjs';
@Directive({ selector: '[ngHover],[ngHoverTime],[ngHoverStop]' })
export class NgOnHoverDirective {
    // 返回
    @Output() ngHover: EventEmitter<any> = new EventEmitter();
    // 事件
    @Input() ngHoverTime: number = 200;
    // 阻止事件冒泡
    @Input() ngHoverStop: boolean = false;
    // 是否可连击
    @Input() ngHoverSingle: boolean = false;
    // 附加数据
    @Input() ngHoverData: any;
    isHovering: boolean = false;
    constructor(
        public ele: ElementRef
    ) { }
    ngOnInit() {
        const start = onTouchStart(this.ele.nativeElement);
        const end = onTouchEnd(this.ele.nativeElement);
        const cancel = onTouchCancel(this.ele.nativeElement);
        start.pipe(
            tap(res => {
                if (this.ngHoverStop) {
                    res.preventDefault();
                    res.stopPropagation();
                }
            }),
            filter(res => !this.isHovering || !this.ngHoverSingle),
            tap(res => {
                this.ngHover.emit({
                    type: 'start',
                    ele: this.ele.nativeElement,
                    data: this.ngHoverData
                });
                this.isHovering = true;
            }),
            switchMap(res => {
                return merge(
                    end, cancel
                ).pipe(
                    take(1),
                    tap(res => {
                        setTimeout(() => {
                            this.isHovering = false;
                            this.ngHover.emit({
                                type: 'end',
                                ele: this.ele.nativeElement,
                                data: this.ngHoverData
                            });
                        }, this.ngHoverTime);
                    })
                );
            })
        ).subscribe();
    }
}
