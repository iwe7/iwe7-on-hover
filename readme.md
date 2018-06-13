```ts
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
```

save
