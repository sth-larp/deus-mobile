import { Animation  } from 'ionic-angular';
import { Transition } from 'ionic-angular';

const BACKDROP_OPACITY: number = 0.6;

export class DeusAlertPopIn extends Transition {
  public init() {

    const ele = this.enteringView.pageRef().nativeElement;
    const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    const wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
    backdrop.fromTo('opacity', 0.01, BACKDROP_OPACITY);

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
    backdrop.fromTo('opacity', BACKDROP_OPACITY, 0);

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
