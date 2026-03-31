import { useRecoilState, useRecoilValue } from "recoil"
import { roomList} from "../atoms/allRoomlistatom"
import { activeRoom } from "../atoms/activeroom";
export interface RoomList {
    room_id : string;
    name : string;
}
export default function Sidebar(){

    const rooms= useRecoilValue(roomList)
    const [avtiveRoom ,setActiveRoom] = useRecoilState(activeRoom)
     return <>
        {rooms.map((room)=>(
            <div onClick={()=>setActiveRoom(room.room_id)} key={room.room_id}>{room.name} </div>

        ))}
    </>
}