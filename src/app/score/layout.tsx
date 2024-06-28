import { SocketProvider } from "@components/providers/socket-provider";

export default function ScoreLayout({ children }) {
    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    )
}
