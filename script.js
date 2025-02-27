dob.max = new Date().toISOString().split("T")[0];

var error = document.getElementById("error");
let name = document.getElementById("name");
name.addEventListener("input", onNameInput);

function onNameInput(event) {
    if (name.value.length < 4 || name.value.length > 20) {
        error.textContent = "Name length should be between 4 and 20";
        error.style.color = "red";
    } else {
        error.textContent = "";
    }
}

let phone = document.getElementById("phone");
phone.addEventListener("input", onPhoneInput);
var phoneError = document.getElementById("phoneError");

function onPhoneInput(event) {
    if (phone.value.length > 0) {
        if (phone.value.length !== 10) {
            phoneError.textContent = "Please enter a valid 10-digit phone number";
            phoneError.style.color = "red";
        } else {
            phoneError.textContent = "";
        }
    }
    else {
        phoneError.textContent = "";
    }
}

let email = document.getElementById("email");
email.addEventListener("input", onEmailInput);
function onEmailInput(event) {
    emailError.textContent = "";
}


document.addEventListener("DOMContentLoaded", () => {
    loadEmployees();
    document.getElementById("employeeForm").addEventListener("submit", function () {
        event.preventDefault();
        //validate name
        let nameValue = document.getElementById("name").value;
        if (nameValue.length < 4 || nameValue.length > 20) {
            return false;
        }

        //validate phone number
        let phoneInput = document.getElementById("phone");
        let phoneValue = phoneInput.value;
        if (phoneValue.length > 0) {
            if (phoneValue.length !== 10) {
                return false;
            }
        }
        addEmployee();
    })
})

function addEmployee() {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let index = document.getElementById("editUpdate").value;
    let employeeData = getFormData();
    if (index) {
        employees[index] = employeeData;
        updateTableRow(index, employeeData);
        updateVerticalRow(index, employeeData);
        document.getElementById("editUpdate").value = "";
    }
    else {
        if (employees.some(emp => emp.email === employeeData.email)) {
            document.getElementById("emailError").textContent = "Email already exists";
            return;
        }
        employees.push(employeeData);
        addTableRow(employees.length - 1, employeeData);
        addVerticalRow(employees.length - 1, employeeData);
    }

    localStorage.setItem("employees", JSON.stringify(employees));
    document.getElementById("employeeForm").reset();
}

function getFormData() {
    var hobbies = []
    let index = 0;
    var checkboxes = document.querySelectorAll('input[name="hobbies"]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
        hobbies.push(checkboxes[i].value)
    }
    return {
        name: document.getElementById("name").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        dob: document.getElementById("dob").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value || "",
        hobbies: hobbies
    };
}

function addTableRow(index, employee) {
    const tableBody = document.getElementById("tableBody");
    let row = createTableRow(index, employee);
    tableBody.innerHTML += row;
}

function updateTableRow(index, employee) {
    let row = document.getElementById(`row-${index}`);
    row.innerHTML = getTableRowInnerHTML(index, employee);
}

function createTableRow(index, employee) {
    return `<tr id="row-${index}">${getTableRowInnerHTML(index, employee)}</tr>`;
}

function getTableRowInnerHTML(index, employee) {
    return `
        <td>${employee.name}</td>
        <td>${employee.gender}</td>
        <td>${employee.dob}</td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>${employee.hobbies.join(", ")}</td>
        <td>
            <button class="edit" onclick="editEmployee(${index})">Edit</button>
            <button class="edit" onclick="deleteEmployee(${index})">Delete</button>
        </td>
    `;
}

function loadEmployees() {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = employees.map((emp, index) => createTableRow(index, emp)).join("");
    loadVerticalTable(employees);
}

function editEmployee(index) {
    let employees = JSON.parse(localStorage.getItem("employees"));
    let emp = employees[index];

    document.getElementById("name").value = emp.name;
    document.querySelector(`input[value="${emp.gender}"]`).checked = true;
    document.getElementById("dob").value = emp.dob;
    document.getElementById("email").value = emp.email;
    document.getElementById("phone").value = emp.phone;
    document.querySelectorAll('input[name="hobbies"]').forEach(h => h.checked = emp.hobbies.includes(h.value));
    document.getElementById("editUpdate").value = index;
}

function deleteEmployee(index) {
    let employees = JSON.parse(localStorage.getItem("employees"));
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    document.getElementById(`row-${index}`).remove();
    deleteVerticalRow(index);
}

function loadVerticalTable(employees) {
    const tableBody = document.getElementById("verticalTableBody");
    tableBody.innerHTML = "";

    if (employees.length === 0) return;

    const keys = ["name", "gender", "dob", "email", "phone", "hobbies"];
    const labels = ["Name", "Gender", "DOB", "Email", "Phone", "Hobbies", "Action"];

    labels.forEach((label, rowIndex) => {
        let row = `<tr id="col-${rowIndex}"><th>${label}</th>`;

        employees.forEach((employee, colIndex) => {
            if (rowIndex < keys.length) {
                row += `<td id="cell-${rowIndex}-${colIndex}">${employee[keys[rowIndex]] || ""}</td>`;
            }
            else if (rowIndex === keys.length) {
                row += `<td id="cell-${rowIndex}-${colIndex}">${createActionButtons(colIndex)}</td>`;
            }
        });

        row += "</tr>";
        tableBody.innerHTML += row;
    });
}

function updateVerticalColumn(colIndex, rowIndex, newValue) {
    const cell = document.getElementById(`cell-${colIndex}-${rowIndex}`);
    if (cell) {
        cell.innerHTML = newValue;
    }
}

function updateVerticalRow(rowIndex, employee) {
    const keys = ["name", "gender", "dob", "email", "phone", "hobbies"];
    keys.forEach((key, colIndex) => {
        updateVerticalColumn(colIndex, rowIndex, employee[key] || "");
    });
}

function addVerticalRow(index, employee) {
    const keys = ["name", "gender", "dob", "email", "phone", "hobbies"];

    keys.forEach((key, colIndex) => {
        let row = document.getElementById(`col-${colIndex}`);
        if (row) {
            row.innerHTML += `<td id="cell-${colIndex}-${index}">${employee[key] || ""}</td>`;
        }
    });

    let actionRow = document.getElementById(`col-${keys.length}`);
    if (actionRow) {
        actionRow.innerHTML += `<td id="cell-${keys.length}-${index}">${createActionButtons(index)}</td>`;
    }
}

function deleteVerticalRow(index) {
    const keys = ["name", "gender", "dob", "email", "phone", "hobbies"];

    keys.forEach((keys, colIndex) => {
        let cell = document.getElementById(`cell-${colIndex}-${index}`);
        if (cell) cell.remove();
    });

    let actionCell = document.getElementById(`cell-${keys.length}-${index}`);
    if (actionCell) actionCell.remove();
}

function createActionButtons(index) {
    return `
        <button class="edit" onclick="editEmployee(${index})">Edit</button>
        <button class="edit" onclick="deleteEmployee(${index})">Delete</button>
    `;
}