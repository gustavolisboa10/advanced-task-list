//seleção de elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const filterBtn = document.querySelector("#filter-select")

//variavel criada para gardar valores antigos 

let oldInputValue

//funções 
const saveTodo = (text, done = 0, save = 1)=>{
const todo = document.createElement("div")
todo.classList.add("todo") // add uma classe na div criada acima.

const todoTitle = document.createElement("h3")
todoTitle.innerText = text // texto recebido pelo input (save todo)
todo.appendChild(todoTitle) //coloca o texto para ser mostrado em formato h3

const doneBtn = document.createElement("button")
doneBtn.classList.add("finish-todo")
doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
todo.appendChild(doneBtn)

const editBtn = document.createElement('button')
editBtn.classList.add("edit-todo")
editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
todo.appendChild(editBtn)

const deleteBtn = document.createElement('Button')
deleteBtn.classList.add('remove-todo')
deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
todo.appendChild(deleteBtn)

// utilizando dados da localStorage
if(done){
todo.classList.add("done")
}

if(save){
saveTodoLocalStorage ({text, done})

}


todoList.appendChild(todo) // quado a estrutura esta montadda coloca dentro do elemento pai

todoInput.value = "" //limpa a caixa de texto
todoInput.focus() // funçao pronta do js para dar foco na tela.

}
const toggleForms = ()=>{   //esconde um formulario e mostra outro
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

    const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")
    
    todos.forEach((todo) => {
    
        let todoTitle = todo.querySelector('h3') // primeiro selecionamos o elemento ()

        if(todoTitle.innerText === oldInputValue){ // depois pegamos a propriedade que queremos
            todoTitle.innerText =text

            updateTodoLocalStorage(oldInputValue, text)
        }
    })
}

const getSearchTodos = (search)=>{
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo)=>{
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase()

    const normalizedSearch = search.toLowerCase()
   
        todo.style.display='flex'
    if(!todoTitle.includes(normalizedSearch)){
        todo.style.display='none'

  }

 })

}

const filterTdodos = (filterValue)=>{

    const todos = document.querySelectorAll('.todo')

    switch (filterValue) {
        case 'all':
        todos.forEach((todo) => todo.style.display = 'flex')
            break;
        case 'done':
        todos.forEach((todo) => todo.classList.contains('done')
            ? todo.style.display = 'flex'
            : todo.style.display = 'none') //ternarios = se tiver done imprima flex se não imprima none
            break;
         case 'todo':
        todos.forEach((todo) => 
            !todo.classList.contains('done') // se não tiver vai ser flex se tiver vai ser none.
            ? todo.style.display = 'flex'
            : todo.style.display = 'none')
        default:
            break;
    }
}

//eventos
todoForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const inputValue =  todoInput.value

    if(inputValue){
    saveTodo(inputValue) //função que enviara o valor 
}
})

//removendo tarefa

document.addEventListener('click',(e)=>{
    const targetElement = e.target //cria a constante para receber o elemento alvo (clicado)
    const parentElement = targetElement.closest('div') // acessar o elemento div mais proximo do botão.
    let todoTitle // let em escopo global

        if (parentElement && parentElement.querySelector('h3')){
                todoTitle = parentElement.querySelector('h3').innerText

        }
        if (targetElement.classList.contains('finish-todo')){
                parentElement.classList.toggle('done') // toggle faz inversão te possibilitando de errar a escolha, ex: completar e descompletar.(se tem a classe ele tira se não tem ele coloca)

                updateTodoStatusLocalStorage(todoTitle)
        }if (targetElement.classList.contains("remove-todo")){
                parentElement.remove()// removendo elemento pai do btn

                removeTodoLocalStorage(todoTitle)
        }if (targetElement.classList.contains("edit-todo")){
                toggleForms()
            
            editInput.value = todoTitle // muda o valor do input
            oldInputValue = todoTitle // salva o valor na variavel old
        }      
})

cancelEditBtn.addEventListener('click',(e)=>{
    e.preventDefault()

    toggleForms()

})

editForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue){
       updateTodo(editInputValue)
    }  
    toggleForms()
})

searchInput.addEventListener('keyup',(e)=>{

    const search = e.target.value

    getSearchTodos(search)

})

eraseBtn.addEventListener("click", (e)=>{
    e.preventDefault()

    searchInput.value = ""

    searchInput.dispatchEvent(new Event("keyup"))

})

filterBtn.addEventListener ('change',(e)=>{

    const filterValue = e.target.value

    filterTdodos(filterValue)
})

                          //local storage
const getTodosLocalStorage = ()=>{
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos
}

const loadTodos = ()=>{
    const todos = getTodosLocalStorage()  
    todos.forEach((todo)=>{
    saveTodo(todo.text, todo.done,0) // text = argumento |done = status| 0= salvar
    })
}

const saveTodoLocalStorage =  (todo)=> {

//todos os todos da local storage

const todos = getTodosLocalStorage()

// add o novo todo no array
    todos.push(todo)
//salvar tudo na ls
localStorage.setItem("todos", JSON.stringify(todos))

}
const removeTodoLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) => todo.text !==todoText)

    localStorage.setItem("todos", JSON.stringify(filteredTodos))
}

const updateTodoStatusLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage()
    todos.map((todo)=> todo.text === todoText ? todo.done = !todo.done:null) //map modifica o array original
    localStorage.setItem("todos", JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText,todoNewText)=>{
    const todos = getTodosLocalStorage()

    todos.map((todo)=> todo.text === todoOldText ? (todo.text =todoNewText ) :null)
    localStorage.setItem("todos", JSON.stringify(todos))
}


loadTodos()


