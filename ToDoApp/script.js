// =======================
// DOM
// =======================

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");
const progressValue = document.getElementById("progressValue");


// =======================
// STORAGE
// =======================

const STORAGE_KEY = "goals";

function loadGoals(){

return JSON.parse(
localStorage.getItem(STORAGE_KEY)
) || [];

}

function saveGoals(){

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(goals)
);

}


// =======================
// STATE
// =======================

let goals = loadGoals();


// =======================
// ID
// =======================

function createID(){

return Date.now().toString();

}


// =======================
// PROGRESS
// =======================

function updateProgress(){

if(goals.length===0){

progressValue.style.width="0%";
progressValue.textContent="0%";

return;

}

const completed = goals.filter(
g=>g.completed
).length;

const percent = Math.floor(
(completed/goals.length)*100
);

progressValue.style.width=percent+"%";
progressValue.textContent=percent+"%";

}


// =======================
// RENDER
// =======================

function renderGoals(){

goalList.innerHTML="";

goals.forEach(goal=>{

const div=document.createElement("div");

div.className=`goal ${goal.completed?"completed":""}`;

div.dataset.id=goal.id;


// CREATE CHECKBOX

const checkbox=document.createElement("input");

checkbox.type="checkbox";

checkbox.checked=goal.completed;


// CREATE TEXT

const span=document.createElement("span");

span.contentEditable=true;

span.spellcheck=false;

span.textContent=goal.text;


// CREATE DELETE BUTTON

const delBtn=document.createElement("button");

delBtn.className="delete";

delBtn.textContent="Delete";


// EVENTS DIRECTLY ATTACH

checkbox.addEventListener("change",()=>{

goal.completed=checkbox.checked;

saveGoals();

renderGoals();

});

delBtn.addEventListener("click",()=>{

goals=goals.filter(
g=>g.id!==goal.id
);

saveGoals();

renderGoals();

});

span.addEventListener("blur",()=>{

const updatedText=span.textContent.trim();

if(!updatedText){

alert("Goal cannot be empty");

renderGoals();

return;

}

goal.text=updatedText;

saveGoals();

});


// APPEND

div.appendChild(checkbox);

div.appendChild(span);

div.appendChild(delBtn);

goalList.appendChild(div);

});

updateProgress();

}


// =======================
// ADD GOAL
// =======================

function addGoal(){

const text=goalInput.value.trim();

if(!text){

alert("Enter Goal First");

return;

}

goals.push({

id:createID(),

text,

completed:false

});

goalInput.value="";

saveGoals();

renderGoals();

}


// =======================
// BUTTON
// =======================

addGoalBtn.addEventListener(

"click",

addGoal

);


// ENTER ADD

goalInput.addEventListener(

"keydown",

(e)=>{

if(e.key==="Enter"){

addGoal();

}

});


// =======================
// INIT
// =======================

renderGoals();