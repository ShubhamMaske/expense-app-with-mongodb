
document.getElementById('forgotpassword').onclick = async function(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    document.getElementById('email').value = "";

    let Obj = {
        email: email
    }

    const result = await axios.post("http://localhost:3000/password/forgotpassword",Obj);
}