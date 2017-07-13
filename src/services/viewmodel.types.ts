import { JsonMember, JsonObject, TypedJSON } from 'typedjson';

// TODO(Alexey): Rename pageType to __type in viewmodel generation and get rid of it
TypedJSON.config({typeHintPropertyKey: 'pageType'});

@JsonObject
export class GeneralInformation {
  @JsonMember({isRequired: true})
  public maxSecondsInVr: number;
}

@JsonObject
export class MenuViewModel {
  @JsonMember({isRequired: true})
  public characterName: string;
}

@JsonObject
export class ToolbarViewModel {
  @JsonMember({isRequired: true})
  public hitPoints: number;

  @JsonMember({isRequired: true})
  public maxHitPoints: number;
}

@JsonObject
export class PassportScreenViewModel {
  @JsonMember({isRequired: true})
  public id: string;

  @JsonMember({isRequired: true})
  public fullName: string;

  @JsonMember({isRequired: true})
  public corporation: string;

  @JsonMember({isRequired: true})
  public email: string;
}

@JsonObject
export class PageViewModel {
  @JsonMember({isRequired: true})
  public menuTitle: string;

  public pageType: string;
}

@JsonObject
export class ActionData {
  @JsonMember({isRequired: true})
  public text: string;

  @JsonMember({isRequired: true})
  public eventType: string;

  @JsonMember
  public data: any;
}

@JsonObject
export class DetailsData {
  @JsonMember({isRequired: true})
  public header: string;

  @JsonMember({isRequired: true})
  public text: string;

  @JsonMember({elements: ActionData})
  public actions?: ActionData[];
}

@JsonObject
export class ListItemData {
  @JsonMember({isRequired: true})
  public text: string;

  @JsonMember
  public subtext?: string;

  @JsonMember
  public value?: string;

  @JsonMember
  public percent?: number;

  @JsonMember
  public progressBarColor?: string;

  @JsonMember
  public valueColor?: string;

  @JsonMember
  public hasIcon?: boolean;

  @JsonMember
  public icon?: string;

  @JsonMember
  public details?: DetailsData;

  @JsonMember
  public vid?: string;

  @JsonMember
  public tag?: string;

  // Internal fields. MUST NOT be set in ViewModel
  // (not validated now)
  @JsonMember
  public unread?: boolean;
}

@JsonObject
export class ListBody {
  // TODO(Andrei): Make required
  @JsonMember
  public pageId?: string;

  @JsonMember({isRequired: true})
  public title: string;

  @JsonMember({isRequired: true, elements: ListItemData })
  public items: ListItemData[];

  @JsonMember({elements: String})
  public filters?: string[];
}

@JsonObject
// TODO(Alexey) Rename to ListPageViewModel
// tslint:disable-next-line:class-name
export class list extends PageViewModel {
  @JsonMember({isRequired: true})
  public body: ListBody;
}

@JsonObject
// TODO(Alexey) Rename to EconomyPageViewModel
// tslint:disable-next-line:class-name
export class economy extends PageViewModel {
}

@JsonObject
// TODO(Alexey) Rename to TechnicalInfoPageViewModel
// tslint:disable-next-line:class-name
export class technical_info extends PageViewModel {
}

@JsonObject({knownTypes: [economy, list, technical_info]})
export class ApplicationViewModel {
  @JsonMember({isRequired: true})
  public _id: string;

  @JsonMember({isRequired: true})
  public timestamp: number;

  @JsonMember({isRequired: true})
  public general: GeneralInformation;

  @JsonMember({isRequired: true})
  public menu: MenuViewModel;

  @JsonMember({isRequired: true})
  public toolbar: ToolbarViewModel;

  @JsonMember({isRequired: true})
  public passportScreen: PassportScreenViewModel;

  @JsonMember({isRequired: true, elements: PageViewModel, refersAbstractType: true})
  public pages: PageViewModel[];
}
