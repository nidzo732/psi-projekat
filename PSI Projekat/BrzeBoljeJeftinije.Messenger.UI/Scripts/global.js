var touchScrollStartY = null;
var datePickerParams = { format: 'dd.mm.yyyy' }
var modalStack = []
var currentModal = null;
$(document).ready(function () {
    
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
    console.log('A')
    $(currentModal).find(".modal-inner").hide();
    console.log('B')
    if(modalStack.length>0)
    {
        console.log('C')
        oldModal= modalStack.pop();
        $(oldModal).find(".modal-inner").show();
        $(oldModal).show();
        $(currentModal).hide();
        currentModal = oldModal;
    }
    else
    {
        console.log('D')
        $(currentModal).hide();
        currentModal = null;
    }
}