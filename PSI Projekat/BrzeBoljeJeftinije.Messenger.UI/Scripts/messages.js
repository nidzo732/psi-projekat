var groupsScrollbar = null;
var currentGroup = null;
var newGroup = null;
var sendingMessage = false;
var userSearchResult = null;
var previousUserSearchQuery = null;
$(document).ready(function()
{
    groupsScrollbar = new PerfectScrollbar('#groups',
    {
        suppressScrollX: true
    });
    $(".modal-inner").each(function(index, element)
    {
        new PerfectScrollbar(element);
    });
    refreshGroups(true);
    groupsScrollbar.update();
});

function getMyGroups(searchString)
{
    var returnedGroups = [];
    groups.forEach((group) =>
    {
        if (!(searchString) || group.name.indexOf(searchString) != -1)
        {
            returnedGroups.push(group);
        }
    });
    return groups;
}

function getGroupById(id)
{
    console.log(id);
    for (var g in groups)
    {
        console.log(groups[g]);
        if (groups[g].id == id) return groups[g];
    }
}

function createGroup(group)
{
    groups.add(group);
}

function editGroup(group)
{

}

function getMessagesForGroup(group, page)
{
    return group.messages;
}

function sendMessage()
{
    var txt = $("#sent-text").val();
    $("#conversation").append(renderMessage(true, false, txt, null, new Date()));
    var objDiv = document.getElementById("conversation");
    objDiv.scrollTop = objDiv.scrollHeight;
    $("#sent-text").val("");
    currentGroup.messages.push(
    {
        sent: true,
        text: txt
    });
}

function loadGroup(group)
{
    if (group == null)
    {
        currentGroup = null;
        newGroup = {
            members: []
        }
        showModal("#newgroup");
    }
    else
    {
        group = getGroupById(group);
        currentGroup = group;
        if(group.type=="request")
        {
            $("#group-edit").hide();
            $("#friend-delete").hide();
            $("#group-leave").hide();
        }
        else if (group.admin)
        {
            $("#group-edit").show();
            $("#friend-delete").hide();
            $("#group-leave").hide();
        }
        else
        {
            $("#group-edit").hide();
            if (group.binary)
            {
                $("#friend-delete").hide();
                $("#group-leave").show();
            }
            else
            {
                $("#friend-delete").show();
                $("#group-leave").hide();
            }
        }
        $("#group-picture").attr("src", group.picture);
        $("#group-name").html(group.name)
        $("#conversation").html("");
        if (group.type == "request")
        {
            $("#fileupload").attr('readonly', "true");
            $("#sent-text").attr('readonly', "true");
            if (group.sent)
            {
                $("#conversation").append(renderMessage(true, true, 'Poslali ste zahtev za prijateljstvo ' + group.name, null, new Date()));
            }
            else
            {
                $("#conversation").append(renderMessage(false, true, group.name + ' vam je poslao zahtev za prijateljstvo', null, new Date()));
            }
        }
        else
        {
            $("#sent-text").removeAttr("readonly");
            $("#fileupload").removeAttr("readonly");
            /*getMessagesForGroup(group).forEach(function (message) {
                $("#conversation").append(renderMessage(message.sent, false, message.text, message.sentpic, new Date(), message.senderpic, message.sender));
            });*/
        }
        redrawGroups();
    }
    setTimeout(function()
    {
        var objDiv = document.getElementById("conversation");
        objDiv.scrollTop = objDiv.scrollHeight;
    }, 100);
}

function attachFile()
{
    sendingMessage = true;
    $("#fileupload").click();
}

function uploadFile()
{
    readURL($("#fileupload")[0])
}

function readURL(input)
{
    if (input.files && input.files[0])
    {
        var reader = new FileReader();

        reader.onload = function(e)
        {
            if (!sendingMessage)
            {
                newGroup.picture = e.target.result;
            }
            else
            {
                sendingMessage = false;
                $("#conversation").append(renderMessage(true, false, null, e.target.result, new Date()));
                setTimeout(function()
                {
                    var objDiv = document.getElementById("conversation");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 100);
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function editGroup()
{
    $("#groupedit-name").val(currentGroup.name)
    showModal("#groupedit")
    newGroup = {}
    refreshGroupedit();
}

function addMember(name)
{
    friends.forEach(function(friend)
    {
        if (friend.name == name)
        {
            currentGroup.members.push(friend);
        }
    });
    refreshGroupedit();
}

function removeMember(name)
{
    members = currentGroup.members;
    currentGroup.members = [];
    members.forEach(function(member)
    {
        if (member.name != name)
        {
            currentGroup.members.push(member);
        }
    });
    refreshGroupedit();
}

function addNewMember(name)
{
    friends.forEach(function(friend)
    {
        if (friend.name == name)
        {
            newGroup.members.push(friend);

        }
    });
    refreshnewgroup();
}

function removeNewMember(name)
{
    members = newGroup.members;
    newGroup.members = [];
    members.forEach(function(member)
    {
        if (member.name != name)
        {
            newGroup.members.push(member);
        }
    });
    refreshnewgroup();
}

function createNewGroup()
{
    if (!newGroup.picture)
    {
        showAlertBox("Morate postaviti i sliku");
        return;
    }
    newGroup.name = $("#newgroup-name").val();
    newGroup.admin = true
    newGroup.group = true
    newGroup.messages = []
    newGroup.id = groups.length
    groups.push(newGroup);
    refreshGroups();
    closeModal();
}

function closeGroupEdit()
{
    currentGroup.name = $("#groupedit-name").val();
    if (newGroup.picture) currentGroup.picture = newGroup.picture;
    loadGroup(currentGroup.id);
    refreshGroups();
    closeModal()
}

async function accept()
{
    var result = await asyncAjax("/User/Accept", { otherId: currentGroup.otherId });
    refreshGroups(true);
}

async function reject()
{
    var result = await asyncAjax("/User/Reject", { otherId: currentGroup.otherId });
    refreshGroups(true);
}

function redrawGroups()
{
    $("#group-list").html("");
    groups.forEach(function(group)
    {
        if ($("#group-search").val().trim() != "" && group.name.toUpperCase().indexOf($("#group-search").val().trim().toUpperCase()) == -1) return;
        if (group.id == null)
        {
            $("#group-list").append(renderChip('loadGroup()', 'fa-plus', null, null, "Nova grupa"));
        }
        else
        {
            $("#group-list").append(renderChip('loadGroup("' + group.id + '")', null, group.picture, null, group.name, currentGroup != null && group.id == currentGroup.id));
        }
    })
    $(".chiptext").ellipsis();
}
async function refreshGroups(loadFirst)
{
    var fetchedGroups = await fetchGroups();
    groups = [];
    requests = {};
    friends = {};
    fetchedGroups.forEach((group) =>
    {
        if (group.binary)
        {
            friends[group.otherId] = true;
        }
        if (group.type == "request")
        {
            requests[group.otherId] = true;
        }
        groups.push(group);
    });
    console.log(fetchedGroups);
    console.log(groups);
    redrawGroups();
    if (loadFirst && groups.length>0)
    {
        loadGroup(groups[0].id);
    }
}
async function searchUsers(event)
{
    if (event.key.length > 1) return;
    $("#zahtev-poslat").hide();
    $("#friend-list").html("");
    if ($("#friend-search").val().trim() != "")
    {
        if (!(previousUserSearchQuery != null && $("#friend-search").val().trim().indexOf(previousUserSearchQuery) != -1 && userSearchResult != null))
        {
            userSearchResult = null;
            userSearchResult = await asyncAjax("/User/Search",
            {
                name: $("#friend-search").val().trim()
            });
        }
        previousUserSearchQuery = $("#friend-search").val().trim();
        userSearchResult.forEach(function(user)
        {
            if ($("#friend-search").val().trim() != "" && user.name.toUpperCase().indexOf($("#friend-search").val().trim().toUpperCase()) == -1) return;
            if (friends[user.id] || requests[user.id]) return;
            $("#friend-list").append(renderChip('sendFriendRequest(this, "' + user.id + '")', null, user.picture, 'fa-plus', user.name))
        });
    }
}

function refreshGroupedit()
{
    $("#groupedit-list").html("");
    existingMembers = {}
    currentGroup.members.forEach(function(group)
    {
        existingMembers[group.name] = true;
    })
    if ($("#groupedit-search").val().trim() != "")
    {
        friends.forEach(function(group)
        {
            if (existingMembers[group.name]) return;
            if ($("#groupedit-search").val().trim() != "" && group.name.toUpperCase().indexOf($("#groupedit-search").val().trim().toUpperCase()) == -1) return;
            $("#groupedit-list").append(renderChip('addMember("' + group.name + '")', null, group.picture, "fa-plus", group.name))
        })
    }
    currentGroup.members.forEach(function(group)
    {
        $("#groupedit-list").append(renderChip('removeMember("' + group.name + '")', null, group.picture, "fa-minus", group.name))
    })
}

function refreshnewgroup()
{
    $("#newgroup-list").html("");
    existingMembers = {}
    newGroup.members.forEach(function(group)
    {
        existingMembers[group.name] = true;
    })
    if ($("#newgroup-search").val().trim() != "")
    {
        friends.forEach(function(group)
        {
            if (existingMembers[group.name]) return;
            if ($("#newgroup-search").val().trim() != "" && group.name.toUpperCase().indexOf($("#newgroup-search").val().trim().toUpperCase()) == -1) return;
            $("#newgroup-list").append(renderChip('addNewMember("' + group.name + '")', null, group.picture, "fa-plus", group.name))
        })
    }
    newGroup.members.forEach(function(group)
    {
        $("#newgroup-list").append(renderChip('removeNewMember("' + group.name + '")', null, group.picture, "fa-minus", group.name))
    })
}
async function sendFriendRequest(source, id)
{
    await asyncAjax("/User/SendRequest",
    {
        id: id
    });
    await refreshGroups();
    $(source).remove();
    showMessageBox("Zahtev uspešno poslat");
}

function renderChip(onclick, fa, image, rightFa, text, selected)
{
    if (fa)
    {
        return "<a href='#' onclick='" + onclick + "'>" +
            "<li> <div class='chip " + (selected ? "selected-chip" : "") + "'> " +
            "<div style='float:left;margin-right:25px'><i class='fa " + fa + " fa-2x' style='margin-left:-10px;margin-top:10px' aria-hidden='true'></i></div> <span class='chiptext'> <div style='float:left'>" + text + "</div>" +
            (rightFa ? "<div style='float:left;margin-right:25px'><i class='fa " + rightFa + " fa-2x' style='margin-left:-10px;margin-top:10px' aria-hidden='true'></i></div>" : "") + "</span>" +
            "</div> </li>" +
            "</a>";
    }
    else if (image)
    {
        return "<a href='#' onclick='" + onclick + "'>" +
            "<li><div class='chip " + (selected ? "selected-chip" : "") + "'> " +
            "<img src='" + image + "' width='96' height='96'> <span class='chiptext'> <div style='float:left'>" + text + "</div>" +
            (rightFa ? "<div style='float:right'><i class='fa " + rightFa + " fa-2x' style='margin-left:-10px;margin-top:10px' aria-hidden='true'></i></div>" : "") + "</span>" +
            "</div>  </li></a>" +
            "";
    }
}

function renderMessage(sent, friendRequest, text, image, date, senderpic, senderText, notrash=false)
{
    type = "receiver";
    if (friendRequest) type = "friend-request";
    else if (sent) type = "sender";
    return '<div class="row message-body">' +
        (senderpic && !sent ? '<img src="' + senderpic + '" class="senderpic"/> <span class="sender-text">' + senderText + '</span>' : '') +
        '<div class="col-sm-12 message-main-' + type + '">' +
        '<div class="' + type + '">' +
        (image ? '<img class="sent-img" src="' + image + '")" onclick="displaySentImg(\'' + image + '\')"/>' : '<div class="message-text">' + text + '</div>') +
        (friendRequest && !sent ? "<div class='message-text' style='text-align:center'><a href='#'><span onclick='accept()' style='color:green;font-weight:bold'>PRIHVATI</span><a/>|<a href='#'><span onclick='reject()' style='color:red;font-weight:bold'>ODBIJ</span><a/></div>" : "") +
        '<span class="message-time pull-right">' +
        date.toLocaleDateString() + " " + date.toLocaleTimeString() +
        '</span>' +
        (sent&&(notrash) ? '<a href="#" onclick="deleteMessage(this)"><i class="fa fa-trash search-icon" aria-hidden="true"></a>' : '') +
        '</div>' +
        '</div>' +
        '</div>'
}

function deleteMessage(row)
{
    $(row).closest(".row").remove();
}

function leaveGroup()
{
    openPrompt("Da li ste sigurni da želite da napustite grupu?", (accept) =>
    {
        if (accept)
        {
            newGroups = []
            groups.forEach((group) =>
            {
                if (group.id != currentGroup.id) newGroups.push(group);
            });
            groups = newGroups;
            for (var i = 0; i < groups.length; i++)
            {
                groups[i].id = i;
            }
            refreshGroups();
        }
    });
}

function deleteFriend()
{
    openPrompt("Da li ste sigurni da želite da obrišete prijatelja?", (accept) =>
    {
        if (accept)
        {
            newGroups = []
            groups.forEach((group) =>
            {
                if (group.id != currentGroup.id) newGroups.push(group);
            });
            groups = newGroups;
            for (var i = 0; i < groups.length; i++)
            {
                groups[i].id = i;
            }
            refreshGroups();
        }
    });
}

function displaySentImg(image)
{
    $("#picture-display").find(".display-picture").attr("src", image);
    showModal("#picture-display")
}
async function fetchGroups()
{
    return await asyncAjax("/Messages/MyGroups");
}