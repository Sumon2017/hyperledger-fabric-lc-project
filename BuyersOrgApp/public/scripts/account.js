const clickLogin = function(){
    let w=document.querySelector('#addremove');
    w.classList.remove('addremove');
    let email = document.querySelector('#loginemail').value;
    let password =document.querySelector('#loginpassword').value;
    if(email==""||password==""){
        alert('input field should not be null');
        w.classList.add('addremove');
        return ;
    }
    let send_obj = {
        email,
        password
    };
    fetch('http://localhost:3001/login',{
        method: 'POST',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(send_obj)
    })
    .then(response =>response.json())
    .then(data => {
        setTimeout(()=>{
            alert(data.msg)
            w.classList.add('addremove');
            console.log('success');
        },500)
    })
    .catch(err=>{
        w.classList.add('addremove');
        console.log("could not fetch");
        console.log(err);
    })
}

const clickLogout =function(){
    fetch('http://localhost:3001/logout',{
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response =>response.json())
    .then(data => {
        setTimeout(()=>{
            alert(data.msg)
            console.log('success');
        },500)
    })
    .catch(err=>{
        console.log("could not fetch");
        console.log(err);
    })
}