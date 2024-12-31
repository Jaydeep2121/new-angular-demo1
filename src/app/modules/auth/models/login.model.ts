
export interface LOGIN_CREDENTIAL_PAYLOAD {
    username: string,
    password: string,
    schoolId: number,
    siteId: number,
    grant_Type: string,
    refresh_Token: string
}