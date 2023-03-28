var form = document.getElementById('signin');
form.addEventListener('submit',checkUser);

async function checkUser(e){
    try{
        e.preventDefault();

        let Email = document.getElementById('email').value;
        let Password = document.getElementById('password').value;

        document.getElementById('email').value = "";
        document.getElementById('password').value = "";

        let Obj = {
            email: Email,
            password: Password
        }

        const result = await axios.post("http://localhost:3000/user/checkUser",Obj);
        console.log(result.data.message);
        console.log(result.data.token);
        localStorage.setItem('token',result.data.token);
        document.body.innerHTML = document.body.innerHTML + result.data.message;
        window.location.href = "./expense.html";

    }
    catch(err){
        console.log(err);
        // document.body.innerHTML = document.body.innerHTML + err.response.data.message;
    }
}