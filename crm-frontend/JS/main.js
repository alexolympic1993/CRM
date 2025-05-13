import { svgContactVk, svgContactFb, svgContactPhone, svgContactEmail, svgContactOther, svgEditBtn, svtDeleteBtn, svgDeleteValueInput, modalChange, modalDelete} from "./svg.js";

//добавляем данные клиента на сервер
async function serverAddClient(obj) {
  let response = await fetch('http://localhost:3000/api/clients', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })

  let data = await response.json()
  return data
}

//получаем данные клиента с сервера
async function serverGetClient() {
  let response = await fetch('http://localhost:3000/api/clients', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  })

  let data = await response.json()
  return data
}

//удаляем данные клиента с сервера
async function serverDeleteClient(id) {
  let response = await fetch('http://localhost:3000/api/clients/' + id, {
    method: "DELETE",
  })

  let data = await response.json()
  return data
}

//изменяем данные о клиенте в таблице и на сервере
async function serverChangeClient(obj, id = null) {
  let response = await fetch('http://localhost:3000/api/clients/' + id, {
    method: "PATCH",
    body: JSON.stringify(obj),
  })

  let data = await response.json()
  return data
}

//динамический поиск в таблице
async function serverSearchClients(value) {
  let response = await fetch(`http://localhost:3000/api/clients?search=${value}`, {
    method: "GET",
  })

  let data = await response.json()
  return data
}

//склеиваем фамилию имя и отчество
function getFIO(client) {
  return `${client.surname} ${client.name} ${client.lastName}`
}

//получаем дату в нужном формате
function getDate(date) {
  let dd = date.getDate()
  let mm = date.getMonth() + 1
  let yy = date.getFullYear()

  dd < 10 ? dd = '0' + dd : ''
  mm < 10 ? mm = '0' + mm : ''
  yy < 10 ? yy = '0' + yy : ''

  return `${dd}.${mm}.${yy}`
}

//получаем часы и минуты в нужном формате
function getHoursAndMinuts(date) {
  let hh = date.getHours()
  let mm = date.getMinutes()

  hh < 10 ? hh = '0' + hh : ''
  mm < 10 ? mm = '0' + mm : ''

  return `${hh}:${mm}`
}

//переменные для дальнейшей работы
let clientsListEl = document.getElementById('table__string__wrapper')
let tableThEl = document.querySelectorAll('.table__th')

//создаем нового клиента
function getNewClient(client) {

  let tr = document.createElement('tr')
  let tdId = document.createElement('td')
  let tdFio = document.createElement('td')
  let tdCreateWrapper = document.createElement('div')
  let tdCreateDate = document.createElement('div')
  let tdCreateTime = document.createElement('div')
  let tdDateCreate = document.createElement('td')
  let tdChangeWrapper = document.createElement('div')
  let tdChangeDate = document.createElement('div')
  let tdChangeTime = document.createElement('div')
  let tdDateChange = document.createElement('td')
  let contactsWrapper = document.createElement('td')
  let tdBtnsWrapper = document.createElement('td')
  let tdChangeBtnWrapper = document.createElement('div')
  let tdBtnChange = document.createElement('button')
  let svgChange = document.createElement('button')
  svgChange.innerHTML = svgEditBtn
  let tdDeleteBtnWrapper = document.createElement('div')
  let tdBtnDelete = document.createElement('button')
  let svgDelete = document.createElement('button')
  svgDelete.innerHTML = svtDeleteBtn

  tdId.textContent = client.id.slice(0, 7)
  tdFio.textContent = getFIO(client)
  tdCreateDate.textContent = getDate(new Date(client.createdAt))
  tdCreateTime.textContent = getHoursAndMinuts(new Date(client.createdAt))
  tdChangeDate.textContent = getDate(new Date(client.updatedAt))
  tdChangeTime.textContent = getHoursAndMinuts(new Date(client.updatedAt))
  contactsWrapper.append(getContacts(client))
  tdBtnChange.textContent = 'Изменить'
  tdBtnDelete.textContent = 'Удалить'

  tdChangeDate.classList.add('tdCreateDate')
  tdCreateDate.classList.add('tdCreateDate')
  tdCreateTime.classList.add('tdCreateTime')
  tdChangeTime.classList.add('tdCreateTime')
  tdChangeWrapper.classList.add('tdCreateWrapper')
  tdCreateWrapper.classList.add('tdCreateWrapper')
  tdId.classList.add('tdId')
  tdBtnsWrapper.classList.add('tdBtnDeleteWrapper')
  tdBtnDelete.classList.add('tdBtnDelete')
  tdBtnChange.classList.add('tdBtnDelete')
  tr.classList.add('table__item')
  svgChange.classList.add('svgBtn')
  svgDelete.classList.add('svgBtn')
  tdChangeBtnWrapper.classList.add('btnWrapper')
  tdDeleteBtnWrapper.classList.add('btnWrapper')
  contactsWrapper.classList.add('contactsWrapper')

  //кнопка изменить данные клиента
  tdChangeBtnWrapper.addEventListener('click', function () {
    changeDataClient(client)
  })

  //кнопка удалить клиента
  tdDeleteBtnWrapper.addEventListener('click', function () {
    
    let main = document.querySelector('.main')
    let modalDeleteNew = document.createElement('div')
    modalDeleteNew.innerHTML = modalDelete
    main.append(modalDeleteNew)

    let modalDeleteWrapperEl = document.querySelector('.modal-delete-wrapper')
    modalDeleteWrapperEl.classList.add('modal-delete-wrapper-open')

    let deleteSvgEl = document.querySelector('.delete__svg')
    let deleteBtnBackEl = document.querySelector('.delete__btn__back')

    //крестик в модальном окне удаления клиента
    deleteSvgEl.addEventListener('click', function () {
     modalDeleteWrapperEl.remove()
    })

    //кнопка "отмена" в модальном окне удаления клиента
    deleteBtnBackEl.addEventListener('click', function () {
     modalDeleteWrapperEl.remove()
    })

    //кнопка "удалить" в модальном окне удаления клиента
    let deleteBtnDeleteEl = document.querySelector('.delete__btn__delete')
    deleteBtnDeleteEl.addEventListener('click', async function () {
      await serverDeleteClient(client.id)
      tr.remove()
      modalDeleteWrapperEl.remove()
      boxNoClients()
    })
  })

  tdCreateWrapper.append(tdCreateDate, tdCreateTime)
  tdDateCreate.append(tdCreateWrapper)
  tdChangeWrapper.append(tdChangeDate, tdChangeTime)
  tdDateChange.append(tdChangeWrapper)
  tdChangeBtnWrapper.append(svgChange, tdBtnChange)
  tdDeleteBtnWrapper.append(svgDelete, tdBtnDelete)
  tdBtnsWrapper.append(tdChangeBtnWrapper, tdDeleteBtnWrapper)
  tr.append(tdId, tdFio, tdDateCreate, tdDateChange, contactsWrapper, tdBtnsWrapper)

  return tr
}

//преобразует массив объектов c контактами в нужный вид
function getContacts(client) {
  let contactsFormat = document.createElement('div')

  for (const contacts of client.contacts) {
  
    let svgContact = document.createElement('button')
    svgContact.classList.add('svgType')
    let typeContact = contacts.type

    if (typeContact === 'Телефон') {
      svgContact.innerHTML = svgContactPhone
    } else if (typeContact === 'Доп. телефон') {
      svgContact.innerHTML = svgContactPhone
    } else if (typeContact === 'Email') {
      svgContact.innerHTML = svgContactEmail
    } else if (typeContact === 'Vk') {
      svgContact.innerHTML = svgContactVk
    } else if (typeContact === 'Facebook') {
      svgContact.innerHTML = svgContactFb
    } else if (typeContact === 'Другое') {
      svgContact.innerHTML = svgContactOther
    }

    let svgTooltip = contacts.value
    //тултип, принимает дом элемент
    tippy(svgContact, {
      content: svgTooltip,
    })

    contactsFormat.append(svgContact)
  }
  return contactsFormat
}

//изменение данных клиента
function changeDataClient(client) {

  let modalChangeEl = document.querySelector('.modal-wrapper-change')
  modalChangeEl.classList.add('modal-wrapper-change-open')

  let modalInpSurnameEl = document.getElementById('Changesurname')
  let modalInpNameEl = document.getElementById('Changename')
  let modalInpLastnameEl = document.getElementById('ChangelastName')
  let modalIdTextEl = document.querySelector('.modal__id-text')
  let modalAddContact2 = document.querySelector('.modal__add__contact2')
  let modalsvgChangeEl = document.querySelector('.modal__svg-change')
  let modalBtnDeleteEl = document.querySelector('.modal__btn__delete')
  
  for (const contact of client.contacts) {

    let changeContacts = addContact()
    modalAddContact2.append(changeContacts.addContactWrapper)

    changeContacts.select.value = contact.type
    changeContacts.input.value = contact.value

    new Choices(changeContacts.select, {
      searchEnabled: false,
      itemSelectText: ''
    });

    //при нажатии на крестик input и select сбрасываются
    changeContacts.svgContactValue.addEventListener('click', function () {
    changeContacts.input.value = ''
    changeContacts.select.value = 'Телефон'
  })
  }

  let modalBtnAddEl2 = document.querySelector('.modal__btn__add2')

  //кнопка "удалить клиента" в модальном окне "изменение данных" 
  modalBtnDeleteEl.addEventListener('click', async function () {
    await serverDeleteClient(client.id)
    modalChangeEl.remove()
    render(arrayClients)

     //заново создаем модальное окно "изменить данные"
     let main = document.querySelector('.main')
     let modalCgange3 = document.createElement('div')
     modalCgange3.innerHTML = modalChange
     main.append(modalCgange3)
  })

  //закрыть модальное окно "изменение данных"
  modalsvgChangeEl.addEventListener('click', function () {
    modalChangeEl.remove()

  //заново создаем модальное окно "изменить данные"
    let main = document.querySelector('.main')
    let modalCgange3 = document.createElement('div')
    modalCgange3.innerHTML = modalChange
    main.append(modalCgange3)
  })

  //кнопка "добавить контакт" в модальном окне "изменение данных" 
  modalBtnAddEl2.addEventListener('click', function () {
    let changeContactsAdd = addContact()
    modalAddContact2.append(changeContactsAdd.addContactWrapper)

    new Choices(changeContactsAdd.select, {
      searchEnabled: false,
      itemSelectText: ''
    });
  })

  //загружаем существующие данные
  modalInpSurnameEl.value = client.surname
  modalInpNameEl.value = client.name
  modalInpLastnameEl.value = client.lastName
  modalIdTextEl.textContent = 'ID: ' + client.id.slice(7)

  //по нажатию на кнопку "Сохранить" данные клиента изменятся
  document.getElementById('modal__form__change').addEventListener("submit", async function (event) {
    event.preventDefault()

    client.surname = modalInpSurnameEl.value
    client.name = modalInpNameEl.value
    client.lastName = modalInpLastnameEl.value
    client.contacts = contactObj()

    await serverChangeClient(client, client.id)
    modalChangeEl.remove()
    render(arrayClients)

    //заново создаем модальное окно "изменить данные"
    let main = document.querySelector('.main')
    let modalCgange3 = document.createElement('div')
    modalCgange3.innerHTML = modalChange
    main.append(modalCgange3)
  })
}

//сортировка клиентов
function sortClients(prop, dir) {
  const workersCopy = [...arrayClients]
  return workersCopy.sort(function (a, b) {

    if ((!dir == false ? a[prop] < b[prop] : a[prop] > b[prop]))
      return -1
  })
}

//переменные для сортировки по умолчанию
let column = 'id'
let columnDir = true

//отрисовываем каждого клиента в таблице
function render(arr) {
  let copyArr = [...arr]

  copyArr = sortClients(column, columnDir)

  clientsListEl.innerHTML = ''

  for (const client of copyArr) {

    const newClientEl = getNewClient(client)
    clientsListEl.append(newClientEl)
  }
}

//данные с сервера добавляем в переменную serverData. Передается массив объектов
let serverData = await serverGetClient()

let arrayClients = []

if (serverData) {
  arrayClients = serverData
}

//сортировка по столбцам 
tableThEl.forEach(function (table) {
  table.addEventListener('click', function () {
    column = table.dataset.column
    columnDir = !columnDir

    let svgTable = table.querySelector('.table__svg')

    if (svgTable.classList.contains('table__svg-transform')) {
      svgTable.classList.remove('table__svg-transform')
    } else {
      svgTable.classList.add('table__svg-transform')
    }
    render(arrayClients)
  })
})

render(arrayClients)

//добавляем клиента в таблицу из модального окна
document.getElementById('modal__form').addEventListener("submit", async function (event) {
  event.preventDefault()

  //создаем объект нового клиента
  let newClientObj = {
    surname: document.getElementById('surname').value,
    name: document.getElementById('name').value,
    lastName: document.getElementById('lastName').value,
    contacts: contactObj()
  }

  // очищаем все инпуты, после добавления студента
  event.target.reset();
  modalAddContact.innerHTML = ''

  let serverDataObj = await serverAddClient(newClientObj)
  modalAddClientEl.classList.remove('modal__wrapper__open')
  arrayClients.push(serverDataObj)
  render(arrayClients)
  boxNoClients()
})

//переменные для дальнейшей работы
let btnAddClientEl = document.getElementById('btn__add')
let modalAddClientEl = document.querySelector('.modal-wrapper')
let modalDeleteWrapperEl = document.querySelector('.modal-delete-wrapper')
let deleteSvgEl = document.querySelector('.delete__svg')
let deleteBtnBackEl = document.querySelector('.delete__btn__back')
let modalAddContact = document.querySelector('.modal__add__contact')
let buttons = document.querySelectorAll('.modal__btn__back');

//по клику на кнопку "добавить клиента" появляется модальное окно
btnAddClientEl.addEventListener('click', function () {
  modalAddClientEl.classList.add('modal__wrapper__open')
})

//крестик в модальном окне удаления клиента
deleteSvgEl.addEventListener('click', function () {
  modalDeleteWrapperEl.remove()
})

//кнопка "отмена" в модальном окне удаления клиента
deleteBtnBackEl.addEventListener('click', function () {
  modalDeleteWrapperEl.remove()
})

//очищает input'ы в модальном окне
function clearAllFormInputs() {
  let form = document.querySelector('.modal__form');
  let inputs = form.querySelectorAll('.modal__inp');

  for (let input of inputs)
    input.value = '';
}

//крестик и кнопка "Отмена" в модальном окне добавление клиента
for (const button of buttons) {
  button.addEventListener('click', function () {
    clearAllFormInputs()
    modalAddClientEl.classList.remove('modal__wrapper__open')
    modalAddContact.classList.remove('select__open')
    modalAddContact.innerHTML = ''
  })
}

//функция, которая в модальном окне добавляет форму с контактами
function addContact() {
  let addContactWrapper = document.createElement('div')
  let select = document.createElement('select')
  let optionTel = document.createElement('option')
  let optionTel2 = document.createElement('option')
  let optionEmail = document.createElement('option')
  let optionVk = document.createElement('option')
  let optionFacebook = document.createElement('option')
  let optionOther = document.createElement('option')
  let input = document.createElement('input')
  let svgContactValue = document.createElement('button')
  svgContactValue.innerHTML = svgDeleteValueInput

  optionTel.setAttribute('value', 'Телефон');
  optionTel2.setAttribute('value', 'Доп. телефон');
  optionEmail.setAttribute('value', 'Email');
  optionVk.setAttribute('value', 'Vk');
  optionFacebook.setAttribute('value', 'Facebook');
  optionOther.setAttribute('value', 'Другое')
  svgContactValue.setAttribute('type', 'button');

  addContactWrapper.classList.add('addContactWrapper')
  select.classList.add('js-choice')
  select.classList.add('selectWrapper')
  input.classList.add('input__modal')
  svgContactValue.classList.add('svgModal')

  optionTel.textContent = 'Телефон'
  optionTel2.textContent = 'Доп. телефон'
  optionEmail.textContent = 'Email'
  optionVk.textContent = 'Vk'
  optionFacebook.textContent = 'Facebook'
  optionOther.textContent = 'Другое'
  input.placeholder = 'Введите данные контакта'

  select.append(optionTel, optionTel2, optionEmail, optionVk, optionFacebook, optionOther)
  addContactWrapper.append(select, input, svgContactValue)

  return {
    addContactWrapper,
    select,
    input,
    svgContactValue
  }
}

let modalBtnAddEl = document.querySelector('.modal__btn__add')

//нажимая по кнопке "Добавить контакт" появляется форма с контактами
modalBtnAddEl.addEventListener('click', function () {
  let modalCont = addContact()

    new Choices(modalCont.select, {
      searchEnabled: false,
      itemSelectText: ''
    });

  modalAddContact.append(modalCont.addContactWrapper)
  modalAddContact.classList.add('select__open')

  //при нажатии на крестик input и select сбрасываются
  modalCont.svgContactValue.addEventListener('click', function () {
    modalCont.input.value = ''
    modalCont.select.value = 'Телефон'
  })
})

//собираем все значения select'а и input в объект
function contactObj() {
  let arrayContacts = []

  let typeContact = document.querySelectorAll('.selectWrapper')
  let valueContact = document.querySelectorAll('.input__modal')

  for (let i = 0; i < typeContact.length; i++) {

    arrayContacts.push({
      type: typeContact[i].value,
      value: valueContact[i].value
    })
  }

  return arrayContacts
}

//динамический поиск
const searchClients = (clients) => {

  //функция, которая отрисует только тех клиентов, у которых есть символы такие же как в input
  //функция принимает строку из input'а
  const rewriteTable = async (str) => {
    const response = await serverSearchClients(str);
    const tbody = document.querySelector('.table__string__wrapper');
    tbody.innerHTML = '';

    for (const client of response) {
      tbody.append(getNewClient(client));
    }
  }

  document.querySelector('.header__input').oninput = function () {
    let val = this.value.trim()

    if (val != '') {
      rewriteTable(val);
    } else {
      const tbody = document.querySelector('.table__string__wrapper');
      tbody.innerHTML = '';
      for (const client of clients) {
        tbody.append(getNewClient(client));
      }
    }
  }
}

//функция, которая добавит пустой блок если клиентов нет
function boxNoClients(){
  let allTR = document.querySelectorAll('.table__item')

  //если в массиве нет клиентов, то появится пустой блок
  let boxNoClients = document.querySelector('.noclients')

  if (allTR.length == 0){
    boxNoClients.classList.add('noclients-open')
  } else {
    boxNoClients.classList.remove('noclients-open')
  }
}

//функция, которая добавит пустой блок если клиентов нет после перезагрузки страницы
function boxNoClients2(){
  let allTR2 = document.querySelectorAll('.table__item')

  //если в массиве нет клиентов, то появится пустой блок
  let boxNoClients2 = document.querySelector('.noclients')
  
  if (allTR2.length == 0){
    boxNoClients2.classList.add('noclients-open')
  } else {
    boxNoClients2.classList.remove('noclients-open')
  }
}
boxNoClients2()

searchClients(arrayClients);