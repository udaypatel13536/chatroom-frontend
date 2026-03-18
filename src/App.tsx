import { useEffect, useRef, useState } from 'react'
import {Backend_URL} from '../config'
import './App.css'
interface Messagespaylod {
  username : string
  message : string
  time: number;
  roomID : string;

}
function App() {
 const [socket,setSocket] = useState<WebSocket | null>(null)
  const [messages,setMessage]= useState<Messagespaylod[]>([])
  const [modelopen,setmodelOpen] = useState(true)
  const [username , setUsarname] = useState<string | null >(null)
  const [Roomname , setRoomname] = useState <string [] >([])
  const [currentRoom,setCurrentRoom] =useState<string>()
  const messageInputRef = useRef<HTMLInputElement>(null)
  const usernameRef= useRef<HTMLInputElement>(null)
  const roomNameRef= useRef<HTMLInputElement>(null)
  useEffect(()=>{
    const ws = new WebSocket (Backend_URL)
      setSocket(ws)
      ws.onopen=()=>{
        if(Roomname.length !==0 && username){
          Roomname.forEach((room)=>{
            ws.send(JSON.stringify({
             type: "join",
            payload: {
              roomID: room,
              roomName :room,
              username: username,
              time: new Date().toISOString()
          }
          }))

        })
        }else{
          return
        }
      }
    ws.onmessage= (e)=>{
      const data :Messagespaylod =JSON.parse(e.data)
      setMessage((prev)=>[...prev ,data])
    }
    return()=>{
      ws.close()
    }
    
  },[])
  function send(){
    const inputmessage = messageInputRef.current?.value
    if(inputmessage && socket){
      socket.send(
        JSON.stringify({
          type: "chat",
      payload: {
        message: inputmessage, 
        username: username,
        time: new Date().toISOString(),
        roomID : currentRoom,
      }
        })
      )
    }

    messageInputRef.current!.value=  ""
    
  }
  function JoinRoom(){
    const roomname = roomNameRef.current?.value
    setRoomname((prev)=>[...prev ,roomname!])
    
    if(username && roomname){
      socket?.send(JSON.stringify({
         type: "join",
        payload: {
          roomID: roomname,
          roomName :roomname,
          username: username,
          time: new Date().toISOString()
      }
      }))
    }
      roomNameRef.current!.value=""


  }
  function Join(){
    const username = usernameRef.current?.value
    setUsarname(username!)
    setmodelOpen(false)
  }

  function selectRoom(room :string){
    setCurrentRoom(room)
  }

  return (
  <>
<div className=' bg-neutral-900  min-h-screen w-full h-full'>
  {modelopen? <div className=' bg-neutral-900 fixed top-0 left-0 flex justify-center items-center w-screen h-screen'>
    <div className=' bg-gray-400 p-6 w-md h-80 flex flex-col justify-center  gap-15'>
      <input ref={usernameRef} className="bg-gray-100 text-black  px-6"type='text' placeholder='Name'></input>
      <button className='bg-gray-900 rounded-lg p-2 text-gray-200' onClick={Join} >Join</button>

    </div>
  </div>
  :<div className='flex  '>
    <div className='flex flex-col gap-4 items-center w-sm h-full min-h-screen bg-neutral-800 p-4 text-lg text-gray-300'>
    <p>{username}</p>
    <input ref={roomNameRef} type='text' placeholder='Enter Room Name' className='border w-full rounded-xl px-4 p-2'/>
    <button className='border w-full rounded-xl  mb-6' onClick={JoinRoom}>Join new Room</button>
    {Roomname.map((room,index)=>(
      <div key={index} onClick={()=>selectRoom(room)} className={`w-full p-4 border rounded  flex justify-center  ${currentRoom === room ? "bg-gray-500" : " "}`}>Room : {room}</div>
    ))}
    </div>
  <div  className='flex flex-col gap-4  justify-between items-center w-full h-screen '>
    <h1 className='text-3xl fornt-extrabold text-gray-200 '>{username}</h1>

    <div className=' mt-10 border w-sm h-8/10 rounded-xl p-6 text-gray-300'>

      {messages.filter((mge)=>mge.roomID === currentRoom)?.length !== 0 ? 
      messages.filter((mge)=>mge.roomID === currentRoom).map((msg,index)=>(
        <p key = {index} > {msg.username} ({new Date(msg.time).toLocaleTimeString([],
          {hour: '2-digit', minute: '2-digit'})}) :{msg.message}</p>
        )) : null}
    </div>
    <div className=' botton-0 flex gap-4 items-end pb-10'>
      <input  className="bg-gray-100 text-black  px-2" ref={messageInputRef} type="text" placeholder='Message...'/>
      <button  className="bg-gray-700 rounded-lg px-6 text-gray-200" onClick={send}>Send</button>
    </div>
  </div>
  </div>}
</div>
  </>)
}

export default App
