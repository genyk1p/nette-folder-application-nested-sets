"use strict";
import naja from 'naja';
document.addEventListener('DOMContentLoaded', function() {

    naja.initialize({
        history: false
    });

    const form = document.getElementById('addForm');
    const inputData = document.getElementById('add-form-input-data');
    const hiddenInputId = document.getElementById('add-form-id');
    const postUrl = form.getAttribute('action');
    const renameSubmitBtn = document.getElementById('rename-submit-btn');
    const renameFormInputData = document.getElementById('rename-form-input-data');
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const renameModal = new bootstrap.Modal(document.getElementById('renameFormModal'));
    const renameWarningModal = new bootstrap.Modal(document.getElementById('renameWarningModal'));
    const renameWarninText = document.getElementById('renameWarningModal').querySelector('.modal-body');
    let folderIdFoDelete;
    let folderIdFoRename;
    let currentFolderId = 1;
    let currentFolderName = "root";
    let folders = [];
    let currentFolders = [];
    let path = [];

    const sendFormData = () => {
        if (inputData.value !== ""){
            naja.makeRequest("POST", postUrl, new FormData(form))
                .then((payload) => {
                    renderFolder(currentFolderId);
                });
        }
        inputData.value = "";
    };

    // Renders the path depending on the provided folder id.
    const renderPath = (id) => {
        const pathOl = document.getElementById("breadcrumb_path");
        pathOl.innerHTML = '<li class="breadcrumb-item active" aria-current="page">Path</li>';
        const originalUrl = document.getElementById('getPathUrl').textContent;
        const urlParts = originalUrl.slice(0, -1);
        const url = `${urlParts}${id}`;
        naja.makeRequest('GET', url)
            .then((payload) => {
                if (payload.snippets && payload.snippets.folders) {
                    path = payload.snippets.folders;
                    path.forEach(item => {
                        console.log(item);
                        pathOl.innerHTML += `<li class="breadcrumb-item active"><a href="#" class="folder_link" data-id="${item.id}">${item.name}</a></li>`;
                    })
                    pathOl.innerHTML += `<li class="breadcrumb-item active"><a href="#" class="folder_link" data-id="${+currentFolderId}">${currentFolderName}</a></li>`;
                }
            });
    }

    // // Renders folders depending on the provided folder id.
    const renderFolder = (id) => {
        currentFolderId = id;
        const originalUrl = document.getElementById('getFoldersUrl').textContent;
        const folderDiv = document.querySelector('.folders');
        const urlParts = originalUrl.slice(0, -1);
        const url = `${urlParts}${id}`;
        naja.makeRequest('GET', url)
            .then((payload) => {
                if (payload.snippets && payload.snippets.folders) {
                    
                    folders = payload.snippets.folders;
                    folderDiv.innerHTML = '';
                    folders.forEach(item => {
                        
                        folderDiv.innerHTML += `<div class="folder btn btn-primary btn-lg" data-id="${item.id}" data-name="${item.name}">
                                                    ${item.name}
                                                    <img class="trash_img" src="img/red-trash-can-icon.svg">
                                                    <img class="rename_img" src="img/rename-icon.svg">   
                                                </div>`;
                    })
                    renderPath(id);
                    currentFolders = folders.map(folder => {
                        return folder.name;
                    })
                }
            });
    };

    // Sending data for folder renaming to the server using the PUT method.
    const sendRenameFormmData = () => {
        const renameFormInputData = document.getElementById('rename-form-input-data');
        const originalUrl = document.getElementById('getRenameUrl').textContent;
        const urlParts = originalUrl.split('?');
        const baseUrl = urlParts[0];
        const renameUrl = `${baseUrl}?newName=${renameFormInputData.value}&itemId=${folderIdFoRename}`;
        naja.makeRequest('PUT', renameUrl)
            .then((payload) => {
                renderFolder(currentFolderId);
                renameModal.hide();
            });
        renameFormInputData.value = "";
    };
    // Sending a DELETE request to delete a folder.
    const sendDeleteRequest = (id) => {
        const originalUrl = document.getElementById('getDeleteUrl').textContent;
        const urlParts = originalUrl.slice(0, -1);
        const deleteUrl = `${urlParts}${id}`;
        naja.makeRequest("DELETE", deleteUrl)
            .then((payload) => {
                renderFolder(currentFolderId);
            });
    };

    renderFolder(1);

    // Attaches an event handler to the delete button in the modal window, which contains the folder deletion function and hides the modal window.
    const deleteButton = document.getElementById("delet-btn");
    deleteButton.addEventListener('click', () => {
        deleteModal.hide();
        sendDeleteRequest(folderIdFoDelete);
        });

    // Event handler for the submission of the new folder creation form.
    form.addEventListener('submit', function (e) {
        hiddenInputId.value = currentFolderId;
        inputData.value = inputData.value.trim();
        e.preventDefault();
        sendFormData();
    });

    // Attaching an event handler to the "Rename" button in the modal window with the renaming form.
    renameSubmitBtn.addEventListener('click', () => {
        const enteredFolderName = renameFormInputData.value.trim();
        if(enteredFolderName === ""){
            renameFormInputData.classList.add("is-invalid");
        } else if(currentFolders.includes(enteredFolderName)){
            renameModal.hide();
            renameWarninText.innerHTML = `This directory already has a folder named <span class="fw-bold">${enteredFolderName}</span>, please enter a different folder name`;
            renameWarningModal.show();
        } else {
            sendRenameFormmData();
        }
    })

    // Event handler for the window that tracks clicks on folders, clicks on paths, and clicks on icons for delete, rename, and performs the necessary logic.
    window.addEventListener('click', (e) => {
        if(e.target && e.target.classList.contains("folder") && !e.target.classList.contains("trash_img") && !e.target.classList.contains("rename_img")){
            const id = e.target.getAttribute('data-id');
            currentFolderName = e.target.getAttribute('data-name');
            renderFolder(id);
        } else if(e.target && e.target.classList.contains("folder_link") ){
            e.preventDefault();
            const id = e.target.getAttribute('data-id');
            currentFolderName = e.target.textContent;
            renderFolder(id);
        } else if(e.target && e.target.classList.contains("trash_img" )){
            folderIdFoDelete = e.target.parentElement.getAttribute('data-id');
            const folderName = e.target.parentElement.textContent.trim();
            const spanInModal = document.getElementById('folder_name_in_span');
            spanInModal.innerHTML = '"' + folderName + '"';
            deleteModal.show();
        }else if(e.target && e.target.classList.contains("rename_img" )){
            renameFormInputData.classList.remove("is-invalid");
            renameFormInputData.value = '';
            folderNameFoRename = e.target.parentElement.textContent.trim();
            folderIdFoRename = e.target.parentElement.getAttribute('data-id');
            renameModal.show();
        };
    });

});
