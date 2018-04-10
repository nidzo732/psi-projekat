var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var groupsScrollbar = null;
var currentGroup = null;
var newGroup = null;
var sendingMessage = false;
var userSearchResult = null;
var previousUserSearchQuery = null;
$(document).ready(function () {
    groupsScrollbar = new PerfectScrollbar('#groups', {
        suppressScrollX: true
    });
    $(".modal-inner").each(function (index, element) {
        new PerfectScrollbar(element);
    });
    refreshGroups(true);
    groupsScrollbar.update();
});
function getMyGroups(searchString) {
    var returnedGroups = [];
    groups.forEach(function (group) {
        if (!(searchString) || group.name.indexOf(searchString) != -1) {
            returnedGroups.push(group);
        }
    });
    return groups;
}
function getGroupById(id) {
    console.log(id);
    for (var g in groups) {
        console.log(groups[g]);
        if (groups[g].id == id)
            return groups[g];
    }
}
function createGroup(group) {
    groups.add(group);
}
function editGroup(group) {
}
function getMessagesForGroup(group, page) {
    return group.messages;
}
function sendMessage() {
    var txt = $("#sent-text").val();
    $("#conversation").append(renderMessage(true, false, txt, null, new Date()));
    var objDiv = document.getElementById("conversation");
    objDiv.scrollTop = objDiv.scrollHeight;
    $("#sent-text").val("");
    currentGroup.messages.push({
        sent: true,
        text: txt
    });
}
function loadGroup(group) {
    if (group == null) {
        currentGroup = null;
        newGroup = {
            members: []
        };
        showModal("#newgroup");
    }
    else {
        group = getGroupById(group);
        currentGroup = group;
        if (group.type == "request") {
            $("#group-edit").hide();
            $("#friend-delete").hide();
            $("#group-leave").hide();
        }
        else if (group.admin) {
            $("#group-edit").show();
            $("#friend-delete").hide();
            $("#group-leave").hide();
        }
        else {
            $("#group-edit").hide();
            if (group.binary) {
                $("#friend-delete").hide();
                $("#group-leave").show();
            }
            else {
                $("#friend-delete").show();
                $("#group-leave").hide();
            }
        }
        $("#group-picture").attr("src", group.picture);
        $("#group-name").html(group.name);
        $("#conversation").html("");
        if (group.type == "request") {
            $("#fileupload").attr('readonly', "true");
            $("#sent-text").attr('readonly', "true");
            if (group.sent) {
                $("#conversation").append(renderMessage(true, true, 'Poslali ste zahtev za prijateljstvo ' + group.name, null, new Date()));
            }
            else {
                $("#conversation").append(renderMessage(false, true, group.name + ' vam je poslao zahtev za prijateljstvo', null, new Date()));
            }
        }
        else {
            $("#sent-text").removeAttr("readonly");
            $("#fileupload").removeAttr("readonly");
            /*getMessagesForGroup(group).forEach(function (message) {
                $("#conversation").append(renderMessage(message.sent, false, message.text, message.sentpic, new Date(), message.senderpic, message.sender));
            });*/
        }
        redrawGroups();
    }
    setTimeout(function () {
        var objDiv = document.getElementById("conversation");
        objDiv.scrollTop = objDiv.scrollHeight;
    }, 100);
}
function attachFile() {
    sendingMessage = true;
    $("#fileupload").click();
}
function uploadFile() {
    readURL($("#fileupload")[0]);
}
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (!sendingMessage) {
                newGroup.picture = e.target.result;
            }
            else {
                sendingMessage = false;
                $("#conversation").append(renderMessage(true, false, null, e.target.result, new Date()));
                setTimeout(function () {
                    var objDiv = document.getElementById("conversation");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 100);
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function editGroup() {
    $("#groupedit-name").val(currentGroup.name);
    showModal("#groupedit");
    newGroup = {};
    refreshGroupedit();
}
function addMember(name) {
    friends.forEach(function (friend) {
        if (friend.name == name) {
            currentGroup.members.push(friend);
        }
    });
    refreshGroupedit();
}
function removeMember(name) {
    members = currentGroup.members;
    currentGroup.members = [];
    members.forEach(function (member) {
        if (member.name != name) {
            currentGroup.members.push(member);
        }
    });
    refreshGroupedit();
}
function addNewMember(name) {
    friends.forEach(function (friend) {
        if (friend.name == name) {
            newGroup.members.push(friend);
        }
    });
    refreshnewgroup();
}
function removeNewMember(name) {
    members = newGroup.members;
    newGroup.members = [];
    members.forEach(function (member) {
        if (member.name != name) {
            newGroup.members.push(member);
        }
    });
    refreshnewgroup();
}
function createNewGroup() {
    if (!newGroup.picture) {
        showAlertBox("Morate postaviti i sliku");
        return;
    }
    newGroup.name = $("#newgroup-name").val();
    newGroup.admin = true;
    newGroup.group = true;
    newGroup.messages = [];
    newGroup.id = groups.length;
    groups.push(newGroup);
    refreshGroups();
    closeModal();
}
function closeGroupEdit() {
    currentGroup.name = $("#groupedit-name").val();
    if (newGroup.picture)
        currentGroup.picture = newGroup.picture;
    loadGroup(currentGroup.id);
    refreshGroups();
    closeModal();
}
function accept() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncAjax("/User/Accept", { otherId: currentGroup.otherId })];
                case 1:
                    result = _a.sent();
                    refreshGroups(true);
                    return [2 /*return*/];
            }
        });
    });
}
function reject() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncAjax("/User/Reject", { otherId: currentGroup.otherId })];
                case 1:
                    result = _a.sent();
                    refreshGroups(true);
                    return [2 /*return*/];
            }
        });
    });
}
function redrawGroups() {
    $("#group-list").html("");
    groups.forEach(function (group) {
        if ($("#group-search").val().trim() != "" && group.name.toUpperCase().indexOf($("#group-search").val().trim().toUpperCase()) == -1)
            return;
        if (group.id == null) {
            $("#group-list").append(renderChip('loadGroup()', 'fa-plus', null, null, "Nova grupa"));
        }
        else {
            $("#group-list").append(renderChip('loadGroup("' + group.id + '")', null, group.picture, null, group.name, currentGroup != null && group.id == currentGroup.id));
        }
    });
    $(".chiptext").ellipsis();
}
function refreshGroups(loadFirst) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchedGroups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchGroups()];
                case 1:
                    fetchedGroups = _a.sent();
                    groups = [];
                    requests = {};
                    friends = {};
                    fetchedGroups.forEach(function (group) {
                        if (group.binary) {
                            friends[group.otherId] = true;
                        }
                        if (group.type == "request") {
                            requests[group.otherId] = true;
                        }
                        groups.push(group);
                    });
                    console.log(fetchedGroups);
                    console.log(groups);
                    redrawGroups();
                    if (loadFirst && groups.length > 0) {
                        loadGroup(groups[0].id);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function searchUsers(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (event.key.length > 1)
                        return [2 /*return*/];
                    $("#zahtev-poslat").hide();
                    $("#friend-list").html("");
                    if (!($("#friend-search").val().trim() != "")) return [3 /*break*/, 3];
                    if (!!(previousUserSearchQuery != null && $("#friend-search").val().trim().indexOf(previousUserSearchQuery) != -1 && userSearchResult != null)) return [3 /*break*/, 2];
                    userSearchResult = null;
                    return [4 /*yield*/, asyncAjax("/User/Search", {
                            name: $("#friend-search").val().trim()
                        })];
                case 1:
                    userSearchResult = _a.sent();
                    _a.label = 2;
                case 2:
                    previousUserSearchQuery = $("#friend-search").val().trim();
                    userSearchResult.forEach(function (user) {
                        if ($("#friend-search").val().trim() != "" && user.name.toUpperCase().indexOf($("#friend-search").val().trim().toUpperCase()) == -1)
                            return;
                        if (friends[user.id] || requests[user.id])
                            return;
                        $("#friend-list").append(renderChip('sendFriendRequest(this, "' + user.id + '")', null, user.picture, 'fa-plus', user.name));
                    });
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function refreshGroupedit() {
    $("#groupedit-list").html("");
    existingMembers = {};
    currentGroup.members.forEach(function (group) {
        existingMembers[group.name] = true;
    });
    if ($("#groupedit-search").val().trim() != "") {
        friends.forEach(function (group) {
            if (existingMembers[group.name])
                return;
            if ($("#groupedit-search").val().trim() != "" && group.name.toUpperCase().indexOf($("#groupedit-search").val().trim().toUpperCase()) == -1)
                return;
            $("#groupedit-list").append(renderChip('addMember("' + group.name + '")', null, group.picture, "fa-plus", group.name));
        });
    }
    currentGroup.members.forEach(function (group) {
        $("#groupedit-list").append(renderChip('removeMember("' + group.name + '")', null, group.picture, "fa-minus", group.name));
    });
}
function refreshnewgroup() {
    $("#newgroup-list").html("");
    existingMembers = {};
    newGroup.members.forEach(function (group) {
        existingMembers[group.name] = true;
    });
    if ($("#newgroup-search").val().trim() != "") {
        friends.forEach(function (group) {
            if (existingMembers[group.name])
                return;
            if ($("#newgroup-search").val().trim() != "" && group.name.toUpperCase().indexOf($("#newgroup-search").val().trim().toUpperCase()) == -1)
                return;
            $("#newgroup-list").append(renderChip('addNewMember("' + group.name + '")', null, group.picture, "fa-plus", group.name));
        });
    }
    newGroup.members.forEach(function (group) {
        $("#newgroup-list").append(renderChip('removeNewMember("' + group.name + '")', null, group.picture, "fa-minus", group.name));
    });
}
function sendFriendRequest(source, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncAjax("/User/SendRequest", {
                        id: id
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refreshGroups()];
                case 2:
                    _a.sent();
                    $(source).remove();
                    showMessageBox("Zahtev uspešno poslat");
                    return [2 /*return*/];
            }
        });
    });
}
function renderChip(onclick, fa, image, rightFa, text, selected) {
    if (fa) {
        return "<a href='#' onclick='" + onclick + "'>" +
            "<li> <div class='chip " + (selected ? "selected-chip" : "") + "'> " +
            "<div style='float:left;margin-right:25px'><i class='fa " + fa + " fa-2x' style='margin-left:-10px;margin-top:10px' aria-hidden='true'></i></div> <span class='chiptext'> <div style='float:left'>" + text + "</div>" +
            (rightFa ? "<div style='float:left;margin-right:25px'><i class='fa " + rightFa + " fa-2x' style='margin-left:-10px;margin-top:10px' aria-hidden='true'></i></div>" : "") + "</span>" +
            "</div> </li>" +
            "</a>";
    }
    else if (image) {
        return "<a href='#' onclick='" + onclick + "'>" +
            "<li><div class='chip " + (selected ? "selected-chip" : "") + "'> " +
            "<img src='" + image + "' width='96' height='96'> <span class='chiptext'> <div style='float:left'>" + text + "</div>" +
            (rightFa ? "<div style='float:right'><i class='fa " + rightFa + " fa-2x' style='margin-left:-10px;margin-top:10px' aria-hidden='true'></i></div>" : "") + "</span>" +
            "</div>  </li></a>" +
            "";
    }
}
function renderMessage(sent, friendRequest, text, image, date, senderpic, senderText, notrash) {
    if (notrash === void 0) { notrash = false; }
    type = "receiver";
    if (friendRequest)
        type = "friend-request";
    else if (sent)
        type = "sender";
    return '<div class="row message-body">' +
        (senderpic && !sent ? '<img src="' + senderpic + '" class="senderpic"/> <span class="sender-text">' + senderText + '</span>' : '') +
        '<div class="col-sm-12 message-main-' + type + '">' +
        '<div class="' + type + '">' +
        (image ? '<img class="sent-img" src="' + image + '")" onclick="displaySentImg(\'' + image + '\')"/>' : '<div class="message-text">' + text + '</div>') +
        (friendRequest && !sent ? "<div class='message-text' style='text-align:center'><a href='#'><span onclick='accept()' style='color:green;font-weight:bold'>PRIHVATI</span><a/>|<a href='#'><span onclick='reject()' style='color:red;font-weight:bold'>ODBIJ</span><a/></div>" : "") +
        '<span class="message-time pull-right">' +
        date.toLocaleDateString() + " " + date.toLocaleTimeString() +
        '</span>' +
        (sent && (notrash) ? '<a href="#" onclick="deleteMessage(this)"><i class="fa fa-trash search-icon" aria-hidden="true"></a>' : '') +
        '</div>' +
        '</div>' +
        '</div>';
}
function deleteMessage(row) {
    $(row).closest(".row").remove();
}
function leaveGroup() {
    openPrompt("Da li ste sigurni da želite da napustite grupu?", function (accept) {
        if (accept) {
            newGroups = [];
            groups.forEach(function (group) {
                if (group.id != currentGroup.id)
                    newGroups.push(group);
            });
            groups = newGroups;
            for (var i = 0; i < groups.length; i++) {
                groups[i].id = i;
            }
            refreshGroups();
        }
    });
}
function deleteFriend() {
    openPrompt("Da li ste sigurni da želite da obrišete prijatelja?", function (accept) {
        if (accept) {
            newGroups = [];
            groups.forEach(function (group) {
                if (group.id != currentGroup.id)
                    newGroups.push(group);
            });
            groups = newGroups;
            for (var i = 0; i < groups.length; i++) {
                groups[i].id = i;
            }
            refreshGroups();
        }
    });
}
function displaySentImg(image) {
    $("#picture-display").find(".display-picture").attr("src", image);
    showModal("#picture-display");
}
function fetchGroups() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncAjax("/Messages/MyGroups")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
