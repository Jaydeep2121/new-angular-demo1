export interface MultipleRes {
    response: Response
    value: Value
  }
  
  export interface MultipleResponse {
    returnNumber: number
    errorMessage: string
  }
  
  export interface Value {
    visitorId: any[]
  }
