/**
 * Created by sds25 on 9/5/17.
 */

const streetViewUrl = "https://maps.googleapis.com/maps/api/streetview";

const streetViewParams = {
    key: "AIzaSyCcLG-dRLxiRB22U9cSv1jaP6XxoOn5aSY",
    location: '',
    size: "600x300"
};


export function paramaterize(params) {
    let paramList = [];
    for (let p in params) {
        if (params.hasOwnProperty(p)) {
            paramList.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]))
        }
    }
    return paramList.join('&');

}

export function getStreetViewImage(address) {
    let params = JSON.parse(JSON.stringify(streetViewParams));  // hack way to copy object
    params['location'] = address;

    window.URL = window.URL || window.webkitURL;

    return new Promise((resolve, reject) => {
        fetch(streetViewUrl + '?' + paramaterize(params))
            .then((response) => {
                response.blob()
                    .then((imgBlob) => {
                        resolve(window.URL.createObjectURL(imgBlob))
                    }, (err) => {
                        reject(err)
                    })
            }, (err) => {
                reject(err);
            })
    })
}