const ul = document.querySelector("ul");

const counterElement = document.querySelector("#counter");
counterElement.addEventListener("click", generateList);

const deleteElement = document.querySelector("#delete");
deleteElement.addEventListener("click", deleteList);

const deleteAllElement = document.querySelector("#deleteAll");
deleteAllElement.addEventListener("click", deleteAllList);

let x = 10;
const increase = document.querySelector("#plus")
increase.onClick = function () {
  x++;
};

const minus = document.querySelector("#minus")

function generateList() {
  for (let i = 1; i <= x; i++) {
    const li = document.createElement("li");
    li.innerText = i;
    ul.appendChild(li);
  }
}

function deleteList() {
  const liRemove = ul.lastElementChild;
  if (liRemove) {
    ul.removeChild(liRemove);
  } else {
    console.log("Hey, es gibt keine Listenelemente mehr!!!");
    alert("Hey, es gibt keine Listenelemente mehr!!!")
  }
}

function deleteAllList() {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}
