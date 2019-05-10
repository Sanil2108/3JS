function getMouseEnterEvent(direction, allItems, element, allItemsElements){
    let style = getComputedStyle(element);
    let initHeight = style.height;
    initHeight = initHeight.substring(0, initHeight.length - 2);
    initHeight = Number(initHeight)
    let initTop = style.top;
    initTop = initTop.substring(0, initTop.length - 2);
    initTop = Number(initTop);
    let steps = 10;
    return (event)=>{
        if(direction=="top"){

        }else{
            let newHeight = allItems.length * initHeight;
            let heightIncrease = (newHeight - initHeight)/steps;
            
            heightIncrease = Number(heightIncrease);
            let downAnimation = setInterval(
                ()=>{
                    let currentStyle = getComputedStyle(element);
                    let currentHeight = currentStyle.height;
                    currentHeight = currentHeight.substring(0, currentHeight.length-2);
                    currentHeight = Number(currentHeight);
                    if(currentHeight>=newHeight){
                        element.style.height = newHeight;
                        clearInterval(downAnimation);
                        element.childNodes[0].remove();
                        for(let child of allItemsElements){
                            child.style.display = "block";
                            if(child == allItemsElements[allItemsElements.length - 1]){
                                child.style.borderBottomRightRadius = "5px";
                                child.style.borderBottomLeftRadius = "5px";
                            }
                        }
                        return;
                    }
                    currentHeight = currentHeight + heightIncrease;
                    element.style.height = currentHeight+"px";
                }, 16
            );
        }
    }
}

function getMouseExitEvent(direction, allItems, element, allItemsElements, selected){
    let style = getComputedStyle(element);
    let initHeight = style.height;
    initHeight = initHeight.substring(0, initHeight.length - 2);
    initHeight = Number(initHeight)
    let initTop = style.top;
    initTop = initTop.substring(0, initTop.length - 2);
    initTop = Number(initTop);
    let steps = 10;
    return (event)=>{
        if(direction=="top"){

        }else{
            let newElement = document.createTextNode(selected);
            element.insertBefore(newElement, element.childNodes[0]);
            let newHeight = initHeight/allItems.length;
            let heightIncrease = (newHeight - initHeight)/steps;
            heightIncrease = Number(heightIncrease);
            for(let child of allItemsElements){
                child.style.display = "none";
            }
            let upAnimation = setInterval(
                ()=>{
                    let currentStyle = getComputedStyle(element);
                    let currentHeight = currentStyle.height;
                    currentHeight = currentHeight.substring(0, currentHeight.length-2);
                    currentHeight = Number(currentHeight);
                    if(currentHeight<=newHeight){
                        element.style.height = newHeight;
                        clearInterval(upAnimation);
                        return;
                    }
                    currentHeight = currentHeight + heightIncrease;
                    element.style.height = currentHeight+"px";
                }, 16
            );
        }
    }
}

function init(){
    let simpleSelectors = document.querySelectorAll("div.simpleSelector");
    for(let simpleSelector of simpleSelectors){
        let allItemsArr = [];
        let open = false;
        let allItems = simpleSelector.querySelectorAll("div.simpleSelectorItem");
        for(let item of allItems){
            allItemsArr.push(item.textContent.trim());
        }
        let selected = allItemsArr[0];
        simpleSelector.addEventListener("mouseenter", (event)=>{
            if(!open){
                open = true;
                (getMouseEnterEvent("down", allItems, simpleSelector, allItems))(event);
            }
        })
        for(let i=0;i<allItems.length;i++){
            let item = allItems[i];
            item.onclick = ()=>{
                selected = allItemsArr[i];
                let event = new CustomEvent(
                    "select",
                    {
                        detail:{selected:allItemsArr[i]}
                    }
                );
                simpleSelector.dispatchEvent(event);
                (getMouseExitEvent("down", allItems, simpleSelector, allItems, selected))();
                open =false;
            }
        }
        simpleSelector.addEventListener("mouseleave", (event)=>{
            if(open){
                (getMouseExitEvent("down", allItems, simpleSelector, allItems, selected))();
                open = false;
            }
        })
    }
}

window.onload = init;