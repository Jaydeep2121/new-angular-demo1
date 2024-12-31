export interface invites {
  visitor: string;
  location: string;
  host: string;
  checkIn: Date;
  checkOut: Date;
  comment: string;
  purpose: string;
  class: string;
  subType: string;     
}

export interface invitersResponseById {
  response: {
      returnNumber: number;
      errorMessage: string | null;
  };
  value: inviteData;
  }

export interface inviteResponse {
  returnNumber: number;
  errorMessage: string | null;
  status?: boolean;
  value: inviteData[];
  }
export interface inviteData {
  InviteId: number;
  visitorId: number;
  name: string;
  phone: string;
  address: string;
  country: resObject;
  state: resObject;
  city: resObject;
  expectedCheckinTime: string;
  expectedCheckoutTime: string;
  inviteDate:string;
  purpose: string;
  premises:string;
  comment: string;
  location: string;
  host: resObject;
  visitorType :visitorType;
  subType:subtypedata
  
  }
  export interface visitorType {
    name: string;
    id: number;
  }
  
  export interface subtypedata {
    name: string;
    id: number;
  }
export interface resObject {
  name: string;
  id: number;
  }

export interface hotListResponse {
  response: Response;
  value: Datum[];
}
export interface Datum {
  name: string;
  id: number;
}

export interface visitorList {
  message: string;
  exceptionError: string;
  status: boolean;
  data: visitorData;
}
export interface visitorData {
  visitorName: string;
  visitorId: number;
}