const clickSign = function(){
    let w=document.querySelector('#addremove');
    w.classList.remove('addremove');
    let secret =document.querySelector('#secret').value;
    let buyers_id = document.querySelector('#buyers_id').value;
    let sellers_id =document.querySelector('#sellers_id').value;
    let carrier_org_id =document.querySelector('#carrier_org_id').value;
    let ammount =document.querySelector('#ammount').value;
    let product_details_obj =document.querySelector('#product_details_obj').value;
    let expire_time =document.querySelector('#expire_time').value;
    let pubkey =document.querySelector('#pubkey');
    let mysign =document.querySelector('#mysign');


    if(secret==""||buyers_id==""||sellers_id==""||carrier_org_id==""||ammount==""||product_details_obj==""||expire_time==""){
        alert('input field should not be null');
        w.classList.add('addremove');
        return ;
    }

    let nt = new Date();
    let d = parseInt(expire_time);
    if(d>365||d<1){
        alert('expire time should be within 1 to 365 days');
        w.classList.add('addremove');
        return ;
    }
    nt.setDate(nt.getDate()+d);
    expire_time = nt.toLocaleString();
    localStorage.setItem("lcptime",expire_time);

    let send_obj = {
        secret,
        obj:{
            buyers_id,
            sellers_id,
            carrier_org_id,
            ammount,
            product_details_obj,
            expire_time
        }
    };
    fetch('http://localhost:3005/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(send_obj)
    })
    .then(response =>response.json())
    .then(data => {
        setTimeout(()=>{
            pubkey.value = data.hex_public_key;
            mysign.value = data.sign;
            alert('success');
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


const clickCreateLc = function(){
    let w=document.querySelector('#addremove');
    w.classList.remove('addremove');
    let secret =document.querySelector('#secret').value;
    let buyers_id = document.querySelector('#buyers_id').value;
    let sellers_id =document.querySelector('#sellers_id').value;
    let carrier_org_id =document.querySelector('#carrier_org_id').value;
    let ammount =document.querySelector('#ammount').value;
    let product_details_obj =document.querySelector('#product_details_obj').value;
    let expire_time =document.querySelector('#expire_time').value;
    let pubkey =document.querySelector('#pubkey').value;
    let mysign =document.querySelector('#mysign').value;


    if(secret==""||buyers_id==""||sellers_id==""||carrier_org_id==""||ammount==""||product_details_obj==""||expire_time==""||pubkey==""||mysign==""){
        alert('input field should not be null');
        w.classList.add('addremove');
        return ;
    }

    expire_time = localStorage.getItem("lcptime");

    let send_obj = {
        buyers_id,
        sellers_id,
        carrier_org_id,
        ammount,
        product_details_obj,
        expire_time,
        sellers_public_key:pubkey,
        sellers_sign:mysign
    };
    fetch('http://localhost:3002/createlc',{
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