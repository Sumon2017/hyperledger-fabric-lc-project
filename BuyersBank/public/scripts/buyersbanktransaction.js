const clickVerify = function(){
    let w=document.querySelector('#addremove');
    w.classList.remove('addremove');
    let lc_id = document.querySelector('#lc_id').value;
    let obj = document.querySelector('#obj').value;


    if(lc_id==""||obj==""){
        alert('input field should not be null');
        w.classList.add('addremove');
        return ;
    }


    let send_obj = {
        lc_id,
        obj
    };
    fetch('http://localhost:3003/buyersbanktransaction',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(send_obj)
    })
    .then(response =>response.json())
    .then(data => {
        setTimeout(()=>{
            let str = JSON.stringify(data,undefined,4);
            alert(str);
            w.classList.add('addremove');
            console.log('success');
        },500);
    })
    .catch((err)=>{
        w.classList.add('addremove');
        console.log("could not fetch");
        console.log(err);
    })
}