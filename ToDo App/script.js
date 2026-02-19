
// ======================
// DOM
// ======================

const goalInput =
document.getElementById("goalInput")

const addGoalBtn =
document.getElementById("addGoalBtn")

const goalList =
document.getElementById("goalList")

const progressValue =
document.getElementById("progressValue")



// ======================
// STORAGE
// ======================

const STORAGE_KEY = "goals"



function loadGoals(){

return JSON.parse(

localStorage.getItem(STORAGE_KEY)

) || []

}



function saveGoals(){

localStorage.setItem(

STORAGE_KEY,

JSON.stringify(goals)

)

}



// ======================
// STATE
// ======================

let goals = loadGoals()



// ======================
// UNIQUE ID
// ======================

function createID(){

return Date.now().toString()

}



// ======================
// PROGRESS BAR
// ======================

function updateProgress(){

if(!goals.length){

progressValue.style.width="0%"

progressValue.textContent="0%"

return

}

const completed =

goals.filter(

goal=>goal.completed

).length


const percent = Math.floor(

(completed/goals.length)*100

)

progressValue.style.width=

percent+"%"

progressValue.textContent=

percent+"%"

}



// ======================
// RENDER
// ======================

function renderGoals(){

goalList.innerHTML=""


goals.forEach(goal=>{

const div=document.createElement("div")

div.className=

`goal ${goal.completed?"completed":""}`


div.dataset.id=goal.id


div.innerHTML=

`

<input type="checkbox"

${goal.completed?"checked":""}

/>

<span contenteditable="true"

spellcheck="false"

>

${goal.text}

</span>


<button class="delete">

Delete

</button>

`

goalList.appendChild(div)

})

updateProgress()

}



// ======================
// ADD GOAL
// ======================

function addGoal(){

const text = goalInput.value.trim()

if(!text) return


goals.push({

id:createID(),

text,

completed:false

})


goalInput.value=""

saveGoals()

renderGoals()

}



// ======================
// CLICK EVENTS
// ======================

goalList.addEventListener(

"click",

(e)=>{

const goalDiv =

e.target.closest(".goal")

if(!goalDiv) return


const id = goalDiv.dataset.id


const goal =

goals.find(

g=>g.id === id

)


// COMPLETE

if(e.target.matches(

'input[type="checkbox"]'

)){

goal.completed =

e.target.checked

saveGoals()

renderGoals()

}


// DELETE

if(e.target.classList.contains(

"delete"

)){

goals = goals.filter(

g=>g.id !== id

)

saveGoals()

renderGoals()

}

}

)



// ======================
// AUTO SAVE EDIT
// ======================

goalList.addEventListener(

"blur",

(e)=>{

if(!e.target.matches("span"))

return


const goalDiv =

e.target.closest(".goal")

const id = goalDiv.dataset.id


const goal =

goals.find(

g=>g.id === id

)


const updatedText =

e.target.textContent.trim()


if(!updatedText){

alert("Goal cannot be empty")

renderGoals()

return

}

goal.text = updatedText

saveGoals()

},

true // important (capture phase)

)



// ======================
// ADD BUTTON
// ======================

addGoalBtn.addEventListener(

"click",

addGoal

)



// ENTER KEY ADD

goalInput.addEventListener(

"keydown",

(e)=>{

if(e.key === "Enter"){

addGoal()

}

})



// ======================
// INIT
// ======================

renderGoals()
