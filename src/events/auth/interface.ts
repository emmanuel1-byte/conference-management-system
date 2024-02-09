import { $Enums } from "@prisma/client"

export interface SignUpData {
    fullname: string
    email: string
    role: $Enums.Role
    password: string
}