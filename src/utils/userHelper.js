// src/utils/userHelper.js
export const getUserDisplayType = (userType) => {
    switch(userType) {
        case 'Admin': return 'Admin';
        case 'Donor':
        case 'Receiver':
        case 'Both':
        default: return 'User';
    }
};

export const normalizeUser = (user) => {
    if (!user) return null;
    
    return {
        ...user,
        displayUserType: getUserDisplayType(user.userType),
        // Hide original userType from frontend
        userType: getUserDisplayType(user.userType)
    };
};