
document.getElementById('forgotpassword').onclick = async function(e){
    try{
        e.preventDefault();
        const email = document.getElementById('email').value;
        document.getElementById('email').value = "";

        let Obj = {
            email: email
        }

        const result = await axios.post("http://localhost:3000/password/forgotpassword",Obj);
        document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        console.log("result--->",result)

    }
    catch(err){
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
}