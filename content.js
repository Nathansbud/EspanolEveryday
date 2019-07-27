let url = "https://www.spanishdict.com/wordoftheday/feed";

let wordDiv = document.getElementById("extension")
let wordHeader = document.getElementById("word")
let wordDefinition = document.getElementById("definition")
let wordExample = document.getElementById("example")
let userSection = document.getElementById("user_section")

let addPracticeButton = document.getElementById("add_practice")

let score = 0
let exampleCount = 1

window.onload = (function() {
    // localStorage.clear()
    setupStorage();
    readFromStorage();
    wordDiv.style.display = "block";
})

function setupStorage() {
    if(!localStorage.getItem("word")) localStorage.setItem("word", "")
    if(!localStorage.getItem("date")) localStorage.setItem("date", "")
    if(!localStorage.getItem("definition")) localStorage.setItem("definition", "")
    if(!localStorage.getItem("example")) localStorage.setItem("example", "")
    if(!localStorage.getItem("score")) localStorage.setItem("score", "0")
    if(!localStorage.getItem("scorestreak")) localStorage.setItem("scorestreak", "0")
    if(!localStorage.getItem("lastAwarded")) localStorage.setItem("lastAwarded", "0")
    if(!localStorage.getItem("userExamples")) localStorage.setItem("userExamples", "{}")
}

function readFromStorage() {
    let todayDate = new Date().setUTCHours(0, 0, 0, 0)
    console.log(todayDate)
    if(localStorage.getItem("date") != todayDate) {
        feednami.load(url).then(feed => {
            firstEntry = feed.entries[0]
            
            title = firstEntry.title.split(" - ")
            wordOfDay = title[1]
            definition = title[2]

            temp = firstEntry.description;
            example = temp.substring(temp.indexOf(":")+1, temp.indexOf(" - ")).trim()

            localStorage.setItem("date", todayDate)
            localStorage.setItem("word", wordOfDay)
            localStorage.setItem("definition", definition)
            localStorage.setItem("example", example)
            localStorage.setItem("userExamples", "{}")
            readFromStorage()
        })
    } else {         
        wordHeader.textContent = localStorage.getItem("word")
        wordDefinition.textContent = localStorage.getItem("definition")
        wordExample.textContent = ""
        
        score = Number.parseInt(localStorage.getItem("score"))

        let words = localStorage.getItem("example")
        
        
        for(word of words.split(" ")) {
            let node = document.createElement("a")
            
            node.setAttribute("href", "https://www.spanishdict.com/translate/"+word)
            node.setAttribute("target", "_blank")
            node.setAttribute("class", "clickable")

            node.textContent = word
            wordExample.appendChild(node)
            wordExample.appendChild(document.createTextNode(" "))
        }

        wordUsages = JSON.parse(localStorage.getItem("userExamples"))
        if(wordUsages.hasOwnProperty('length') && wordUsages.length > 0) {
            for(item of wordUsages) {
               makeUserExampleNode(item)  
            }
            makeUserExampleNode("")
        } else {
            makeUserExampleNode("")
        }
    }
}

function makeUserExampleNode(value) {
    let ud = document.createElement("div")
    let ue = document.createElement("input")

    ue.setAttribute("type", "text")
    ue.setAttribute("class", "user_example ue");
    ue.setAttribute("id", "user_example_"+exampleCount)
    if(value.length > 0) ue.setAttribute("disabled", "true")
    ue.value = value;
    

    let be = document.createElement("button")
    be.setAttribute("class", "edit_button uee")
    be.setAttribute("id", "user_edit_"+exampleCount)
    be.textContent = "Edit"
    be.addEventListener("click", function() {
        if(ue.hasAttribute("disabled")) ue.removeAttribute("disabled")
        updateExamples();
    })
    
    let bs = document.createElement("button")
    bs.setAttribute("class", "submit_button ues")
    bs.setAttribute("id", "user_submit_"+exampleCount)   
    bs.textContent = "Submit"
    bs.addEventListener("click", function() {
        if(ue.value.trim().length > 0) {
            ue.setAttribute("disabled", "true")
            ue.value = ue.value.trim()
            updateScore();
            updateExamples();
        }
    })

    let br = document.createElement("button")
    br.setAttribute("class", "remove_button uer")
    br.setAttribute("id", "user_remove_"+exampleCount)   
    br.textContent = "Remove"
    br.addEventListener("click", function() {
        userSection.removeChild(ud)
        updateExamples();
    })
    
    ud.appendChild(ue)  
    ud.appendChild(be)
    ud.appendChild(bs)
    ud.appendChild(br)
    
    userSection.appendChild(ud)
    exampleCount++
}

function updateExamples() {
    let exampleInputs = document.getElementsByClassName("user_example")
    let examples = []

    for(e of exampleInputs) {
        if(e.disabled) {
            examples.push(e.value)
        }
    }

    localStorage.setItem("userExamples", JSON.stringify(examples))
}

function updateScore() {
    today = localStorage.getItem("date")
    if(localStorage.getItem("lastAwarded") == today) return
    else {
        if(Number.parseInt(today) - Number.parseInt(localStorage.getItem("lastAwarded")) == 86400000) { //1 day
            currentScore = Number.parseInt(localStorage.getItem("score"))
            currentScorestreak = Number.parseInt(localStorage.getItem("scorestreak"))+1
            
            localStorage.setItem("scorestreak", currentScorestreak);
            localStorage.setItem("score", (currentScore + 100*currentScorestreak).toString());
            localStorage.setItem("lastAwarded", today)
        } else {
            localStorage.setItem("score", Number.parseInt(localStorage.getItem("score")+100))
            localStorage.setItem("scorestreak", "1")
            localStorage.setItem("lastAwarded", today)
        }
    }
}

addPracticeButton.addEventListener("click", () => makeUserExampleNode(""))
