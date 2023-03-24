

var form = document.getElementById('my-form');
form.addEventListener('submit', addLocal);

var downloadExpense = document.getElementById('downloadexpense');
downloadExpense.addEventListener('click', downloadExpenses);
var pagination = document.getElementById('pagination');
const seletepage = document.getElementById('pagerow');
seletepage.addEventListener('change',addpagerow);

async function addpagerow(e){
    e.preventDefault();
    var value = document.getElementById('pagerow').value;
    localStorage.setItem('pagerow',value);
}
async function downloadExpenses(e) {
    try {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const result = await axios.get("http://localhost:3000/expense/download", { headers: { "Authorization": token } });
        console.log("url --", result.data.fileUrl);
        if (result.status === 200) {
            var a = document.createElement("a");
            a.href = result.data.fileUrl;
            a.download = 'myexpense.csv'
            a.click();

        }

    }
    catch (err) {
        console.log("download error --> ", err);
    }

}

function showLeaderboard() {
    const inputEle = document.createElement('input');
    inputEle.type = 'button';
    inputEle.className = 'btn';
    inputEle.value = 'Show Leaderboard';
    inputEle.onclick = async () => {
        const token = localStorage.getItem('token')
        const userLeaderboardArray = await axios.get("http://localhost:3000/premium/showLeaderBoard", { headers: { "Authorization": token } })
        console.log(userLeaderboardArray);

        var leaderboardEle = document.getElementById('leaderboard')

        leaderboardEle.innerHTML += '<h2> - Expense Leader Board -</h2>'

        userLeaderboardArray.data.forEach((userdetails) => {
            leaderboardEle.innerHTML += `<li>Name : ${userdetails.name} Total Expense : ${userdetails.totalExpense || 0}`
        })
    }
    document.getElementById('premiumuser').appendChild(inputEle);
}

function showpremiumusermessage() {
    document.getElementById('premiumuser').innerHTML = 'You are Premium user now';
    document.getElementById('premiumbtn').style.display = 'none';
    document.getElementById('downloadexpense').style.display = 'block';
    document.getElementById('history').style.display = 'contents';

}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
        const pagerow = localStorage.getItem('pagerow');
        const decodeToken = parseJwt(token);
        var page = 1;
        const ispremiumuser = decodeToken.ispremiumuser;
        console.log(ispremiumuser);
        if (ispremiumuser) {
            showpremiumusermessage();
            showLeaderboard();
        }
        const expense = await axios.get(`http://localhost:3000/expense/getExpenses/${page}/${pagerow}`, { headers: { "Authorization": token } })
        for (var i = 0; i < expense.data.expenses.length; i++) {
            showData(expense.data.expenses[i]);
        }
        showPagination(expense.data);
        
        if (ispremiumuser) {
            const DownloadHistory = await axios.get("http://localhost:3000/expense/getDownloadHistory", { headers: { "Authorization": token } })
            console.log("url return --", DownloadHistory.data.AllHistory[0].createdAt);
            console.log("url return --", DownloadHistory.data.AllHistory[1].createdAt);

            DownloadHistory.data.AllHistory.forEach((data) => {
                showFileDownloadHistory(data);
            })
        }
    }
    catch (err) {
        console.log(err);
    }

})

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    pagination.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.className = 'btn';
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', () => {
            const collection = document.getElementById('addExpense').children;
            for (let i = 0; i < collection.length; i++) {
                collection[i].style.display = "none";
            }
            getExpenses(previousPage)
        });
        pagination.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.className = 'btn';
    btn1.innerHTML = `<h5> ${currentPage} </h5>`;
    btn1.addEventListener('click', () => {
        const collection = document.getElementById('addExpense').children;
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.display = "none";
        }
        getExpenses(currentPage)
    });
    pagination.appendChild(btn1);

    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.className = 'btn';
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => {
            const collection = document.getElementById('addExpense').children;
            for (let i = 0; i < collection.length; i++) {
                collection[i].style.display = "none";
            }
            getExpenses(nextPage)
        }
        );
        pagination.appendChild(btn3);
    }
}

async function getExpenses(page) {
    try {
        const token = localStorage.getItem('token');
        const pagerow = localStorage.getItem('pagerow');
        const result = await axios.get(`http://localhost:3000/expense/getExpenses/${page}/${pagerow}`, { headers: { "Authorization": token } })
        for (var i = 0; i < result.data.expenses.length; i++) {
            showData(result.data.expenses[i]);
        }
        // showData(result.data.expenses);
        showPagination(result.data);
    }
    catch (err) {
        console.log("getExpenses err == ", err)
    }
}

async function addLocal(e) {
    try {
        e.preventDefault();
        var expenseAmount = document.getElementById('ExpenseAmount').value;
        var Description = document.getElementById('Description').value;
        var category = document.getElementById('category').value;

        document.getElementById('ExpenseAmount').value = "";
        document.getElementById('Description').value = "";


        let myObj = {
            exAmt: expenseAmount,
            Des: Description,
            cat: category
        };
        const token = localStorage.getItem('token');
        const resp = await axios.post("http://localhost:3000/expense/addExpense", myObj, { headers: { "Authorization": token } })
        showData(resp.data.newExpense);
    }
    catch (err) {
        document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>"
        console.log(err);
    }

}

function showData(Obj) {
    try {
        const parentEle = document.getElementById('addExpense');
        const childEle = document.createElement('li');
        childEle.setAttribute('id', Obj.id);
        console.log("child element created");

        const btn = document.createElement('input');
        btn.type = "button"
        btn.className = 'deleteB';
        btn.value = "Delete Expense";
        btn.setAttribute('id', Obj.id);
        console.log("delete button created");

        childEle.textContent = Obj.amount + ' - ' + Obj.description + ' - ' + Obj.category;

        btn.onclick = () => {
            const id = btn.id;
            let obj = {
                amount: Obj.amount
            };
            const token = localStorage.getItem('token');
            axios.post(`http://localhost:3000/expense/deleteExpense/${id}`, obj, { headers: { "Authorization": token } })
                .then(() => {
                    parentEle.removeChild(childEle);
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        parentEle.appendChild(childEle);
        childEle.appendChild(btn);
    }
    catch (err) {
        console.log("showing data error", err)
    }

}

function showFileDownloadHistory(data) {
    const parentEle = document.getElementById('fileHistory');
    const childEle = document.createElement('li');
    console.log("child element created");

    const urlchild = document.createElement('a');
    urlchild.innerHTML = 'Click here to get file';
    urlchild.href = data.url

    childEle.textContent = data.createdAt + ' -- ';
    parentEle.appendChild(childEle);
    childEle.appendChild(urlchild);
}