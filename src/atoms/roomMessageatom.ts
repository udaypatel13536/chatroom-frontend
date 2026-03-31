import axios from "axios";
import { atomFamily, selector, selectorFamily } from "recoil";
import { Backend_URL } from "../../config";
import { activeRoom } from "./activeroom";

export interface messageAtom{
    message_id : string;
    room_id : string;
    sender_id : string;
    content : string;
    created_at : string
}

export const roomMessage = atomFamily<messageAtom[],string>({
    key : 'roomMessage',
    default : selectorFamily<messageAtom[],string>({
        key : 'roomMessage/selector',
        get : (room_id :string)=>async()=>{
            if(!room_id || room_id === ""){
                return[]
            }
            try{
                const token = localStorage.getItem('token')

                const res = await axios.get(`${Backend_URL}/api/messages/${room_id}`,
                    {headers:{
                        'Authorization' : token
                    }}
                )
                return  res.data.data
            }catch(err){
                return[]
            }
        }
    })
})


export const messageformRoomId = selector({
    key :"messagefromRoomId",
    get :({get})=>{
        const selectedRoomId = get(activeRoom)
       const  roomMessages = get(roomMessage(selectedRoomId)) 
       return roomMessages
    }
})