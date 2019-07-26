let url = "https://www.spanishdict.com/wordoftheday/feed";

let wordDiv = document.getElementById("extension")
let wordHeader = document.getElementById("word")
let wordDefinition = document.getElementById("definition")
let wordExample = document.getElementById("example")


let phraseOfDay = ""

window.onload = (function() {
    setupStorage();
    setWords();
    wordDiv.style.display = "block";
})

function setupStorage() {
    if(!localStorage.getItem("word")) localStorage.setItem("word", "")
    if(!localStorage.getItem("date")) localStorage.setItem("date", "")
    if(!localStorage.getItem("definition")) localStorage.setItem("definition", "")
    if(!localStorage.getItem("example")) localStorage.setItem("example", "")
}

function setWords() {
    let todayDate = new Date().setHours(0, 0, 0, 0)
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
            setWords()
        })
    } else {         
        wordHeader.textContent = localStorage.getItem("word")
        wordDefinition.textContent = localStorage.getItem("definition")
        wordExample.textContent = ""
        let words = localStorage.getItem("example")
        
        for(word of words.split(" ")) {
            let node = document.createElement("a")
            node.setAttribute("href", "https://www.spanishdict.com/translate/"+word)
            node.setAttribute("class", "clickable")
            node.textContent = word
            wordExample.appendChild(node)
            wordExample.appendChild(document.createTextNode(" "))
        }
    }
}




