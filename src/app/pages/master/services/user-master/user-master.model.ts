export interface Response {
  response: {
    returnNumber: number;
    errorMessage: string;
  };
}

export interface SchoolSiteResponse extends Response {
  value: SchoolSite[];
}

export interface SchoolSite {
    name: string;
    id: number;
    site: Site[];
}

export interface Site {
    name: string;
    id: number;
}

export interface UserMasterRequest {
    userId: number,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    schoolId: number | null,
    siteId: number | null,
    type:number
}

export interface UserMasterResponse extends Response {
    value: UserMaster[]
}

export interface UserMaster {
    userId: number,
    firstName: string,
    lastName: string,
    userName: string,
    schoolName: string,
    siteName: string,
    siteId: number,
    schoolId: number
}