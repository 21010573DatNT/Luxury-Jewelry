import { useSelector } from "react-redux"

export const TakePermissions = () => {
    const account = useSelector((state) => state.account)
    const permissions = account.permissions
    return permissions
}