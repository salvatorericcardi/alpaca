// globals
var getCanvas

const isSelected = label => label.classList.contains("selected")
const isChecked = label => label.previousElementSibling.checked
const randomAlpaca = key => Math.floor(Math.random() * key.length)

const resetRadioButtons = inputs => {
    for(const el of inputs) {
        el.classList.remove("selected")
        el.previousElementSibling.checked = false
    }
}

/* const isScrolledToRight = (el) => {
    // IT WORKS
    // NOTE: scrollLeft is fractional, while scrollWidth and clientWidth are
    // not, so without this Math.abs() trick then sometimes the result won't
    // work because scrollLeft may not be exactly equal to el.scrollWidth -
    // el.clientWidth when scrolled to the right
    return Math.abs(el.scrollWidth - el.clientWidth - el.scrollLeft) * 0.66 < 1
} */

const lastAlpaca = {
    accessories: null,
    backgrounds: null,
    ears: "default-ears",
    eyes: "default-eyes",
    hair: "default-hair",
    leg: "default-leg",
    mouth: "default-mouth",
    neck: "default-neck",
}

const alpaca = {
    accessories: [],
    backgrounds: [],
    ears: [],
    eyes: [],
    hair: [],
    leg: [],
    mouth: [],
    neck: []
}

const selectedEl = {}

// every accessory has onclick event
for(const el of document.getElementsByClassName("accessory")) {
    el.addEventListener("click", (e) => {
        // toggle selected class on label click
        e.target.classList.toggle("selected")

        // if label is selected set input checked if not remove checked
        if(isSelected(e.target)) {
            e.target.previousElementSibling.setAttribute("checked", true)
            document.getElementById(`${e.target.previousElementSibling.value}-style`).style.display = "contents"
            
            selectedEl[e.target.previousElementSibling.value] = e.target.previousElementSibling.value
        } else {
            e.target.previousElementSibling.removeAttribute("checked")
            document.getElementById(`${e.target.previousElementSibling.value}-style`).style.display = "none"
            delete selectedEl[e.target.previousElementSibling.value]
        }

        localStorage.setItem("selectedEl", JSON.stringify(selectedEl))
    })
}

// every style has onclick event
for(const el of document.getElementsByClassName("styles")) {
    // foreach value populate alpaca obj with its group and the relative values
    alpaca[el.classList[1]].push(el.classList[1] === el.previousElementSibling.id.split("-")[1] ? el.previousElementSibling.id.split("-")[0] : el.previousElementSibling.id.split("-").slice(0, 2).join("-"))

    el.addEventListener("click", (e) => {
        if(!isChecked(e.target)) {
            // reset radio buttons in the input group
            if(localStorage.getItem("selectedEl")) {
                const selectedEl = JSON.parse(localStorage.getItem("selectedEl"))
                for(const sel of Object.keys(selectedEl)) {
                    if(sel === e.target.previousElementSibling.name) {
                        resetRadioButtons(document.getElementsByClassName(sel))
                    }
                }
            }

            e.target.classList.add("selected")
            e.target.previousElementSibling.checked = true

            // change alpaca image src here
            const last = e.target.classList[1] === e.target.previousElementSibling.id.split("-")[1] ? e.target.previousElementSibling.id.split("-")[0] : e.target.previousElementSibling.id.split("-").slice(0, 2).join("-")
            document.getElementById(e.target.classList[1]).src = `images/${e.target.classList[1]}/${last}.png`

            if(e.target.classList[1] === "backgrounds") {
                document.getElementById("alpaca-container").style.backgroundColor = "transparent"   
            }

            lastAlpaca[e.target.classList[1]] = e.target.previousElementSibling.id
        }

        html2canvas(document.getElementById("alpaca-container"), {
            backgroundColor: null
        }).then(canvas => getCanvas = canvas)

        localStorage.setItem("lastAlpaca", JSON.stringify(lastAlpaca))
    })
}

// every arrow button has on click event
for(const el of document.getElementsByClassName("arrow")) {
    el.addEventListener("click", (e) => {
        e.preventDefault()
        const parent = e.target.parentElement
        // const arrows = document.getElementsByClassName("arrow")

        // if click on right arrow and not scrollend enter in the loop
        if(e.target.classList.contains("right") /* && !isScrolledToRight(parent.previousElementSibling) */) {
            // move to the right
            parent.previousElementSibling.scrollLeft += parent.previousElementSibling.getBoundingClientRect().width

            /* if(arrows[0].classList.contains("disabled")) {
                arrows[0].classList.remove("disabled")
                arrows[0].disabled = false
            }

            // if container position at end disable right arrow
            if(isScrolledToRight(parent.previousElementSibling)) {
                arrows[1].classList.add("disabled")
                arrows[1].disabled = true
            } */
        // if click on left arrow and not scrollstart enter in the loop
        } else if (e.target.classList.contains("left") /* && Math.abs(parent.nextElementSibling.scrollLeft) >= 1 */) {
            // move to the left
            parent.nextElementSibling.scrollLeft -= parent.nextElementSibling.getBoundingClientRect().width

            /* if(arrows[1].classList.contains("disabled")) {
                arrows[1].classList.remove("disabled")
                arrows[1].disabled = false
            }

            // if container position at start disable left arrow 
            if(!arrows[0].classList.contains("disabled") && Math.abs(parent.nextElementSibling.scrollLeft) < 1) {              
                arrows[0].classList.add("disabled")
                arrows[0].disabled = true
            } */
        }
    })
}

// random alpaca button
document.getElementById("random").addEventListener("click", () => {
    for(const key of Object.keys(alpaca)) {
        lastAlpaca[key] = alpaca[key][randomAlpaca(alpaca[key])]
        document.getElementById(key).src = `images/${key}/${lastAlpaca[key]}.png`

        if(key === "backgrounds") {
            document.getElementById("alpaca-container").style.backgroundColor = "transparent"   
        }
    }

    html2canvas(document.getElementById("alpaca-container"), {
        backgroundColor: null
    }).then(canvas => getCanvas = canvas)
})

// html2canvas on dom content loaded
document.addEventListener("DOMContentLoaded", () => {
    html2canvas(document.getElementById("alpaca-container"))
    .then(canvas => getCanvas = canvas)
})

// download button
document.getElementById("download").addEventListener('click', () => {
    const imageData = getCanvas.toDataURL("image/png")
    const download = document.getElementById("download")

    // Now browser starts downloading it instead of just showing it
    var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream")
    download.setAttribute("download", "alpaca.png")
    download.setAttribute("href", newData)
})

document.addEventListener("DOMContentLoaded", () => {
    confirm("Do you want to clear localStorage?") ? localStorage.clear() : null
})