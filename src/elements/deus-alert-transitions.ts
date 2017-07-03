import { Animation, Transition, Config } from 'ionic-angular';

const BACKDROP_OPACITY_ALERT_IOS: number = 0.6;
const BACKDROP_OPACITY_ASHEET_IOS: number = 0.6;


export function fixAlertTransitions(config: Config): void{
    config.setTransition('alert-pop-in', DeusAlertPopIn);
    config.setTransition('alert-pop-out', DeusAlertPopOut);
    config.setTransition('alert-md-pop-in', DeusAlertPopIn);
    config.setTransition('alert-md-pop-out', DeusAlertPopOut);
}


export function fixActionSheettTransitions(config: Config): void{
    config.setTransition('action-sheet-slide-in', DeusActionSheetSlideIn);
    config.setTransition('action-sheet-slide-out', DeusActionSheetSlideOut);
    config.setTransition('action-sheet-md-slide-in', DeusActionSheetSlideIn);
    config.setTransition('action-sheet-md-slide-out', DeusActionSheetSlideOut);
}

export class DeusAlertPopIn extends Transition {
  public init() {

    const ele = this.enteringView.pageRef().nativeElement;
    const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    const wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
    backdrop.fromTo('opacity', 0.01, BACKDROP_OPACITY_ALERT_IOS);

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}

export class DeusAlertPopOut extends Transition {
  public init() {

    const ele = this.leavingView.pageRef().nativeElement;
    const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    const wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
    backdrop.fromTo('opacity', BACKDROP_OPACITY_ALERT_IOS, 0);

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}

export class DeusActionSheetSlideIn extends Transition {
  init() {
    const ele = this.enteringView.pageRef().nativeElement;
    const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    const wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.01, BACKDROP_OPACITY_ASHEET_IOS);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
  }
}


export class DeusActionSheetSlideOut extends Transition {
  init() {
    const ele = this.leavingView.pageRef().nativeElement;
    const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    const wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', BACKDROP_OPACITY_ASHEET_IOS, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(backdrop).add(wrapper);
  }
}
