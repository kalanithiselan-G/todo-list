import React, { useEffect, useState } from 'react'

function Todo() {

   const [title,settitle]= useState("");
   const [des,setdes]= useState("");
   const [Store,setStore] = useState([]);
   const [error,setError] = useState("");
   const [message,setmessage]=useState("")
   //update
   const[update,setUpdate] = useState(-1);
   const [edititle,setEdititle]= useState("");
   const [edides,setEdides]= useState("");

      //backend
   const apiUrl = 'http://localhost:8000';
   const handleAdd = ()=>{
        setError("")
        if (title.trim()!=="" && des.trim()!=="") {
          fetch(apiUrl+"/todo",{
            method:"POST",
            headers:{
              "Content-Type": "application/json"
            },
            body:JSON.stringify({title,des})
          })
          .then((res)=>{
            if(res.ok){
                  setStore([...Store,{title,des}]);
                  setmessage("todo item added sucessfully");
                  settitle("");
                  setdes("");
                  setTimeout(() => {
                    setmessage("");
                  }, 3000);
            }
            else{
                setError("unable to create todo item");
            }
          }).catch(()=>{
            setError("unable to create todo")
          })

        }

   }
  useEffect(()=>{
    getItem()
  },[])
    const getItem = ()=>{
      fetch(apiUrl+"/todo")
      .then((res)=>{
        return res.json()
      })
      .then((res)=>{
           setStore(res);
      })

    }

    //update
    const handleGetupdate=(item)=>{
       setUpdate(item._id);
       setEdititle(item.title);
       setEdides(item.des);

    }
    const handleUpdate = () =>{
      fetch(apiUrl+"/todo/"+update,{
        method:"PUT",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({title:edititle,des:edides})
      })
      .then((res)=>{
       if(res.ok){
       const updated =  Store.map((item)=>{
         if(update==item._id){
          item.title=edititle;
          item.des=edides;
         }
         return item;
        })
        setStore(updated);
        setmessage("todo item updated sucessfully");
        setEdititle("");
        setEdides("");
        setUpdate(-1);
       }
      })

    }
    //update
    //delete
const handleDelete = (_id) => {
  if (window.confirm("Are you sure to delete this item")) {
    fetch(apiUrl + "/todo/" + _id, {
      method: "DELETE",
    }).then(() => {
      const deleted = Store.filter((item) => {
        return item._id !== _id;
      });
      setStore(deleted);
    });
  }
};

  return (
    <>
    <div className="fw-bold fs-4 p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle ">
      ToDo Project With MEAN Stack
    </div>
    {message && <p>{message}</p>}
      <div className='p-3'>
        <div>
      <input
      className='m-2 p-2 fw-medium rounded-2 '
      value={title}
      onChange={(e)=>settitle(e.target.value)}
      placeholder='Enter title Name'
      required
      />
      <input
      className='m-2 p-2 fw-medium  rounded-2'
      value={des}
      onChange={(e)=>setdes(e.target.value)}
      placeholder='Enter description Name'
      required
      />
        </div>
      <button  className=" btn-sm m-2 btn btn-success rounded-3" onClick={handleAdd}>Add Todo</button>
    </div>
    {error && <p>{error}</p>}
    <div className='m-2 p-2'>
      {Store.map((item)=>
      <div >
      {update == -1 || update !== item._id ? 
      <>
      <span className='fs-1 fw-medium'>{item.title} <br/> </span>
      <span className='fw-medium fs-5'>{item.des}</span>
      <br/> 
      </>:
      <div>
       <input
      className='m-2 p-2 fw-medium rounded-2 '
      value={edititle}
      onChange={(e)=>setEdititle(e.target.value)}
      placeholder='Enter title Name'
      />
      <input
      className='m-2 p-2 fw-medium rounded-2 '
      value={edides}
      onChange={(e)=>setEdides(e.target.value)}
      placeholder='Enter description Name'
      
      />
      <br/> </div> 
      }
      {update == -1|| update !== item._id  ? <button className=" btn-sm  btn btn-dark rounded-3" onClick={()=>{handleGetupdate(item)}}>Edit </button > : <button className=" btn-sm m-2 btn-success btn rounded-3" onClick={handleUpdate}>update</button>}

      {update == -1|| update !== item._id ? <button className=" btn-sm m-2 btn  btn-danger rounded-3" onClick={()=>handleDelete(item._id)}>Delete</button>  : <button className=" btn-sm m-2 btn-primary btn rounded-3" onClick={()=>{setUpdate(-1)}}>cancel</button>}
      
      <br/></div>
      )}
     </div>
    </>
  )
}

export default Todo
