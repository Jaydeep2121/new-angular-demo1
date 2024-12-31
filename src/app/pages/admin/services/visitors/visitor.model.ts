export interface visitor {
  visitorId: number;
  firstName: string;
  lastName: string;
  filePath: string | null;
  fileName: string | null;
  phoneNumber: string;
  email: string;
  address: string;
  country: {
    name: string;
    id: number;
  };
  state?: State; // Optional, as it may not be present in all responses
  city?: City; // Optional, as it may not be present in all responses
  isBlocked: string;
  isVIP: string;
  visitCount: number;
}

export interface visitorResponseById {
response: {
    returnNumber: number;
    errorMessage: string | null;
};
value: Visitor;
}

export interface visitorResponse {
  response: {
      returnNumber: number;
      errorMessage: string | null;
  };
  value: Visitor[];
}

export interface Visitor {
  name?:string
  visitorId: number
  photo: string
  firstName: string
  lastName: string
  fileName: string
  phoneNumber: string
  email: string
  address: string
  city: number
  state: number
  country: number
  entryBy: number
  entryDate: string
  schoolId: number
  siteId: number
  isBlocked: boolean
  isVIP: boolean
  typeOfVIP: number
  visitCount: number
  reason: any
  whomToMeet: number
  inviteId: number
}

export interface locationResponse {
  response: {
      returnNumber: number;
      errorMessage: string | null;
    };
    value: locData[];
}

interface City {
  name: string;
  id: number;
}

interface State {
  name: string;
  id: number;
  cities: City[];
}

interface locData {
  name: string;
  id: number;
  states: State[];
}


export interface vipStatusResponse {
  response: vipStatusRes
  value: vipStatusValue[]
}

export interface vipStatusRes {
  returnNumber: number
  errorMessage: string
}

export interface vipStatusValue {
  value: string;
  text: string;
}

export interface getWatchListResponse {
  response: watchListResponse
  value: watchListValue[]
}

export interface watchListResponse {
  returnNumber: number
  errorMessage: any
}

export interface watchListValue {
  id: number
  visitorId: number
  remarks: string
  entryDate: string
  name: string
}

export interface getMultipleInviteResponse {
  response: MultipleInviteResponse
  value: MultipleInviteValue[]
}

export interface MultipleInviteResponse {
  returnNumber: number
  errorMessage: any
}

export interface MultipleInviteValue {
  visitorId: number
  name: string
  location: string
  host: number
  expectedCheckinTime: string
  expectedCheckoutTime: string
  comment: string
  purpose: string
  group: string
  subType: number
}
export interface visitorCategoryResponse {
  response: categoryResponse
  value: categoryValue[]
}

export interface categoryResponse {
  returnNumber: number
  errorMessage: any
}

export interface categoryValue {
  value: string
  text: string
}
