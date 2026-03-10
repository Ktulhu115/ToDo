let lists = {
  'daily': [],
  'important': [],
  'to buy': [],
  'archive': []
}; //новые массивы со списками
let currentList = 'daily';

let taskInput = document.getElementById('taskInput'); //поле ввода
let addBtn = document.getElementById('addBtn'); //кнопка
let taskList = document.getElementById('taskList'); //Список задач 

function addTask() {
  let text = taskInput.value;// value — это свойство, где хранится введённый текст
  if (text.trim() === '') {
      alert('add task!');
  return;
}

  let newTask = {
    text: text,
     completed: false
  };
  lists[currentList].push(newTask); // push добавляет элемент в конец массива
  taskInput.value = '';// Просто присваиваем пустую строку
  saveToStorage();//сохраняемся?
   renderTasks();  
}
// 🔥 НОВЫЕ ФУНКЦИИ
function switchList(listName) {
  currentList = listName;
   // УПРАВЛЕНИЕ ВИДИМОСТЬЮ КНОПКИ ОЧИСТКИ АРХИВА
  let archiveBox = document.querySelector('.controlArchive');
  if(listName === 'archive') {
    archiveBox.style.display = 'block'; //показать в архиве
  } else {
    archiveBox.style.display = 'none'; //спрятать в архиве
  }
  saveToStorage();
  renderTasks();
}
function saveToStorage() {
  localStorage.setItem('todoLists', JSON.stringify(lists));
}
function loadFromStorage() {
  let saved = localStorage.getItem('todoLists');
  if (saved) {
    lists = JSON.parse(saved);
    }
  // ✅ ПРОВЕРЯЕМ: есть ли у нас ВСЕ нужные списки?
  // Если какого-то нет — создаём пустой массив
  
  if (!lists.daily) lists.daily = [];
  if (!lists.important) lists.important = [];
  if (!lists['to buy']) lists['to buy'] = [];
  if (!lists.archive) lists.archive = [];
  
  renderTasks();
}
function renderTasks() {
  taskList.innerHTML = '';
  
  let currentTasks = lists[currentList];
  currentTasks.forEach(function(task) {
  let li = document.createElement('li');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;//ставим галку на выполненное
    //новая часть
    checkbox.addEventListener('change', function() {
      task.completed = checkbox.checked;
      if (task.completed) {
        // Найти индекс задачи в текущем списке
        let index = lists[currentList].indexOf(task);
        // Удалить её из текущего списка
        let removed = lists[currentList].splice(index, 1)[0];
        //add to archive
        lists.archive.push(removed);
        
      }
      
      saveToStorage();
      renderTasks();
    });
    li.appendChild(checkbox); //сначала чекбокс
    let textNode = document.createTextNode(' ' + task.text);//пробел для красоты
    li.appendChild(textNode);
    taskList.appendChild(li);
  });
}
loadFromStorage();
//  Принудительно ставим список "daily" при старте (чтобы не открывался архив)
switchList('daily');

addBtn.addEventListener('click', addTask);
//Находим все кнопки д перекл списков

document.querySelectorAll('.list-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    switchList(this.dataset.list);
  });
});
document.getElementById('cleanArchive').addEventListener('click', function() {
  lists.archive = []; // очистили архив
  saveToStorage(); // сохранили
  renderTasks();  // перерисовали
});
