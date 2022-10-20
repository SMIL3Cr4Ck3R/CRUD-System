
var inputArr = [];

inputArr[0] = document.getElementById('cName');
inputArr[1] = document.getElementById('cCat');
inputArr[2] = document.getElementById('cPrice');
inputArr[3] = document.getElementById('cDesc');

var addBtn  = document.querySelector('#addBtn');
var clrBtn  = document.querySelector('#clearInptsBtn');

var courseObjects = [];

// to get data from localstorage
updateTable();

addBtn.addEventListener('click', function () {

    if (inputArr[0].value.match(/^[A-Z][A-Za-z]{2,8}$/g) && inputArr[1].value.match(/^[A-Z][A-Za-z]{2,}$/g)
        && inputArr[2].value.match(/^[0-9]{1,9999}$/g) && inputArr[3].value.match(/^\w+$/g)) {

        let exist = false;

        for (let obj of courseObjects) {
            if (obj.courseName === inputArr[0].value) {
                exist = true;
                break;
            }
        }

        if (!exist) {
            courseObjects.push(createCourseObj());
            clearInput();
            var cObj = courseObjects[courseObjects.length - 1];
            localStorage.setItem( cObj.courseName, JSON.stringify(cObj));

            updateTable();
            //createCObjDiv(courseObjects.length - 1, cObj.courseName, cObj.courseCategory, cObj.coursePrice, cObj.courseDesc);
        } else
            alert("Course exist !, please choose another name");

    } else {
        for (let frm of inputArr)
            if (frm.value === '')
                frm.classList.add('is-invalid');
    }

});

clrBtn.onclick = function () {
    clearInput();
}

function createCourseObj() {

    return {
        courseName: inputArr[0].value,
        courseCategory: inputArr[1].value,
        coursePrice: inputArr[2].value,
        courseDesc: inputArr[3].value
    }
}

function createCObjDiv(idNum, cName, cCat, cPrice, cDesc) {

    var cDivBlock;
    cDivBlock = `
        <tr class="ancestor" id="tr${idNum}">
            <th  scope="row">${idNum}</th>
            <td scope="row">${cName}</td>
            <td scope="row">${cCat}</td>
            <td scope="row">${cPrice}</td>
            <td scope="row">${cDesc}</td> 
            <td>
            <button onclick="updateCourse(this)" class="btn btn-primary" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">UPDATE</button>
            <button onclick="deleteCourse(${idNum})" class="btn btn-outline-danger" >DELETE</button>
            </td>
        </tr>
    `;

    document.getElementById('tableData').innerHTML += cDivBlock;
}

function clearInput() {

    for (let inp of inputArr) {
        inp.value = '';
        inp.classList.remove('is-valid', 'is-invalid');
    }
}

function deleteCourse(courseID) {

    //document.getElementById('tr' + courseID).remove();
    localStorage.removeItem(courseObjects[courseID].courseName);
    courseObjects.splice(courseID, 1);
    updateTable(); 
}

function updateTable() {

    document.querySelector("#tableData").innerHTML = '';
    courseObjects = [];

    let i = 0; 
    for (let x in localStorage ) {
        let obj = JSON.parse(localStorage.getItem(x));
        if (obj !== null) {
            courseObjects.push(obj);
            createCObjDiv(i, obj.courseName, obj.courseCategory, obj.coursePrice, obj.courseDesc);
        }
        i++;
    } 

}

inputArr[0].onkeyup = function () {

    let validator = /^[A-Z][A-Za-z]{2,8}$/g;
    validate(0, 'feedbackReturn', validator, 'Should contain start with Capital letter with max length 8'
        + '& can\'t contain numbers or symbols !');
}

inputArr[1].onkeyup = function () {

    let validator = /^[A-Z][A-Za-z]{2,}$/g;
    validate(1, 'feedbackReturn1', validator, "Should contain start with Capital letter with min length 2");
}

inputArr[2].onkeyup = function () {

    let validator = /^[0-9]{1,9999}$/g;
    validate(2, 'feedbackReturn2', validator, 'insert numbers only [0-9]');
}

inputArr[3].onkeyup = function () {

    let validator = /^\w+$/g;
    validate(3, 'feedbackReturn3', validator, 'insert some text');
}


function validate(index, feedbackID, validator, msg) {

    let temp = document.querySelector('.' + feedbackID);
    if (inputArr[index].value.match(validator)) {

        inputArr[index].classList.add('is-valid');
        inputArr[index].classList.remove('is-invalid');

        temp.classList.add('valid-feedback');
        temp.classList.remove('invalid-feedback', 'd-none');

        temp.innerHTML = 'Looks good !';

    } else {
        inputArr[index].classList.add('is-invalid');
        inputArr[index].classList.remove('is-valid');

        temp.classList.add('invalid-feedback');
        temp.classList.remove('valid-feedback', 'd-none');

        temp.innerHTML = msg;
    }
}

function updateCourse(thisCourse) {

    let index = Number(thisCourse.closest('.ancestor').children[0].innerHTML);

    let updateDataBtn = document.getElementById('updateDataBtn');
    let tempArr = [];

    tempArr[0] = document.getElementById('cNameUpdate');
    let tempVal = courseObjects[index].courseName;
    tempArr[1] = document.getElementById('cCatDivUpdate');
    tempArr[2] = document.getElementById('cPriceUpdate');
    tempArr[3] = document.getElementById('cDescUpdate');

    updateDataBtn.onclick = function () {


        if (tempArr[0].value.match(/^[A-Z][A-Za-z]{2,8}$/g) && tempArr[1].value.match(/^[A-Z][A-Za-z]{2,}$/g) &&
            tempArr[2].value.match(/^[0-9]{1,9999}$/g) && tempArr[3].value.match(/^\w+$/g)) {

            Object.keys(courseObjects[index]).forEach((key, ind) => {
                courseObjects[index][key] = tempArr[ind].value;
                tempArr[ind].value = '';
            }); 

            localStorage.removeItem(tempVal);
            localStorage.setItem(courseObjects[index].courseName,JSON.stringify(courseObjects[index]));
            updateTable();

        } else
            alert('Please Check your inputs');

    }

}
