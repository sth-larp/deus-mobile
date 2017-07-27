import { JsonMember, JsonObject } from 'typedjson';
import { QrType } from "deus-qr-lib/lib/qr.type";

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

  @JsonMember
  public insurance?: string;
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

  // If set, activating this action will start QR scanning.
  // (potentially without type validation).
  @JsonMember
  public needsQr?: boolean;

  // To proceed, user will need to scan a QR with type equal to needsQr.
  @JsonMember
  public needsQrOfType?: number;

  @JsonMember
  public destructive: boolean;

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
export class SublistItemData {
  @JsonMember({isRequired: true})
  public text: string;

  @JsonMember({isRequired: true})
  public deletable: boolean;
}

export class AddItemAction {
  @JsonMember({isRequired: true})
  public buttonText: string;

  @JsonMember({isRequired: true})
  public inputDialogTitle: string;

  @JsonMember
  public inputDialogMessage?: string;

  @JsonMember({isRequired: true})
  public inputType: string;  // "text", "number"...
}

// A sublist is a list of items that can be added or removed.
// It has OK/Cancel buttons. When OK is pressed, an event is sent
// that contains the new list of items.
@JsonObject
export class SublistBody {
  @JsonMember({isRequired: true})
  public title: string;

  @JsonMember({isRequired: true})
  public eventType: string;

  // Tag will be passed with any every sent alongside with the new items.
  // It can be used to tell which system is being administrated.
  @JsonMember({isRequired: true})
  public eventTag: string;

  @JsonMember({isRequired: true, elements: SublistItemData})
  public items: SublistItemData[];

  @JsonMember
  public addAction?: AddItemAction;
}

@JsonObject
export class ListItemData {
  @JsonMember({isRequired: true})
  public text: string;

  @JsonMember
  public subtext?: string;

  @JsonMember
  public value?: string;

  // Timestamp in seconds since Unix epoch (1970/01/01), UTC.
  // If present, replaces the value.
  @JsonMember
  public unixSecondsValue?: number;

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

  // At most one of 'details' and 'sublist' must be set.
  @JsonMember
  public details?: DetailsData;

  // At most one of 'details' and 'sublist' must be set.
  @JsonMember
  public sublist?: SublistBody;

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
