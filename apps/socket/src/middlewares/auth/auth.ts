import jwt from 'jsonwebtoken'
import { User } from '../../managers/user/User'
import { Socket } from 'socket.io'


interface userJwtClaims {
    user: {
      userId: string,
    }
}

export function extractJwtToken(session: string, socket: Socket) {
    try {
        const secret = process.env.JWT_SECRET ?? "secret"
        const decoded = jwt.verify(session, secret) as userJwtClaims
        const userId = decoded.user.userId
        const user = new User(userId, socket)
        return user
    } catch (error) {
        return null
    }
}