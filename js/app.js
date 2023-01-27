const inputTodo = $("#todo");
const todoList = $(".form-group").eq(1);
const search = $("#search");
const firstCardBody = $(".card-body").eq(0);
const containerDiv = $(".container");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
$(window).on("load", () => {
  todos.forEach((newTodo) => {
    addList(newTodo);
  });
  search.keyup(filterTodos);
});
containerDiv.on("click", (e) => {
  e.preventDefault();
  // ! addtodo button event
  if (e.target.classList.contains("addTodo")) {
    if (!inputTodo.val()) {
      showAlert("danger", "Please enter a todo");
    } else {
      showAlert("success", "Your todo successfully added !");
      const newTodoObject = {
        id: ID(),
        isDone: false,
        content: inputTodo.val(),
      };
      todos.push(newTodoObject);
      //?todos dizisinin son halini localStorage'e sakla
      localStorage.setItem("todos", JSON.stringify(todos));
      addList(newTodoObject);
      inputTodo.val("");
      // !============================================
      // addTodoToStorage(newTodo);
    }
  } else if (e.target.classList.contains("fa-remove")) {
    //? Dizinin ilgili elementini sildi
    if (e.target.closest("li").classList.contains("checked")) {
      todos = todos.filter(
        (newTodo) => newTodo.id != $(e.target).closest("li").attr("id")
      );
      e.target.closest("li").remove();
      localStorage.setItem("todos", JSON.stringify(todos));
      showAlert("success", `${$(e.target).closest("li").text()} removed`);
    } else {
      showAlert("danger", "Please complete the todo");
    }
  } else if (e.target.classList.contains("fa-check")) {
    // todos dizisindeki ilgili elementin isDone kismini güncelle
    todos.map((newTodo, index) => {
      if (newTodo.id == $(e.target).closest("li").attr("id")) {
        todos[index].isDone = !todos[index].isDone;
      }
    });
    //?todos dizisinin son halini localStorage'e sakla
    localStorage.setItem("todos", JSON.stringify(todos));
    if (e.target.parentElement.classList.contains("checked")) {
      $(e.target).parent().removeClass("checked");
    } else {
      //? ilgili 'li' elementinde checked adinda bir class yoksa ekle
      $(e.target).parent().addClass("checked");
    }
    // ! Bütün childları silme
  } else if (e.target.classList.contains("btn-danger")) {
    let ul = $(e.target).prev().prev()
    console.log($(e.target).prev().prev().children().length);
    if (ul.children().length > 0) {
      if (confirm("Are you sure to delete all todos ?")) { 
          ul.empty();
          localStorage.removeItem("todos"); 
      }
    } else { 
      showAlert("danger", "No Todos left to delete");
    }
  }
});
// ! element oluşturma

function addList(newTodo) {
  //? her bir todo objesini destructure yaptık
  const { id, content, isDone } = newTodo;
  todoList.append(`
     <li class="form-group-item d-flex justify-content-between ${
       isDone ? "checked" : ""
     } " id=${id} >
     <i class="fa-solid fa-check"></i>
         <p>${content}</p>
         <a href="#" class="delete-item"><i class="fa fa-remove "></i></a>
    </li>`);
}

// ! filter todos
function filterTodos(e) {
  console.log($(e.target.nodeName));
  const filterValue = e.target.value.toLocaleLowerCase();
  const listItems = document.querySelectorAll(".form-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      listItem.setAttribute("style", "display : none !important");
    } else {
      listItem.setAttribute("style", "display : block");
    }
  });
}
//  ! id function
function ID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
// ! alerttttttt ================

function showAlert(type, message) {
  firstCardBody.append(`
  <div class="alert alert-${type}">
    ${message} 
  </div>
  `);
  // * set timeout
  setTimeout(function () {
    $(".alert").remove();
  }, 1000);
}
