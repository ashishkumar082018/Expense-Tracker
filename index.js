const sbbtn=document.querySelector('#btn');
const ul=document.querySelector('ul');
sbbtn.addEventListener('click',add);
let id=0;
function add(event){
    event.preventDefault();
    const valam=document.querySelector("#amount").value+"-"+
    document.querySelector('#desc').value+"-"+
    document.querySelector('#category').value;
    
    
    const li=document.createElement('li');
    li.innerHTML=`${valam } <button class='delbtn'> Delete </button> <button class='edit'>Edit</button>`;
    li.setAttribute('id',id);
    localStorage.setItem(id,valam);
    id++;
   
    ul.appendChild(li);

}
ul.addEventListener('click',function(event){
    if(event.target.className==='delbtn'){
        ul.removeChild(event.target.parentNode);
        const delid=event.target.parentNode.getAttribute('id');
        localStorage.removeItem(delid);
    }
    else if(event.target.className==='edit'){
        const valam=document.querySelector("#amount").value+"-"+
    document.querySelector('#desc').value+"-"+
    document.querySelector('#category').value;
    const editid=event.target.parentNode.getAttribute('id');
    localStorage.setItem(editid,valam);
    event.target.parentNode.innerHTML=`${valam } <button class='delbtn'> Delete </button><button class='edit'>Edit</button>`;
    }
    
})