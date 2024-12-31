export interface schoolResponse {
    response: Response
    value: Value[]
  }
  
  export interface Response {
    returnNumber: number
    errorMessage: any
  }
  
  export interface Value {
    schoolId: number
    schoolName: string
    fileName: any
    entryDate: string
  }