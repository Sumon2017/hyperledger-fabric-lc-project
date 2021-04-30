const clickRefresh = function(){
    let w=document.querySelector('#addremove');
    w.classList.remove('addremove');
    fetch('http://localhost:3001/getallnotification',{
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response =>response.json())
    .then(data => {
        console.log(data)
        let x=document.querySelector('#ourmsg');
        if(data.msg){
            if(data.msg=='no access token'||data.msg=='expired login again'||data.msg=='ip changed , pls login again'){
                alert(data.msg);
                w.classList.add('addremove');
                return ;
            }
        }
        x.innerHTML="";
        setTimeout(()=>{
            x.innerHTML=JSON.stringify(data,undefined,4);
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