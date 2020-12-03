function calcTime(city, offset) {

    // create Date object for current location
    var d = new Date();
   
    // get UTC time in msec
    var utc = d.getTime();
   
    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));
   
    // return time as a string
    return "The local time in " + city + " is " + nd.toLocaleString();
}


calcTime('malden',
