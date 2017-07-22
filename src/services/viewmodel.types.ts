import { JsonMember, JsonObject } from 'typedjson';

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

  @JsonMember({isRequired: true})
  // tslint:disable-next-line:variable-name
  public __type: string;

  @JsonMember({isRequired: true})
  public viewId: string;
}

@JsonObject
export class ActionData {
  @JsonMember({isRequired: true})
  public text: string;

  @JsonMember({isRequired: true})
  public eventType: string;

  @JsonMember({isRequired: true})
  public needsQr: boolean;

  @JsonMember
  public dangerous: boolean;

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

  // Only for normal lists (not sublists)
  @JsonMember
  public details?: DetailsData;

  // Only for sublists
  @JsonMember
  public deletable?: boolean;

  @JsonMember
  public viewId?: string;

  @JsonMember
  public tag?: string;

  // Internal fields. MUST NOT be set in ViewModel (not validated now)
  public unread?: boolean;
}

@JsonObject
export class ListBody {
  @JsonMember({isRequired: true})
  public title: string;

  @JsonMember({isRequired: true, elements: ListItemData })
  public items: ListItemData[];

  @JsonMember({elements: String})
  public filters?: string[];
}

@JsonObject
export class ListPageViewModel extends PageViewModel {
  @JsonMember({isRequired: true})
  public body: ListBody;
}

@JsonObject
export class EconomyPageViewModel extends PageViewModel {
}

@JsonObject
export class TechnicalInfoPageViewModel extends PageViewModel {
}

@JsonObject({knownTypes: [EconomyPageViewModel, ListPageViewModel, TechnicalInfoPageViewModel]})
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

  // Internal fields. MUST NOT be set in ViewModel (not validated now)
  @JsonMember
  public numUnreadChanges?: number;

  @JsonMember
  public numUnreadMessages?: number;
}
