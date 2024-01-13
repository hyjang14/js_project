// 유저가 값을 입력한다.
// + 버튼을 클릭하면, 할일이 추가된다.
// delete 버튼을 누르면 할일이 삭제된다.
// check 버튼을 누르면 할일이 끝나면서 밑줄이 간다.
// 1. check 버튼을 클릭하는 순간 true를 false로 변경
// 2. true이면 끝난 것으로 간주하고 밑줄 치기.
// 3. false이면 인 끝난 것으로 간주하고 그대로.

// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
// 끝남탭은 끝난 아이템만, 진행중탭은 진행중인 아이템만
// 전체탭을 누르면 다시 전체아이템으로 돌아온다.

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
// querySelectorAll: 괄호 안 조건에 만족하는 모든 것 들고 온다.
let tabs = document.querySelectorAll(".task-tabs div");
let taskList = [];
let mode = "all";
let filterList = [];
let underLine = document.getElementById("under-line");

taskInput.addEventListener('focus', function () {
    taskInput.value = '';
  });

addButton.addEventListener("click", addTask);

// 위에 메뉴 누르면 filter 되도록
for(let i = 1; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function(event){
        filter(event)
    });
}

// 할 일 추가 함수
function addTask() {
    let task = {
        id: randomIDGenerate(),
        taskContent: taskInput.value,
        isComplete: false
    };
    taskList.push(task);
    console.log(taskList);
    render();
}

// UI 담당 함수: HTML 다시 그려주는 역할
function render() {
    // 1. 내가 선택한 탭에 따라서
    if(mode == "all") {
        list = taskList;
    }
    else if(mode == "ongoing" || mode == "done") {
        list = filterList;
    }

    // 2. 리스트를 달리 보여준다
    let resultHTML = "";
    for(let i = 0; i < list.length; i++) {
        if(list[i].isComplete == true) {
            resultHTML += `<div class="task">
            <div class="task-done">${list[i].taskContent}</div>
            <div class="button-box">
            <button onclick="toggleDone('${list[i].id}')">Check</button>
            <button onclick="deleteTask('${list[i].id}')">Delete</button>
            </div>
        </div>`;
        }
        else {
            resultHTML += `<div class="task">
            <div>${list[i].taskContent}</div>
            <div class="button-box"> 
                <button onclick="toggleComplete('${list[i].id}')">Check</button>
                <button onclick="deleteTask('${list[i].id}')">Delete</button>
            </div>
        </div>`;
        }
    }

    document.getElementById("task-board").innerHTML = resultHTML;
}

// 완료 함수
function toggleComplete(id) {
    for(let i = 0; i < taskList.length; i++) {
        if(taskList[i].id == id) {
            // ! 써서 true, false 왔다갔다 할 수 있도록 함(스위치같이) 
            taskList[i].isComplete = !taskList[i].isComplete;
            break; // 찾는 순간 반복문 나오도록 
        }
    }
    render(); /* 완료하면 다시 함수 불러서 UI 바꾸기 */
    console.log(taskList);
}
 
// 삭제 함수
function deleteTask(id) {
    for(let i = 0; i < taskList.length; i++) {
        if(taskList[i].id === id) {
            taskList.splice(i, 1);
        }
    }
    filter(); // UI도 같이 업데이트
    // but 진행중, 완료 탭에서도 같이 삭제되기 위해서는 render()말고 filter()를 부른다.
    // filter 한 번 거쳐서 render 부르면 UI도 같이 변경된다.
}

// 필터링하는 함수
function filter(event) {
    if(event) {
        mode = event.target.id;
        underLine.style.width = event.target.offsetWidth + "px";
        underLine.style.left = event.target.offsetLeft + "px";
        underLine.style.top = event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
    }
    // event가 target한 것이 뭐냐: event.target.id
    filterList = [];

    if(mode === "all") {
        //전체 리스트 보여준다.
        render();
    }
    else if(mode === "ongoing") {
        //진행중인 아이템을 보여준다.
        //task.isComplete = false
        for(let i = 0; i < taskList.length; i++) {
            if(taskList[i].isComplete == false) {
                filterList.push(taskList[i]);
            }
        }
        render();
    }
    else if(mode === "done") {
        //끝나는 케이스
        //task.isComplete = true
        for(let i = 0; i < taskList.length; i++) {
            if(taskList[i].isComplete == true) {
                filterList.push(taskList[i]);
            }
        }
        render();
    }
}

// 랜덤 id 생성 함수
function randomIDGenerate() {
    // 랜덤 id 만드는 코드: 구글 서치 
    return Math.random().toString(36).substr(2, 16);
}