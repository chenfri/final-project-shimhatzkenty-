export interface User
{
    email: string,
    password: string,
    fullName: string,
    phone: string,
    street: string,
    city: string,
    message: string,
    
    loggedIn: boolean,
    dateTime: string,

    onBehalf: boolean,
    nameAssistant: string,
    numOfAssistant: number,
    relationName: string,
    orgName: string,
    contact: string,
    description:string,

    student: boolean,
    // range: number,
    age: string,
    id: string,
    college: string

    elderly: boolean,
    volunteer:boolean,
    Admin: boolean,

    hideForm: boolean,
    hideMusic: boolean,
    status: number
    comments: string
}

