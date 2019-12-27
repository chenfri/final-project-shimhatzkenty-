export interface User
{
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string,
    loggedIn: boolean,

    onBehalf: boolean,
    nameAssistant: string,
    relationship: string,

    student: boolean
    range: number,
    age: number,
    id: string,
    college: string

    elderly: boolean,
    volunteer:boolean,
    Admin: boolean,

    hideForm: boolean,
    hideMusic: boolean,
}

