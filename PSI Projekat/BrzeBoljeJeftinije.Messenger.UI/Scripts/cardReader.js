/*
    Ovo je javascript biblioteka za komunikaciju sa ekstenzijom.
    Koristi se na sajtu koji bi hteo da pristupi licnoj karti
*/


cardReader = {};

/* 
   ID-jevi ekstenzije, izmeniti po potrebi.
   ID za Chrome dodeljuje Google prodavnica
   ID za Firefox stoji u manifestu
*/
cardReader.chromeID = 'iikmofkdhekjefoioggagppkepjfnbbp'
cardReader.firefoxID = 'messenger.cardreader@brzeboljejeftinije.rs'

cardReader.init = function () {
    cardReader.requestCount=0
    var nativeHostResponded = false;

    var ack_wait_timeout = 10000;
    cardReader.promises = {}
    cardReader.rejects = {}

    function isChrome() {
        var isChromium = window.chrome,
          winNav = window.navigator,
          vendorName = winNav.vendor,
          isOpera = winNav.userAgent.indexOf("OPR") > -1,
          isIEedge = winNav.userAgent.indexOf("Edge") > -1,
          isIOSChrome = winNav.userAgent.match("CriOS");

        if (isIOSChrome) {
            return true;
        } else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
            return true;
        } else {
            return false;
        }
    }
    if (isChrome()) {
        cardReader.extensionId = 'chrome-extension://' + cardReader.chromeID + '/';
    }
    else {
        cardReader.extensionId = cardReader.firefoxID;
    }

    function listener(event) {
        if (event.data.source == cardReader.extensionId) {
            if (event.data.status == "OK") {
                cardReader.promises[event.data.request.requestId](event)
            }
            else {
                cardReader.rejects[event.data.request.requestId](event)
            }
        }
    }

    window.addEventListener('message', listener);
    setTimeout(function () {
        
        }, ack_wait_timeout);
}
cardReader.encrypt=async function(payload)
{
    promise = new Promise(function (resolve, reject) {
        var rqId = cardReader.requestCount++;
        cardReader.promises[rqId] = resolve;
        cardReader.rejects[rqId] = reject;
        cardReader.sendMessage({ "type": "encrypt", "payload": btoa(payload), "requestId":  rqId})
    });
    var result=await promise;
    return result.data.payload;
}
cardReader.sign=async function(payload)
{
    promise = new Promise(function (resolve, reject) {
        var rqId = cardReader.requestCount++;
        cardReader.promises[rqId] = resolve;
        cardReader.rejects[rqId] = reject;
        cardReader.sendMessage({ "type": "sign", "payload": payload, "requestId":  rqId})
    });
    var result=await promise;
    return result.data.payload;
}
cardReader.getCertificate = async function () {
    promise = new Promise(function (resolve, reject) {
        var rqId = cardReader.requestCount++;
        cardReader.promises[rqId] = resolve;
        cardReader.rejects[rqId] = reject;
        cardReader.sendMessage({ "type": "export", "requestId": rqId })
    });
    var result = await promise;
    return result.data.payload;
}
cardReader.decrypt=async function(payload)
{
    promise = new Promise(function (resolve, reject) {
        var rqId = cardReader.requestCount++;
        cardReader.promises[rqId] = resolve;
        cardReader.rejects[rqId] = reject;
        cardReader.sendMessage({ "type": "decrypt", "payload": payload, "requestId":  rqId})
    });
    var result=await promise;
    return atob(result.data.payload);
}
cardReader.ping = async function ()
{
    promise = new Promise(function (resolve,reject) {
        var rqId = cardReader.requestCount++;
        cardReader.promises[rqId] = resolve;
        cardReader.rejects[rqId] = reject;
        cardReader.sendMessage({ "type": "echo", "requestId": rqId })
        setTimeout(function () {
            reject("fail");
        }, 2000);
    });
    try {
        var result = await promise;
    }
    catch (ex)
    {
        return false;
    }
    return true;
}
cardReader.sendMessage = function (message) {
    message.source = window.location.href;
    message.destination = cardReader.extensionId
    window.postMessage(message, "*");
}