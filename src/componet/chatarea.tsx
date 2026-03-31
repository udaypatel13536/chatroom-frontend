import { useRecoilValue, useRecoilValueLoadable } from "recoil"
import { messageformRoomId} from "../atoms/roomMessageatom"

import { myroomList_id } from "../atoms/myRoomList"

export default function ChatAera(){

    const room1messages = useRecoilValueLoadable(messageformRoomId) 

    const Allroom_id = useRecoilValue(myroomList_id)

     if (room1messages.state === "loading") {  
        return <div>Loading messages...</div>
    }

    if (room1messages.state === "hasError") {
        return <div>Error loading messages</div>
     }

     const messages = room1messages.contents 
    return <>
    {messages.map((messages)=>(
        <div key={messages.message_id}>{messages.content}</div>
    ))}
    {Allroom_id.map((roomId)=>(
        <div key={roomId}>{roomId}</div>
    ))}
    </>
}