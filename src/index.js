import "./reset.css";
import "./styles.css";

console.log("Hello World");

const todoApp = (function () {
  let projects = [
    {
      id: -1,
      name: "Home",
      todos: [],
    },
    {
      id: 1,
      name: "Workout",
      todos: [],
    },
    {
      id: 2,
      name: "School",
      todos: [],
    },
  ];

  createTodo("Take the trash out", "", "No date", "medium", -1),
  createTodo("Do the dishes", "", "No date", "high", -1);
  createTodo("Lift very heavy weight", "", "2024-09-15", "medium", 1);
  let currentProjectId = -1;

  function createProject(name) {
    const project = {
      id: Math.random(),
      name: name,
      todos: [],
    };

    projects.push(project);
    return project;
  }

  function createTodo(name, description, dueDate, priority, projectId) {
    const project = projects.find((p) => p.id === projectId);
    const todo = {
      id: Date.now() + Math.random(),
      name,
      description,
      dueDate,
      priority,
      completed: false,
    };

    project.todos.push(todo);

    return todo;
  }

  const getProjects = () => {
    return projects;
  };

  function setCurrentProject(projectId) {
    currentProjectId = projectId;
  }

  function getCurrentProject() {
    return projects.find((p) => p.id === currentProjectId);
  }

  function toggleTodoCompletion(projectId, todoId) {
    const project = projects.find((p) => p.id === projectId);
    const todo = project.todos.find((t) => t.id === todoId);
    if (todo) {
      todo.completed = !todo.completed;
      return todo.completed;
    }
    return false;
  }

  function deleteProject(projectId) {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      projects.splice(projectIndex, 1);
    }
  }

  function deleteTodo(todoId, projectId) {
    const project = projects.find((p) => p.id === projectId);
    const todoIndex = project.todos.findIndex((t) => t.id === todoId);
    if (todoIndex !== -1) {
      project.todos.splice(todoIndex, 1);
    }
  }

  return {
    createProject,
    createTodo,
    getProjects,
    setCurrentProject,
    deleteProject,
    deleteTodo,
    getCurrentProject,
    toggleTodoCompletion,
  };
})();

const domHandler = (function () {
  const projectForm = document.querySelector("#project-form");
  const todoForm = document.querySelector("#todo-form");

  function renderProjects() {
    const projectsList = document.querySelector(".projects ul");

    while (projectsList.firstChild) {
      projectsList.removeChild(projectsList.firstChild);
    }

    todoApp.getProjects().forEach((project) => {
      if (project.id === -1) return;
      const li = renderProject(project.name, project.id);
      li.addEventListener("click", () => {
        todoApp.setCurrentProject(project.id);
        domHandler.renderCurrentProject();
      });
      projectsList.appendChild(li);
    });
  }

  function renderProject(name, projectId) {
    const li = document.createElement("li");

    const folderSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    folderSvg.setAttribute("viewBox", "0 0 24 24");
    folderSvg.setAttribute("fill", "currentColor");
    folderSvg.classList.add("size-6");

    const folderPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    folderPath.setAttribute(
      "d",
      "M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z"
    );

    folderSvg.appendChild(folderPath);

    const closeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    closeSvg.setAttribute("viewBox", "0 0 24 24");
    closeSvg.setAttribute("fill", "currentColor");
    closeSvg.classList.add("size-6");

    const closePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    closePath.setAttribute("fill-rule", "evenodd");
    closePath.setAttribute(
      "d",
      "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
    );
    closePath.setAttribute("clip-rule", "evenodd");

    closeSvg.appendChild(closePath);

    const div = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = name;

    div.appendChild(folderSvg);
    div.appendChild(p);
    li.appendChild(div);
    li.appendChild(closeSvg);

    closeSvg.addEventListener("click", (event) => {
      event.stopPropagation();
      removeProjectFromDOM(li, projectId);
    });

    closeSvg.style.display = "none";

    li.addEventListener("mouseover", () => {
      closeSvg.style.display = "block";
    });
    li.addEventListener("mouseout", () => {
      closeSvg.style.display = "none";
    });
    return li;
  }

  function renderTodo(todo) {
    const li = document.createElement("li");
    li.dataset.todoId = todo.id;
    const div1 = document.createElement("div");
    div1.classList.add("task");
    const div2 = document.createElement("div");
    div2.classList.add("date");
    const button = document.createElement("button");

    const task = document.createElement("p");
    task.classList.add("task");
    task.textContent = todo.name;

    const date = document.createElement("p");
    date.classList.add("date");
    date.textContent = todo.dueDate;
    date.classList.add(todo.priority.toLowerCase());

    div2.appendChild(date);
    const span = document.createElement("span");
    const closeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    closeSvg.setAttribute("viewBox", "0 0 24 24");
    closeSvg.setAttribute("fill", "currentColor");
    closeSvg.classList.add("size-6");

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute(
      "d",
      "M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z"
    );

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute(
      "d",
      "m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
    );
    path2.setAttribute("clip-rule", "evenodd");

    closeSvg.appendChild(path1);
    closeSvg.appendChild(path2);
    span.appendChild(closeSvg);
    div2.appendChild(span);

    div1.appendChild(button);
    div1.appendChild(task);
    li.appendChild(div1);
    li.appendChild(div2);

    applyTodoCompletionState(li, button, todo.completed);

    closeSvg.addEventListener("click", (event) => {
      event.stopPropagation();
      removeTodoFromDOM(li, todo.id);
    });

    button.addEventListener("click", () => {
      const isCompleted = todoApp.toggleTodoCompletion(
        todoApp.getCurrentProject().id,
        todo.id
      );
      applyTodoCompletionState(li, button, isCompleted);
    });

    return li;
  }

  function renderCurrentProject() {
    const currentProject = todoApp.getCurrentProject();
    console.log("Rendering current project:", currentProject.name);
    document.querySelector(".body .title").textContent = currentProject.name;
    const list = document.querySelector(".body ul");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    currentProject.todos.forEach((element) => {
      list.appendChild(renderTodo(element));
    });
  }

  projectForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const projectName = this.querySelector('input[name="name"]').value;

    console.log("New project:", projectName);
    todoApp.createProject(projectName);
    renderProjects();

    event.target.reset();
    removeForm("project-form");
  });

  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const todoName = this.querySelector('input[name="name"]').value;
    const todoDescription = this.querySelector(
      'textarea[name="description"]'
    ).value;
    let todoDueDate = this.querySelector('input[name="dueDate"]').value;
    const todoPriority = this.querySelector('select[name="priority"]').value;

    todoDueDate = todoDueDate === "".trim() ? "No date" : todoDueDate; // Defaults to "No date"
    console.log("New todo:", {
      todoName,
      todoDescription,
      todoDueDate,
      todoPriority,
    });
    todoApp.createTodo(
      todoName,
      todoDescription,
      todoDueDate,
      todoPriority,
      todoApp.getCurrentProject().id
    );
    renderCurrentProject();

    event.target.reset();
    removeForm("todo-form");
  });

  function applyTodoCompletionState(todoElement, buttonElement, isCompleted) {
    const taskElement = todoElement.querySelector(".task");
    const dateElement = todoElement.querySelector(".date");

    if (taskElement && dateElement && buttonElement) {
      if (isCompleted) {
        taskElement.classList.add("completed");
        dateElement.classList.add("completed");
        buttonElement.classList.add("completed");
      } else {
        taskElement.classList.remove("completed");
        dateElement.classList.remove("completed");
        buttonElement.classList.remove("completed");
      }
    }
  }

  function removeProjectFromDOM(projectElement, projectId) {
    const projectsList = document.querySelector(".projects ul");
    projectsList.removeChild(projectElement);
    todoApp.deleteProject(projectId);
    todoApp.setCurrentProject(-1);
    renderCurrentProject();
  }

  function removeTodoFromDOM(todoElement, todoId) {
    const list = document.querySelector(".body ul");
    list.removeChild(todoElement);
    todoApp.deleteTodo(todoId, todoApp.getCurrentProject().id);
    renderCurrentProject();
  }

  function renderForm(formId) {
    document.querySelector(`#${formId}`).style.display = "grid";
  }

  function removeForm(formId) {
    document.querySelector(`#${formId}`).style.display = "none";
  }

  function init() {
    renderProjects();
    renderCurrentProject();

    document.querySelector(".home").addEventListener("click", () => {
      todoApp.setCurrentProject(-1);
      renderCurrentProject();
    });

    // document.querySelector(".today").addEventListener("click", () => {
    //     renderCurrentProject();
    // });

    document
      .querySelector(".sidebar .new-task")
      .addEventListener("click", () => renderForm("project-form"));
    document
      .querySelector(".body .new-task")
      .addEventListener("click", () => renderForm("todo-form"));

    document
      .querySelector("#project-form form span")
      .addEventListener("click", () => removeForm("project-form"));
    document
      .querySelector("#todo-form form span")
      .addEventListener("click", () => removeForm("todo-form"));
  }

  return {
    init,
    renderCurrentProject,
    renderProjects,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  domHandler.init();
});
