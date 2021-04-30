const clickSignUp = function(){
    let w=document.querySelector('#addremove');
    w.classList.remove('addremove');
    let username =document.querySelector('#signupusername').value;
    let email = document.querySelector('#signupemail').value;
    let password =document.querySelector('#signuppassword').value;
    let password2 =document.querySelector('#signuppassword2').value;

    if(username==""||email==""||password==""||password2==""){
        alert('input field should not be null');
        w.classList.add('addremove');
        return ;
    }

    if(password!=password2){
        alert('passwords didn\'t match');
        w.classList.add('addremove');
        return ;
    }

    let send_obj = {
        username,
        email,
        password
    };
    fetch('http://localhost:3001/signup',{
        method: 'POST',
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


const clickConfirm = function(){
    let w=document.querySelector('#addremove');
    w.classList.remove('addremove');
    let email = document.querySelector('#confirmemail').value;
    let code = document.querySelector('#confirmcode').value;

    if(email==""||code==""){
        alert('input field should not be null');
        w.classList.add('addremove');
        return ;
    }

    let send_obj = {
        email,
        code
    };

    fetch('http://localhost:3001/confirm',{
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