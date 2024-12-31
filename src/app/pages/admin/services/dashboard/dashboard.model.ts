export interface DashboardResponse {
    response: Response
    value: Value
  }
  
  export interface Response {
    returnNumber: number
    errorMessage: string
  }
  
  export interface Value {
    count: number
  }
  