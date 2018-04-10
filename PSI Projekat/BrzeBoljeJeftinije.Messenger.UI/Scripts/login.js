$(document).ready(()=>{
    cardReader.init();
});
async function doCardLogin()
{
    try
    {
        var pingStatus = await cardReader.ping();
        if(!pingStatus)
        {
            showAlertBox("Ekstenzija ili program nisu instalirani");
            return;
        }
        var certificate = await cardReader.getCertificate();
        var signature = await cardReader.sign(signatureAuthToken);
    }
    catch(err)
    {
        console.log(err);
        handleCardErrorMessage(err);
    }
    var result = await asyncAjax("/Auth/", { Signature: signature, Certificate: certificate });
    if (result == "OK") {
        window.location.href = "/Messages";
    }
    else {
        console.log(result);
        showAlertBox(result.replace("FAIL:", ""));
    }
    return false;
}
function getSimCredentials()
{
    if(localStorage.simId)
    {
        return localStorage.simId+":"+localStorage.simName+":"+localStorage.simSecret;
    }
    else
    {
        localStorage.simId="SIM-"+sessionId;
        localStorage.simName="Simulacioni korisnik "+Math.round(Math.random()*10000);
        localStorage.simSecret = ""+Math.round(Math.random()*10000000000);
        return localStorage.simId+":"+localStorage.simName+":"+localStorage.simSecret;
    }
}
function doSimLogin()
{
    $.ajax("/Auth/",{
        method:"POST",
        data:{
            Signature:"sim",
            Certificate:getSimCredentials()
        },
        success:function(result){
            if(result=="OK")
            {
                window.location.href="/Messages";
            }
            else
            {
                showAlertBox(result.replace("FAIL:",""));
            }
        }

    });
}
async function doLogin()
{
    if($("#login_real")[0].checked)
    {
        doCardLogin();
    }
    else
    {
        doSimLogin();
    }
}