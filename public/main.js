import * as STATE from './store.js'; //This import is required to set up the global state in parent context.

let containerElement = document.getElementById(`container`);

let iframeContainer = document.getElementById('iframe-container');
let iframe = null;
let currentUrl = null;

/*
    Checks if the content at the provided url is available to be loaded.
    Returns truthy value if the content is available.
    Returns falsey if the content is unavailable, not found, or network error.
*/
async function checkUrlAvailability(url) {
    try {
        //Use HEAD to only receive the header of the request
        const response = await fetch(url, {
            method: 'HEAD'
        });
        return(response.ok);
    }catch(error) {
        console.error(error);
        return(false);
    }
}

/*
    Invokes a scene change, checking if content is available before tearing down the old and creating the new scene.
*/
async function loadScene(url) {
    //Check if the content at the provided url is available.
    let contentAvailable = await checkUrlAvailability(url);

    if(!contentAvailable) {
        console.log(`The content at ${ url } is currently unavailable. Please try again later.`);
        return;
    }
    
    console.log(`New content was found at ${ url }.`);

    //Destroy and clear the current iframe content.
    if(iframe) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.close();
        iframe.src = 'about:blank';
        iframe.contentWindow.location.href = 'about:blank?_' + Math.random();
        iframe.remove();
        iframe = null;
        let element;
        while(element = iframeContainer.firstChild) {
            iframeContainer.removeChild(element);
        }
        console.log(`The previous content from ${ currentUrl } was removed successfully.`);
    }

    //Reset the existing elements.
    containerElement.innerHTML = `<div id="debug"></div>
        <div id="filter"></div>
        <div id="ui"></div>
        <div id="canvas"></div>`;

    //Create a new iframe and append the content provided by the url.
    iframe = document.createElement('iframe');
    iframe.src = `${ url }`;
    iframeContainer.appendChild(iframe);

    iframe.onload = function() {
        currentUrl = url;
        console.log(`The content at ${ url } was loaded successfully.`);
    };
}

//Make the loadScene function and dependencies accessible to same-domain iframes via the parent window.
window.loadScene = loadScene;
