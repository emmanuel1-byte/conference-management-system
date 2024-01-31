import { $Enums } from "@prisma/client"

export interface SignUp {
    fullName: string
    email: string
    role:  $Enums.Role
    password: string
}

export interface SignIn {
    email: string,
    password: string
}

export interface UpdateRefreshToken {
    id: string
}
