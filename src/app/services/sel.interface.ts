export interface IuserDetail {
    id: number
    firstName: any
    lastName: any
    username: string
    jwtToken: string
    userID: string
    staffid: number
    defaultSiteId: number
    orgId: number
    accessLevel: number
    admincred: string
    loginHID: string
    sessionYearTxt: string
    toApps: string
}

export interface IappList {
    personaID: number;
    personaName: string;
    personaAppName: string;
    appIcon: string;
    appsURL: string;
    navigateURL: string;
    activeStatus?: boolean;
    color?: string;
}

export interface IappraiseeForm {
    yearNumber: number
    yearStart: string
    yearEnd: string
    appraisalYear: string
    startDate: string
    endDate: string
    status: string
    linkStatus: string
    apsStatus: string
    formStep: string
    reqId: string
}
export interface IappraiseeRatingTable {
    sNo: number
    rowSpan: number
    mainAspects: string
    id: number
    sunAspectid: number
    subAspectName: string
    aspectRating: number
    subAspectRating: any
    appraiseeJustification: any
    appraiseeComments: any
    appraiseeRating: number
    appraiserComments?: any
    appraiserJustification?: any
    aprAspectRating?: any
    aprFormAspectid?: any
    aprFormSubAspectId?: any
    aprSubAspectRating?: any
    appraiserRating?: any
    errorStatus?: boolean
    errorText?: string
}

export interface IappraiseeRating {
    id: number
    mainAspects: string
    appraiseeRating: any
    appraiserRating?: any
    subAspect: IappraiseeRatingSubAspect[],
    aprResendFlag?: string
}
  
export interface IappraiseeRatingSubAspect {
    id: number
    sunAspectid: number
    subAspectName: string
    formAspectid: any
    aspectRating: any
    formSubAspectId: any
    subAspectRating: any
    appraiseeJustification: any
    appraiseeComments: any
    appraiserComments?: any
    appraiserJustification?: any
    aprAspectRating?: any
    aprFormAspectid?: any
    aprFormSubAspectId?: any
    aprSubAspectRating?: any
    apprasierFormFeedId?: any
    aprFeedID?: any
}

export interface Irating {
    rating: number
    ratingName: string
}

export interface IratingTableHeader {
    justification: string
    comments: string
}

export interface Iquestion {
    questionGrpId: number
    title: string
    questionDescription: string
    questions: IquestionList[]
}
  
export interface IquestionList {
    questionGrpId: number
    name: string
    qUestionDescription: string
    questionAnswerType: string
    answerControlType: string
    answerOption: any
    formQuestionId: any
    formQuestionResponse: any
    aprFormQuestionId?: any
    aprFormQuestionResponse?: any
    aprFeedID?: any
    questionId?: any
    options?: any
    errorStatus?: boolean
    errorText?: string
    setOptions?: any[]
    selectedValue?: any
    ratingIndexValue?: any
    selectedValueAppraiser?: any
}

export interface IappraiserList {
    staffID: number
    staffName: string
    staffNo: number
    grade: string
    designation: string
    loc: string
    reqId: number
    apsFormStatus: string
    aprFormStatus: string
    appStatus: string
    aprStatus: string
    appraiserList?: string
    appraiserImage?: string
    feedID?: number
    gender: string
    photoPath: string
}

export interface IreviewerList {
    staffID: number
    staffName: string
    staffNo: number
    grade: string
    designation: string
    loc: string
    reqId: number
    apsStatusFlag: string
    apsFormStatus: string
    aprFormStatus: any
    aprFeedID: any
    revStatus: any
    revFeedID: any
    reviewerImage?: string
    feedID?: number
    appraiser?: string
    gender: string
    photoPath: string
}

export interface IuserSelect {
    userSysId: number
    academicYear: any
    userID: string
    staffid: number
    userName: string
    defaultSiteId: number
    category: string
    userPassword: any
    orgId: number
    orgName: any
    adsServerName: any
    staffNumber: any
    locationId: any
    displayName: any
    siteName: any
    roleNames: any
    roleIDs: any
    org_Logo: any
    toApps: any
    personaID: any
    admincred: any
    loginHID: any
    sessionYearTxt: any
    logdecimalype: any
    accessLevel: any
    personaName: any
    defaultPersona: any
    consultantId: any
    randNo: any
}

export interface Ibreadcrumb {
    label: string
    url: string
}

export interface IappraisalRating {
    id: number
    applicaitionType: string
    overallRating: number
    staffName: string
    reviewerComments: any
    finalRevRating?: any
    revComments?: string
}

export interface IreviewerChart {
    id: number
    reqId: number
    aspectId: number
    aspectName: string
    aspectOrderNo: number
    aspectRating: number
    staffDetails: IchartStaffDetail[]
}
export interface IchartStaffDetail {
    staffId: number
    staffName: string
    applicaitionType: string
    rating: number
}

export interface IappraiseeFeedbackList {
    staffName: string
    aprStatusDesc: string
    reqId: number
    aprStatus: string
    feedId: number
    aprStaffId: number
    appraiserImage?: string
    gender: string
    photoPath: string
}
export interface IappraiseeFeedbackQuestion {
    questionGrpId: number
    title: string
    questionDescription: any
    questions: IappraiseeFeedbackQuestionList[]
}
export interface IappraiseeFeedbackQuestionList {
    questionId: number
    questionGrpId: number
    name: string
    questionDescription: any
    questionAnswerType: string
    answerControlType: string
    answerOption?: string
    options?: string[]
    formQuestionId: any
    formQuestionResponse: any
    aprFormQuestionId: any
    aprFormQuestionResponse: any
    appraiseeVisible: any
    appraiserVisible: any
    reviewerVisible: any
    acceptanceVisible: any
    aprFeedID: any
    setOptions?: any[]
    selectedValue?: string
    ratingIndexValue?: any
}

export interface IfinalRecommendation {
    id: number
    formType: string
    aprFeedId: number
    staffName: string
    promoRecommend: string
    cashAwardRecommend: string
    enhanceRecommend: string
}

export interface Iyear {
    yearNumber: number
    appraisalYear: string
    yearStart: string
    yearEnd: string
    yearActiveFlag: string
}
export interface IquestionYear {
    yearName: number
    yearValue: string
}

export interface ImenuList {
    id: number
    name: string
    url: any
    imgUrl: any
    subMenu: IsubMenuList[]
}
export interface IsubMenuList {
    title: string
    menu: IsubMenu[]
}
export interface IsubMenu {
    id: number
    name: string
    url: string
}

export interface IgradeCategoryList {
    categoryId: number
    categoryName: string
}
export interface IgradeList {
    gradeId: number
    gradeName: string
}
export interface IquestionGroupList {
    quesGrdMapId: number
    questGrpId: number
    gradeCatId: number
    gradeId: number
    apsVisibleValue: string
    aprVisibleValue: string
    revVisibleValue: string
    fedVisibleVal: string
    question: string
    grageCat: string
    gradeSpecificVal: number
    gradeSpecificText: string
    gradeName: string
    apsVisibleText: string
    aprVisibleText: string
    revVisibleText: string
    fedVisibleText: string
    quesGrdEffYear: number
    quesGrdClosYear: any
    editFlag: string
    deleteFlag: string
    closureYearClear: string
}
export interface IquestionMapDialog {
    selectedQuestion: IquestionGroupList
    gradeCategory: IgradeCategoryList[]
    selectedYear: Iyear
    userDetail: IuserDetail
    userSelected: IuserSelect
}
export interface IquestionGroupListPopup {
    questGrpId: number
    quesGrpQuestionName: string
    quesGrpQuestionDesc: any
    quesGrpOrder: number
    editFlag: any
}

export interface IhrView {
    staffId: number
    gradeCatName: string
    empName: string
    status: string
    apsRating: any
    gradeLocation: string
    empDetails: IhrViewDetail[]
    photoLink: string
    gender: string
    reqId: number
    feedId: number
}
export interface IhrViewDetail {
    desigination: string
    appType: string
    aprStaffId: number
    aprStaffName: string
    slno: number
    aprRevRating: any
    feedId: number
}

export interface IhrViewTable {
    staffId: number
    gradeCatName: string
    empName: string
    status: string
    gradeLocation: string
    apsRating: any
    aprRating: IhrViewDetail[]
    appraiser: string
    aprRatingExcel: IhrViewTableExcel[]
    revRating: IhrViewDetail[]
    revRatingExcel: IhrViewTableExcel[]
    reviewer: string
    appraiseeImage?: string
    appraiseeNoImage?: string
    photoLink: string
    gender: string
    empDetails: IhrViewDetail[]
    reqId: number
    feedId: number
}
export interface IhrViewTableExcel {
    name: string
    rating: string
}