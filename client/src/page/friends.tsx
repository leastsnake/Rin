import { useState, useRef, useEffect, useContext } from "react"
import { Header } from "../components/header"
import { Padding } from "../components/padding"
import { client } from "../main"
import { Input } from "../components/input"
import { headersWithAuth } from "../utils/auth"
import { ProfileContext } from "../state/profile"

export function FriendsPage() {
    return (<>
        <Header />
        <Padding>
            <Friends />
        </Padding>
    </>)
}

type FriendItem = {
    name: string;
    id: number;
    uid: number;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    desc: string | null;
    url: string;
    accepted: number;
    health: number;
};
type ApplyItem = {
    name: string;
    id: number;
    uid: number;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
    desc: string | null;
    url: string;
    accepted: number;
    health: number;
};

async function publish({ name, avatar, desc, url }: { name: string, avatar: string, desc: string, url: string }) {
    const { data, error } = await client.friend.index.post({
        avatar,
        name,
        desc,
        url
    }, {
        headers: headersWithAuth()
    })
    if (error) {
        alert(error.value)
    } else {
        alert("创建成功")
        window.location.reload()
    }
}

function Friends() {
    let [friends, setFriends] = useState<FriendItem[]>()
    let [apply, setApply] = useState<ApplyItem>()
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [avatar, setAvatar] = useState("")
    const [url, setUrl] = useState("")
    const profile = useContext(ProfileContext);

    const ref = useRef(false)
    useEffect(() => {
        if (ref.current) return
        client.friend.index.get().then(({ data }) => {
            if (data) {
                setFriends(data.friend_list)
                if (data.apply_list)
                    setApply(data.apply_list)
            }
        })
        ref.current = true
    }, [])

    function publishButton() {
        publish({ name, desc, avatar, url })
    }
    return (<>
        <div className="w-full flex flex-col justify-center items-center">
            <div className="wauto text-start text-black p-4 text-4xl font-bold">
                <p>
                    朋友们
                </p>
                <p className="text-sm mt-4 text-neutral-500 font-normal">
                    梦想的同行者
                </p>
            </div>
            <div className="wauto grid grid-cols-4 gap-4">
                {friends?.map((friend) => (
                    <>
                        <Friend friend={friend} />
                    </>
                ))}
            </div>
            {profile && profile.permission &&
                <div className="wauto flex text-start text-black text-2xl font-bold mt-8">
                    <div className="md:basis-1/2 bg-white rounded-xl p-4">
                        <p>
                            创建友链
                        </p>
                        <div className="text-sm mt-4 text-neutral-500 font-normal">
                            <Input value={name} setValue={setName} placeholder="站点名称" />
                            <Input value={desc} setValue={setDesc} placeholder="描述" className="mt-2" />
                            <Input value={avatar} setValue={setAvatar} placeholder="头像地址" className="mt-2" />
                            <Input value={url} setValue={setUrl} placeholder="地址" className="my-2" />
                            <div className='flex flex-row justify-center'>
                                <button onClick={publishButton} className='basis-1/2 bg-theme text-white py-4 rounded-full shadow-xl shadow-neutral-200'>创建</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    </>)
}

function Friend({ friend }: { friend: FriendItem }) {
    return (
        <>
            <div onClick={() => window.open(friend.url)} className="hover:bg-neutral-200 w-full bg-white rounded-xl p-4 flex flex-col justify-center items-center">
                <div className="w-16 h-16">
                    <img className="rounded-xl" src={friend.avatar} alt={friend.name} />
                </div>
                <p className="text-base text-center">{friend.name}</p>
                <p className="text-sm text-neutral-500 text-center">{friend.desc}</p>
            </div>
        </>
    )
}