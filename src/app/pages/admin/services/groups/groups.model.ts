export interface manageGroups {
  // id: string;
  groupName: string;
  // type: string;
}


export interface GroupsResponse {
response: {
  returnNumber: number;
  errorMessage: string;
};
  value: Groups[];
}
export interface GroupsResponsenew {
returnNumber: number;
errorMessage: string;
  value: Groups[];
}


export interface Groups {
id: number;
groupName: string;
count:number
  visitorId: number;
  firstName: string;
  lastName: string;
  filePath: string;
  fileName: string;
  phoneNumber: string;
  email: string;
  address: string;
  country: locData;
  state: State; // Optional, as it may not be present in all responses
  city: City; // Optional, as it may not be present in all responses
  isBlocked: string;
  isVIP: string;
  visitCount: number;
  typeOfVIP:TypeOfVIP
}
interface TypeOfVIP {
  codeDesc:string;
  codeId:number
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