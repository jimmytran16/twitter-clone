const clearLocalStorageData = () => {
    delete localStorage['accessToken'];
    delete localStorage['refreshToken'];
    delete localStorage['user']
    window.location.reload(false);
}

const saveUserDataToLocal = (RESPONSE_DATA) => {
    localStorage.setItem('user', JSON.stringify(RESPONSE_DATA.user));
    localStorage.setItem("accessToken", RESPONSE_DATA.accessToken);
    localStorage.setItem("refreshToken", RESPONSE_DATA.refreshToken);
}

module.exports ={
    saveUserDataToLocal:saveUserDataToLocal,
    clearLocalStorageData:clearLocalStorageData
}