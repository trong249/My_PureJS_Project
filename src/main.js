
const addBtn = document.querySelectorAll('nav .add');
const getAddBox = document.querySelector('.virtual-section .getItem');
const updateBox = document.querySelector('.virtual-section .updateItem');
const closeAddBoxBtn = document.querySelector('.getItem .fa-times');
const barMenu = document.querySelector('nav .fa-bars');
const closeMenu = document.querySelector('nav .fa-times')
let idToBeUpdate = 0;

window.onscroll = () => {
    if (window.pageYOffset > 100) {
        document.querySelector('nav').classList.add('active')
    }
    else {
        document.querySelector('nav').classList.remove('active')
    }
}

/************************************/
//Open and close inputBox 
                        addBtn.forEach(element => {
                                element.onclick = () => {
                                    if (getAddBox.classList.contains('active')) {
                                        getAddBox.classList.remove('active')
                                    }
                                    else {
                                        getAddBox.classList.add('active')
                                    }
                                }
                        });
                        closeAddBoxBtn.onclick = () => {
                            getAddBox.classList.remove('active')
                        }
/**********************************************************************************************************************/



/************************************/
let menu = document.querySelector('nav .menu')
// Open and close menu
barMenu.onclick = () => {
    menu.classList.add('active')
}
closeMenu.onclick = () => {
     menu.classList.remove('active')
}

/**********************************************************************************************************************/
/************************************/
// Handle Random Img
const randomAdd = document.querySelector('.getItem .randomAdd');
const randomUpdate = document.querySelector('.updateItem .randomUpdate');

const imgInputBox = document.querySelector('.getItem img');
const imgUpdate = document.querySelector('.updateItem img');

randomAdd.onclick = (e) => {
    e.preventDefault();
    let id = Math.floor(Math.random() * 100) % 100;
    imgInputBox.setAttribute('src', `https://picsum.photos/id/${id}/200/300`);
}
randomUpdate.onclick = (e) => {
    e.preventDefault();
    let id = Math.floor(Math.random() * 100) % 100;
    imgUpdate.setAttribute('src', `https://picsum.photos/id/${id}/200/300`);
}

/**********************************************************************************************************************/


//                                      PRODUCT-HANDLE

let baseArray = [];
const url = '  http://localhost:3000/product';
let array = [];
getAPI(url);
/************************************/
//  Handdle API
function getAPI(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            baseArray = json;
            array = baseArray.reverse().slice(0,baseArray.lenght)
            start();
        })
}            
/*************************************************/
/************************************/
//  Handdle add product 
const addButton = document.querySelector('#addButton');
    
addButton.onclick = (e) => {
    e.preventDefault();
    let name = document.querySelector('.getItem #name').value;
    let price = document.querySelector('.getItem #price').value;
    let imgUrl = document.querySelector('.getItem img').getAttribute('src');
    let data = {
        Name: name,
        Price: price,
        Img: imgUrl
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(json => {
            baseArray.push(json);
            array = baseArray.reverse().slice(0, baseArray.lenght)
            getAddBox.classList.remove('active')
            start();
        })
}      
/*************************************************/
/************************************/
//  Handdle delete product 
function handleDelete(id) {
    fetch(url+"/"+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    document.querySelector(`#id-${id}`).remove();
    for (let i = 0; i < baseArray.length; i++){
        if (baseArray[i].id === id) {
            for (let j = i; j < baseArray.length-1; j++){
                baseArray[j]=baseArray[j++]
            }
            baseArray.pop();
        }
    }
}      
/*************************************************/
/************************************/
//  Handdle Update product 
const updateBtn = document.querySelector('.virtual-section .updateItem #upBtn')

updateBtn.onclick = (e) => {
    e.preventDefault();
    let name = document.querySelector('.updateItem #nameupdate').value;
    let price = document.querySelector('.updateItem #priceupdate').value;
    let imgUrl = document.querySelector('.updateItem img').getAttribute('src');
    let data = {
        Name: name,
        Price: price,
        Img: imgUrl
    }
    fetch(url+"/"+idToBeUpdate, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    baseArray.forEach(e => {
        if (e.id === idToBeUpdate) {
            e.Name = data.Name;
            e.Price = data.Price;
            e.Img = data.Img;
        }
    })
    array = baseArray.reverse().slice(0, baseArray.lenght)
    updateBox.classList.remove('active')
    start();
    
}
/*************************************************/
/************************************/
//  Handdle divide div Tab 
                    
                    function elementCreate(object) {
                        let html = '' + `<div class="element">
                                                <div class='editIcon'>
                                                    <i class="far fa-edit" onclick="updateBox.classList.add('active');idToBeUpdate=${object.id}" title='Click to edit'></i>
                                                    <i class="fas fa-times"title='Click to delete' onclick='handleDelete(${object.id})'></i>
                                                </div>
                                                <div class='img'>
                                                    <img src="${object.Img}" alt="">
                                                </div>
                                                <div class='content'>
                                                    <p><span>Name: </span>${object.Name}</p>
                                                    <p>Price: ${object.Price}$</p>
                                                </div>
                                            </div>`
                        return html;
                    }

                    function tabCreate(numberRowInTab,numberColInTab,array) {
                        let index = 0;
                        let rowsHtml = '';
                        for (let i = 0; i < numberRowInTab; i++){
                            let colsHtml = '';
                            for (let i = 0; i < numberColInTab; i++){
                                if (index >= array.length) { break;}
                                let element = elementCreate(array[index++]);
                                colsHtml += `<div class="col-${12 / numberColInTab} col" id="id-${array[index-1].id}">${element}</div>`;
                            }
                            rowsHtml += `<div class="row">${colsHtml}</div>`
                        }
                        return rowsHtml;
                    }
                    function renderTab(numberRowInTab, numberColInTab, arrayElemntsToBeShown) {
                        var container = document.querySelector('.products .container:nth-child(2)')                        
                        container.innerHTML = tabCreate(numberRowInTab, numberColInTab, arrayElemntsToBeShown);
                    }
                    
/*************************************************/
// Pagination
                    const ul = document.querySelector('.wraper ul');
                    // render pagination and return current page
                    function pagination(page) {
                        let tagli = '';
                        let active = '';
                        
                        /***********************/ 
                        var numberRowInTab = 3;
                        let widthOfWindow = window.innerWidth;
                        var numberColInTab =  (widthOfWindow >990)?6:( (widthOfWindow < 990 && widthOfWindow > 770)?4:2 )
                        var numberElementsInTab = numberRowInTab * numberColInTab;
                        var totalPage = Math.ceil(array.length / numberElementsInTab);
                        page = (page > totalPage) ? totalPage : ((page < 1) ? 1 : page)
                        var start = numberElementsInTab * (page - 1);
                        var end = numberElementsInTab * page;
                        var arrayElemntsToBeShown = array.slice(start, end)
                        renderTab(numberRowInTab, numberColInTab, arrayElemntsToBeShown);
                        /***********************/ 
                        if (page == 1) {
                            tagli += `<li> <span class="btn pre" onclick=pagination(${page-1})><i class="fas fa-chevron-left"></i></span></li>`;
                        }
                        else {
                            tagli += `<li> <span class="btn pre" onclick=pagination(${page-1})><i class="fas fa-chevron-left"></i></span></li>`;
                        }
                        if (totalPage <= 5 ) {
                            for (let i = 1; i <= totalPage ; i++){
                                page == i ? active = 'active' : active = '';
                                tagli += `<li class="num ${active}" onclick=pagination(${i})>${i}</li>`
                            }
                        }
                        else {
                            if (page == 1) {
                                tagli += `<li class="num active" >1</li>`
                            }
                            else {
                                tagli += `<li class="num" onclick=pagination(1)>1</li>`
                            }
                            
                            if (page <= 3) {
                                for (let i = 2; i <= 4; i++) {
                                    page == i ? active = 'active' : active = '';
                                    tagli += `<li class="num ${active}" onclick=pagination(${i})>${i}</li>`;
                                }
                                tagli += `<li class="dot">...</li>`;
                            }
                            if ( page>3 && totalPage-page>=3){
                                tagli += `<li class="dot">...</li>`;
                                tagli += `<li class="num " onclick=pagination(${page-1}) >${page - 1}</li>`;
                                tagli += `<li class="num active ">${page}</li>`;
                                tagli += `<li class="num " onclick=pagination(${page+1}) >${page + 1}</li>`;
                                tagli += `<li class="dot">...</li>`;
                            }
                            if (totalPage - page < 3) {
                                tagli += `<li class="dot">...</li>`;
                                for (let i = totalPage - 3; i < totalPage; i++){
                                    page == i ? active = 'active' : active = '';
                                    tagli += `<li class="num ${active} " onclick=pagination(${i}) >${i}</li>`;
                                }
                            }
                            if (page == totalPage) {
                                tagli += `<li class="num active">${totalPage}</li>`;
                            }
                            else {
                                tagli += `<li class="num" onclick=pagination(${totalPage}) > ${totalPage}</li>`;
                            }
                        }
                    
                        if (page == totalPage) {
                            tagli += `<li><span class="btn next active" onclick=pagination(${page+1})><i class="fas fa-chevron-right"></i></span></li>`;
                        }
                        else {
                            tagli += `<li><span class="btn next" onclick=pagination(${page+1})><i class="fas fa-chevron-right"></i></span></li>`;
                        }
                        ul.innerHTML = tagli;
                        
                        return page;
                    }
                    
/*************************************************/
/*************************************************/
// Search componet

const searchInput = document.querySelector('.search input')
searchInput.onkeyup = function valueAfterSearch() {   
    array = baseArray.filter((e) => e.Name.includes(searchInput.value.toLowerCase()))
    start();
}
/*************************************************/
/********************************************PRODUCT-SECTION************************************************************/
function start() {
    pagination(1);
    window.onresize = ()=>{
    pagination(1);
    }
}
start()