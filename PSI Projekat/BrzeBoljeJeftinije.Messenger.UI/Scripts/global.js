var touchScrollStartY = null;
var datePickerParams = { format: 'dd.mm.yyyy' }
var modalStack = []
var currentModal = null;
$(document).ready(function () {
    initSignalR();
});
var navMenuTimeout = null;
var activePrompt = null;
function openNavMenu() {
    if (navMenuTimeout != null)
    {
        clearTimeout(navMenuTimeout);
        navMenuTimeout = null;
    }
    $("#nav-menu").show();
    navMenuTimeout = setTimeout(function () {
        navMenuTimeout = null;
        $("#nav-menu").hide();
    }, 5000);
}
function showMessageBox(message)
{
    $("#message-box-modal").find(".message-box-text").html(message);
    $("#message-box-modal").find(".info-part").show();
    $("#message-box-modal").find(".alert-part").hide();
    showModal("#message-box-modal")
}
function showAlertBox(message) {
    $("#message-box-modal").find(".message-box-text").html(message);
    $("#message-box-modal").find(".info-part").hide();
    $("#message-box-modal").find(".alert-part").show();
    showModal("#message-box-modal")
}


function openPrompt(message, callback)
{
    $("#prompt-modal").find(".message-box-text").html(message);
    showModal("#prompt-modal");
    activePrompt = callback;
}
function promptAccept()
{
    closeModal();
    if (activePrompt) activePrompt(true);
}
function promptReject()
{
    closeModal();
    if (activePrompt) activePrompt(false);
}
function showModal(id)
{
    if(currentModal!=null)
    {
        modalStack.push(currentModal);
        $(currentModal).find(".modal-inner").hide();
        $(id).find(".modal-inner").show();
        $(id).show();
        $(currentModal).hide();
        currentModal = id;
    }
    else
    {
        currentModal = id;
        $(id).find(".modal-inner").show();
        $(id).show();
    }
}
function closeModal()
{
    $(currentModal).find(".modal-inner").hide();
    if(modalStack.length>0)
    {
        oldModal= modalStack.pop();
        $(oldModal).find(".modal-inner").show();
        $(oldModal).show();
        $(currentModal).hide();
        currentModal = oldModal;
    }
    else
    {
        $(currentModal).hide();
        currentModal = null;
    }
}
function handleCardErrorMessage(msg)
{
    var status = msg.data.status;
    var errorMessage = null;
    switch(status)
    {
        case "NO_CARD":
            errorMessage = "Lična karta nije ubačena ili je sertifikat na njoj neispravan";
            break;
        case "EXC":
            errorMessage = "Došlo je do greške: " + msg.data.message;
            break;
        default:
            errorMessage = "Došlo je do nepoznate greške prilikom obavljanja kriptografskih operacija";
            break;
    }
    showAlertBox(errorMessage);
}
async function asyncAjax(url, data = {}, method = 'POST') {
    var promise = new Promise((accept, reject) => {
        $.ajax(url, {
            method: method,
            data: data,
            success: function (result) {
                accept(result);
            },
            error: (xhr, error, thrown) => {
                err = "";
                if (error) err = error;
                if (thrown) err += " " + thrown;
                showAlertBox("Došlo je do greške u mrežnoj komunikaciji: " + err);
                reject(err);
            }
        });
    });
    return await promise;
}
function initSignalR()
{
    var hub = $.connection.messengerHub;
    hub.client.Refresh = function (name, message)
    {
        console.log("RERERERE");
        refreshGroups(true);
    };
    $.connection.hub.start().done(() =>
    {
    });
}