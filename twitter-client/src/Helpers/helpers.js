const clearLocalStorageData = () => {
    delete localStorage['accessToken'];
    delete localStorage['refreshToken'];
    delete localStorage['user']
    window.location.reload(false); 
}

export default clearLocalStorageData;