{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.0/axios.min.js"></script>  */ }
// const Razorpay = require('razorpay');


document.getElementById('premiumbtn').onclick = async function (e) {
    try {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } })
        console.log("after premiummembership >>>", response);


        var options =
        {
            "key": response.data.key_id, //Enter key id generated from the dashbord
            "order_id": response.data.order.id, //for one time payment
            "handler": async function (response) {
                console.log("response>>>", response)
                const updatedUser = await axios.post("http://localhost:3000/purchase/updatestatus", {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } })

                localStorage.setItem('token', updatedUser.data.token);
                alert('You are a Premium User Now')
                document.getElementById('premiumbtn').style.display = 'none';
                document.getElementById('premiumuser').innerHTML = "You are Premium user now";
                showLeaderboard();
            },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();


        rzp1.on('payment.failed', async function (response) {
            alert('Something went wrong');
        });

    }
    catch (err) {
        console.log("Error in premium feature");
    }
}