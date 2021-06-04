
const initialState = {
    user: null,
    professionnals:[],
    userToken: null,
    isUserLogged: false,
    modalBody:"",
    modalTitle: "",
    modalButtonDisabled: false,
    conditionsAccepted: false,
    showModale: false,
    modalImage: null,
    redirect: false,
    successMsgPasswordChange: "",
}

export const userReducer = (state = initialState, action) =>{
    switch(action.type){
        case "REGISTER":
            return {
                ...state,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
                modalButtonDisabled: action.modalButtonDisabled,
                modalImage:action.modalImage,
                isUserLogged: action.isUserLogged
            };
            
        case "SHOW_CONDITIONS":
            return {
                ...state,
                showModale: action.showModale,
                modalTitle:action.modalTitle,
                modalBody:action.modalBody,
                modalButtonDisabled: action.modalButtonDisabled,
            } 

        case "LOGIN":
            return{
                ...state,
                user: action.user,
                userToken: action.token,
                isUserLogged: action.isUserLogged,
                redirect: action.redirect,
                // showModale:action.showModale,
                // modalTitle:action.modalTitle,
                modalBody:action.modalBody
                // modal: true
            }; 

        case "LOGIN_FAIL":
            return{
                ...state,
                user: null,
                userToken: null,
                isUserLogged: action.isUserLogged,
                redirect: action.redirect,
                // showModale:action.showModale,
                // modalTitle:action.modalTitle,
                modalBody:action.modalBody 
            };

        case "GET-PRO-SUCCESS":
            return{
                ...state,
                professionnals: action.professionnals
            };

        case "LOGOUT":
            return{
                ...state,
                user: action.user,
                userToken: action.token,
                isUserLogged: action.isUserLogged,
                // redirect: action.redirect
            };
        case "CHANGE-PASSWORD-SUCCESS":
            console.log(initialState.modalBody)
            return{
                ...state,
                successMsgPasswordChange:action.successMsgPasswordChange
            }            
        default:
            return state;
    }
} 