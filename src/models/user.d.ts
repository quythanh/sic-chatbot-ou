
interface IUser{
    user_id?:number|undefined
    username: string
    password ?: string
    full_name?: string
    email?: string
    status?: boolean
    img?:string
    role_id?: number
}



export default IUser