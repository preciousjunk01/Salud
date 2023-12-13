// content.js

import OpenAI from "openai";
/* import dotenv from 'dotenv';

dotenv.config(); */

chrome.runtime.onMessage.addListener((tabId) => {
    console.log(tabId)
});
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true
}); 

async function chatFunction(ProductName) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You will be provided with a store-sold product name. Your tasks are as below\
        \
        - Obtain the ingredients of the food on which you were trained\
        - Assess the side effects of those ingredients for their harmfulness to regular consumption\
        - Rank the ingredients on a scale of 0-5 based on their harmfulness\
        - Filter the top 5 harmful ingredients based on the rank\
        - Prepare 20-word explanation of the side effect and harmfulness\
        \
        The output should only have content as per the below format\
        \
        <Ingredient Name> (<Rank>) - <Explanation>" },
    {"role": "user", "content": ProductName}],
        model: "gpt-4",
    });
    // console.log(ProductName + ":" + chatCompletion.choices[0].message.content);
    return (ProductName + ":" + chatCompletion.choices[0].message.content);
};

function addImageToElement(element, ingInfo) {
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('images/Info.png');
    img.width = 20;   // Set the width to 50 pixels (change as needed)
    img.height = 20;  // Set the height to 50 pixels (change as needed)
    img.title = ingInfo;
    let referenceElement = element.querySelector('.ml-auto');  // replace '.some-class' with the appropriate selector
    element.insertBefore(img, referenceElement);  // Inserts before the reference element
    // element.appendChild(img);
}

let ingInfo;

// The callback for the MutationObserver
const callback = function(mutationsList, observer) {
for(let mutation of mutationsList) {
    let hasProcessed = false;
    if(mutation.addedNodes.length) {
        console.log("mutation")
        console.log(mutation)
        mutation.addedNodes.forEach(node => {
            console.log(node)
            // If the added node (or any of its descendants) is within an element with the desired class
            if(node.querySelector && node.querySelector('.flex.flex-column.sans-serif.pv2')) {
                if(hasProcessed) {
                    console.log("Duplicate class")  // If already processed, skip the logic
                    return;}
                hasProcessed = true;
                console.log("Found the class")
                let parentElement = node.querySelector('.flex.flex-column.sans-serif.pv2');
                // Find all elements with class `.flex.flex-column.sans-serif.pv2` that are descendants of the parentElement which has each product logo, name and price
                let childElement = Array.from(parentElement.querySelectorAll('.flex.flex-row.relative'));
                console.log(childElement)
                childElement.forEach(child => {
                    let productName = child.querySelector('.w_V_DM').innerText;
                    chatFunction(productName).then(result => {
                        ingInfo = result;
                        addImageToElement(child, ingInfo);
                    });
                    
                });  
            }
        });
    }
    else {
        console.log("oombi poi")
    };
}
};

// Create a new observer instance
const observer = new MutationObserver(callback);

// Start observing the entire document with the configured parameters
observer.observe(document, {
childList: true,
subtree: true
});

  
  /*<span class="w_V_DM" style="-webkit-line-clamp: 2; padding-bottom: 0em; margin-bottom: 0em;">Marketside Fresh Spinach, 10 oz Bag, Fresh</span>*/