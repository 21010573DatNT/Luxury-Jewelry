import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

export const TakeUserID = () => {
    const user = useSelector((state) => state.user);
    let user_id;
    if (user.token) {
        user_id = jwtDecode(user.token).id;
    } else {
        user_id = "";
    }
    const userName = user.fullName;

    const data = {
        user_id: user_id,
        userName: userName,
    };
    return data;
};
