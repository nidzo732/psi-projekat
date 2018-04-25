$(document).ready(function () {

});
function searchUsers()
{
    var query = $("#user-search").val();
    $("#user-list-body").html("");
    query=query.trim();
    if (query == "") return;
    for (user in users) {
        userObject = users[user];
        if (userObject.name.toUpperCase().indexOf(query.toUpperCase()) == -1) continue;
        $("#user-list-body").append(renderTableRow(user, userObject.name, userObject.status, userObject.banDate, userObject.picture));
    }
}
function renderTableRow(userId, name, status, bandate, image)
{
    var row=$('<tr data-user-id="'+userId+'">'+
                '<td>'+name+'<img src="' + image + '" class="user-list-image"></td>'+
                '<td>'+
                    '<select class="form-control ban-status">'+
                        '<option value="ok">Dozvoljen</option>'+
                        '<option value="ban">Banovan</option>'+
                    '</select>'+
    '</td>' +
    '<td><input type="text" class="form-control user-ban-date" /></td>' +
    '<td><input type="button" class="form-control" value="Ažuriraj" onclick="updateUserStatus(this)" /><input type="button" class="form-control" value="Obriši" onclick="deleteUser(this)" /></td>' +
'</tr>');
    row.find(".ban-status").val(status);
    row.find(".user-ban-date").datepicker(datePickerParams);
    row.find(".user-ban-date").datepicker("setDate", bandate);
    return row;
}
function updateUserStatus(sender)
{
    var target = $(sender).closest("tr");
    var userId = target.attr("data-user-id");
    var status = target.find(".ban-status").val();
    var date = target.find(".user-ban-date").datepicker("getDate");
    users[userId].status = status;
    users[userId].banDate = date;
}
var userToDelete = null;
function deleteUser(sender)
{
    var target = $(sender).closest("tr");
    var userId = target.attr("data-user-id");
    userToDelete = userId;
    $("#confirm-delete").show();
}
function confirmDelete()
{
    delete users[userToDelete];
    searchUsers();
    $(".modal").hide();
}
function registerNewAdmin()
{
    $("#register-new-admin").show();
}
function confirmAdminRegister()
{
    showMessageBox("Registracija uspešna");
}