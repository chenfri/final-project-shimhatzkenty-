export interface User
{
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string,
    loggedIn: boolean,
    dateTime: string,

    onBehalf: boolean,
    nameAssistant: string,
    relationship: string,
    contact: string,
    description:string,

    student: boolean,
    range: number,
    age: string,
    id: string,
    college: string

    elderly: boolean,
    volunteer:boolean,
    Admin: boolean,

    hideForm: boolean,
    hideMusic: boolean,
}

