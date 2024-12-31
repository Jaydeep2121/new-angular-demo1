export interface siteMaster {
    response: siteResponse
    value: siteValue[]
  }
  
  export interface siteResponse {
    returnNumber: number
    errorMessage: any
  }
  
  export interface siteValue {
    value: string
    text: string
  }
  

  export interface getSiteMasterResponse {
    response: siteMasterResponse
    value: siteMasterValue[]
  }
  
  export interface siteMasterResponse {
    returnNumber: number
    errorMessage: any
  }
  
  export interface siteMasterValue {
    siteId: number
    schoolId: number
    schoolName: string
    siteName: string
    entryDate: string
  }
  
  export interface saveSchoolSitePayload {
    schoolId: number
    siteName: string[]
  }

  export interface saveSchoolSiteResponse {
    returnNumber: number
    errorMessage: string
  }
  
  