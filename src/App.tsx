import { useEffect, useRef, useState } from 'react'

import './App.css'
interface messagesType {
  username : string
  message : string

}
function App() {
 const [socket,setSocket] = useState<WebSocket | null>(null)
  const [messages,setMessage]= useState<messagesType[]>([])
  const [modelopen,setmodelOpen] = useState(true)
  const messageInputRef = useRef<HTMLInputElement>(null)
  useEffect(()=>{



    const ws = new WebSocket ("ws://localhost:8080")
      setSocket(ws)
    ws.onmessage= (e)=>{
      const data :messagesType =JSON.parse(e.data)
      setMessage((prev)=>[...prev ,data])
    }
  },[])
  function send(){
    const username:string = "Browser"
    const message = messageInputRef.current?.value
    if(message && socket){
      socket.send(
        JSON.stringify({
          username :username,
          message : message
        })
      )
    }
  }

  return (
  <>
<div className=' bg-neutral-900 w-screen h-screen'>
  {modelopen? <div className=' bg-neutral-900 fixed top-0 left-0 flex justify-center items-center w-screen h-screen'>
    <div className=' bg-gray-400 p-6 w-md h-80 flex flex-col justify-center  gap-15'>
      <input  className="bg-gray-100 text-black  px-6"type='text' placeholder='Name'></input>
      <button className='bg-gray-900 rounded-lg p-2 text-gray-200' onClick={()=>setmodelOpen(false)} >Join</button>

    </div>
  </div>
  :<div  className='flex flex-col gap-4  justify-between items-center w-screen h-screen '>
    <div className=' mt-10 border w-sm h-8/10 rounded-xl p-6 text-gray-300'>
      {messages?.length !== 0 ? messages.map((msg,index)=>(
        <p key = {index}>{msg.username} :{msg.message}</p>
      )) : null}
    </div>
    <div className=' botton-0 flex gap-4 items-end pb-10'>
      <input  className="bg-gray-100 text-black  px-2" ref={messageInputRef} type="text" placeholder='Message...'/>
      <button  className="bg-gray-700 rounded-lg px-6 text-gray-200" onClick={send}>Send</button>
    </div>
  </div>}
</div>
  </>)
}

export default App
