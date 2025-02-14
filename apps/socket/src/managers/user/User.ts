import {Socket} from 'socket.io'
export class User{
    private _userId: string
    private _socket: Socket
    constructor(userId: string, socket: Socket ){
        this._userId = userId;
        this._socket = socket;
    }

    public get userId(){
        return this._userId
    }

    public get socket(){
        return this._socket
    }
}