const clearLocalStorageData = () => {
    delete localStorage['accessToken'];
    delete localStorage['refreshToken'];
    delete localStorage['user'];
    delete localStorage['profilePicLocation']
    window.location.reload(false);
}

const saveUserDataToLocal = (RESPONSE_DATA) => {
    localStorage.setItem('user', JSON.stringify(RESPONSE_DATA.user));
    localStorage.setItem("accessToken", RESPONSE_DATA.accessToken);
    localStorage.setItem("refreshToken", RESPONSE_DATA.refreshToken);
    localStorage.setItem('profilePicLocation', `https://firebasestorage.googleapis.com/v0/b/twitter-clone-a4e87.appspot.com/o/${RESPONSE_DATA.user.profileUrl}?alt=media`)
}

const saveNewProfilePicture = (profileUrl) => {
    localStorage.setItem('profilePicLocation', `https://firebasestorage.googleapis.com/v0/b/twitter-clone-a4e87.appspot.com/o/${profileUrl}?alt=media`)
}

module.exports ={
    saveUserDataToLocal:saveUserDataToLocal,
    clearLocalStorageData:clearLocalStorageData,
    saveNewProfilePicture:saveNewProfilePicture
}